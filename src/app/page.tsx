"use client";

import React, { useState, useEffect } from "react";
import { ModuleItem, UserProfile, Checkpoint } from "@/types";
import { initialModules } from "@/lib/initialData";
import { StorageService } from "@/lib/storage";
import { Header } from "@/components/layout/Header";
import { BentoGrid } from "@/components/bento/BentoGrid";
import { GymModule } from "@/components/modules/GymModule";
import { Print3DModule } from "@/components/modules/Print3DModule";
import { SavingsModule } from "@/components/modules/SavingsModule";
import { BooksModule } from "@/components/modules/BooksModule";
import { EnglishModule } from "@/components/modules/EnglishModule";
import { WorkModule } from "@/components/modules/WorkModule";
import { CustomModule } from "@/components/modules/CustomModule";
import { QuickActionModal } from "@/components/modals/QuickActionModal";
import { AddModuleModal } from "@/components/modals/AddModuleModal";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { EditCheckpointModal } from "@/components/roadmap/EditCheckpointModal";

export default function Home() {
  const [modules, setModules] = useState<ModuleItem[]>(initialModules);
  const [activeModule, setActiveModule] = useState<ModuleItem | null>(null);
  const [waterMl, setWaterMl] = useState(1750);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);

  // Modals
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Checkpoint Edit / Detail Modal
  const [isEditCheckpointOpen, setIsEditCheckpointOpen] = useState(false);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | null>(null);

  useEffect(() => {
    const prof = StorageService.getProfile();
    setProfile(prof);
    setModules(StorageService.getModules());
    setWaterMl(StorageService.getWater());
    setCheckpoints(StorageService.getCheckpoints());

    if (!prof.isOnboarded) {
      setIsOnboardingOpen(true);
    }
  }, []);

  const handleAddWater = (deltaMl: number) => {
    const updated = Math.min(4000, waterMl + deltaMl);
    setWaterMl(updated);
    StorageService.saveWater(updated);
  };

  const handleAddWeight = (kg: number) => {
    StorageService.addWeightLog(kg);
    setModules(StorageService.getModules());
  };

  const handleAddSavings = (amount: number) => {
    const goals = StorageService.getSavingsGoals();
    if (goals.length > 0) {
      StorageService.depositSavings(goals[0].id, amount);
      setModules(StorageService.getModules());
    }
  };

  const handleAddBookPages = (deltaPages: number) => {
    const books = StorageService.getBooks();
    const readingBook = books.find((b) => b.status === "reading");
    if (readingBook) {
      const updated = books.map((b) => {
        if (b.id === readingBook.id) {
          const next = Math.min(b.totalPages, b.currentPage + deltaPages);
          return {
            ...b,
            currentPage: next,
            status: (next >= b.totalPages ? "completed" : "reading") as any,
          };
        }
        return b;
      });
      StorageService.saveBooks(updated);
      setModules(StorageService.getModules());
    }
  };

  const handleAddModule = (newMod: ModuleItem) => {
    const updated = [...modules, newMod];
    setModules(updated);
    StorageService.saveModules(updated);
  };

  const handleToggleCheckpoint = (id: string) => {
    const updated = StorageService.toggleCheckpoint(id);
    setCheckpoints(updated);
  };

  const handleOpenEditCheckpoint = (cp: Checkpoint | null) => {
    setSelectedCheckpoint(cp);
    setIsEditCheckpointOpen(true);
  };

  const handleSaveCheckpoint = (cp: Checkpoint) => {
    let updated: Checkpoint[];
    if (checkpoints.some((x) => x.id === cp.id)) {
      updated = StorageService.updateCheckpoint(cp);
    } else {
      updated = StorageService.addCheckpoint(cp);
    }
    setCheckpoints(updated);
    setIsEditCheckpointOpen(false);
  };

  const handleDeleteCheckpoint = (id: string) => {
    const updated = StorageService.deleteCheckpoint(id);
    setCheckpoints(updated);
    setIsEditCheckpointOpen(false);
  };

  const handleCompleteOnboarding = (updatedProfile: UserProfile) => {
    StorageService.saveProfile(updatedProfile);
    setProfile(updatedProfile);
    setCheckpoints(StorageService.getCheckpoints());
    setModules(StorageService.getModules());
    setIsOnboardingOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0f14] max-w-lg mx-auto border-x border-white/[0.05] relative shadow-2xl">
      {/* Top App Header */}
      <Header
        activeModuleTitle={activeModule?.title}
        activeModuleIcon={activeModule?.icon || activeModule?.category}
        userName={profile?.name || "Малой"}
        onBack={() => setActiveModule(null)}
        onOpenQuickAction={() => setIsQuickActionOpen(true)}
        onOpenAddModule={() => setIsAddModuleOpen(true)}
        onOpenProfile={() => setIsOnboardingOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 pb-20 overflow-y-auto">
        {!activeModule ? (
          <BentoGrid
            modules={modules}
            waterMl={waterMl}
            checkpoints={checkpoints}
            onAddWater={handleAddWater}
            onSelectModule={(mod) => setActiveModule(mod)}
            onOpenAddModule={() => setIsAddModuleOpen(true)}
            onToggleCheckpoint={handleToggleCheckpoint}
            onEditProfile={() => setIsOnboardingOpen(true)}
            onOpenEditCheckpoint={handleOpenEditCheckpoint}
          />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
            {activeModule.category === "gym" && <GymModule />}
            {activeModule.category === "3d" && <Print3DModule />}
            {activeModule.category === "savings" && <SavingsModule />}
            {activeModule.category === "reading" && <BooksModule />}
            {activeModule.category === "english" && <EnglishModule />}
            {activeModule.category === "work" && <WorkModule />}
            {activeModule.category === "custom" && <CustomModule module={activeModule} />}
          </div>
        )}
      </main>

      {/* Edit / View Checkpoint Modal */}
      <EditCheckpointModal
        isOpen={isEditCheckpointOpen}
        checkpoint={selectedCheckpoint}
        onClose={() => setIsEditCheckpointOpen(false)}
        onSave={handleSaveCheckpoint}
        onDelete={handleDeleteCheckpoint}
        onToggleComplete={handleToggleCheckpoint}
      />

      {/* Onboarding / Profile Setup Survey */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleCompleteOnboarding}
        onClose={profile?.isOnboarded ? () => setIsOnboardingOpen(false) : undefined}
        initialProfile={profile || undefined}
      />

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        onAddWater={handleAddWater}
        onAddWeight={handleAddWeight}
        onAddSavings={handleAddSavings}
        onAddBookPages={handleAddBookPages}
      />

      {/* Add Custom Module Modal */}
      <AddModuleModal
        isOpen={isAddModuleOpen}
        onClose={() => setIsAddModuleOpen(false)}
        onAddModule={handleAddModule}
      />
    </div>
  );
}
