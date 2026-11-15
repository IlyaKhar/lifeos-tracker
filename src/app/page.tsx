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
import { AddModuleModal } from "@/components/modals/AddModuleModal";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { EditCheckpointModal } from "@/components/roadmap/EditCheckpointModal";
import { AICoachModal } from "@/components/ai/AICoachModal";

export default function Home() {
  const [modules, setModules] = useState<ModuleItem[]>(initialModules);
  const [activeModule, setActiveModule] = useState<ModuleItem | null>(null);
  const [waterMl, setWaterMl] = useState(1750);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);

  // Modals
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  // Checkpoint Edit / Detail Modal
  const [isEditCheckpointOpen, setIsEditCheckpointOpen] = useState(false);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | null>(null);

  const refreshData = () => {
    const prof = StorageService.getProfile();
    setProfile(prof);
    setModules(StorageService.getModules());
    setWaterMl(StorageService.getWater());
    setCheckpoints(StorageService.getCheckpoints());
  };

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
        userName={profile?.name || "Илья"}
        onBack={() => {
          setActiveModule(null);
          refreshData();
        }}
        onOpenAddModule={() => setIsAddModuleOpen(true)}
        onOpenProfile={() => setIsOnboardingOpen(true)}
        onOpenAI={() => setIsAIOpen(true)}
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

      {/* Add Custom Module Modal */}
      <AddModuleModal
        isOpen={isAddModuleOpen}
        onClose={() => setIsAddModuleOpen(false)}
        onAddModule={handleAddModule}
      />

      {/* AI Coach Assistant Modal */}
      <AICoachModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        userContext={{ profile, checkpoints }}
      />
    </div>
  );
}
