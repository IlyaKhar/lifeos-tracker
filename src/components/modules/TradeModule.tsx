"use client";

import React, { useState, useEffect } from "react";
import { TradeProduct, TradeSale } from "@/types";
import { StorageService } from "@/lib/storage";
import {
  Package,
  TrendingUp,
  Plus,
  ShoppingBag,
  DollarSign,
  Boxes,
  Trash2,
  CheckCircle2,
  Tag,
  ArrowUpRight,
  Store,
  ChevronDown,
} from "lucide-react";
import confetti from "canvas-confetti";

export const TradeModule: React.FC = () => {
  const [products, setProducts] = useState<TradeProduct[]>([]);
  const [sales, setSales] = useState<TradeSale[]>([]);

  // Forms State
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddSale, setShowAddSale] = useState(false);

  // New Product Form
  const [prodTitle, setProdTitle] = useState("");
  const [prodCategory, setProdCategory] = useState("Электроника");
  const [prodBuyPrice, setProdBuyPrice] = useState("");
  const [prodSellPrice, setProdSellPrice] = useState("");
  const [prodQuantity, setProdQuantity] = useState("10");

  // New Sale Form
  const [selectedProductId, setSelectedProductId] = useState("");
  const [saleQuantity, setSaleQuantity] = useState("1");
  const [saleCustomPrice, setSaleCustomPrice] = useState("");
  const [saleChannel, setSaleChannel] = useState("Авито");

  useEffect(() => {
    const prods = StorageService.getTradeProducts();
    setProducts(prods);
    if (prods.length > 0 && !selectedProductId) {
      setSelectedProductId(prods[0].id);
      setSaleCustomPrice(prods[0].sellPriceRub.toString());
    }
    setSales(StorageService.getTradeSales());
  }, []);

  const handleProductSelectForSale = (id: string) => {
    setSelectedProductId(id);
    const p = products.find((x) => x.id === id);
    if (p) {
      setSaleCustomPrice(p.sellPriceRub.toString());
    }
  };

  // 1. Add Product
  const handleSaveProduct = () => {
    if (!prodTitle.trim()) return;
    const buyPrice = parseFloat(prodBuyPrice) || 0;
    const sellPrice = parseFloat(prodSellPrice) || 0;
    const qty = parseInt(prodQuantity) || 1;

    const item: TradeProduct = {
      id: "prod_" + Date.now(),
      title: prodTitle.trim(),
      category: prodCategory.trim() || "Товары",
      buyPriceRub: buyPrice,
      sellPriceRub: sellPrice,
      totalQuantity: qty,
      stockQuantity: qty,
      dateAdded: new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" }).format(new Date()),
    };

    const updated = StorageService.addTradeProduct(item);
    setProducts(updated);
    if (!selectedProductId) {
      setSelectedProductId(item.id);
      setSaleCustomPrice(item.sellPriceRub.toString());
    }

    setShowAddProduct(false);
    setProdTitle("");
    setProdBuyPrice("");
    setProdSellPrice("");
    setProdQuantity("10");
  };

  // 2. Add Sale
  const handleSaveSale = () => {
    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) return;

    const qty = Math.max(1, Math.min(prod.stockQuantity, parseInt(saleQuantity) || 1));
    const salePrice = parseFloat(saleCustomPrice) || prod.sellPriceRub;
    const costPrice = prod.buyPriceRub;
    const revenue = salePrice * qty;
    const profit = (salePrice - costPrice) * qty;

    const saleItem: TradeSale = {
      id: "sale_" + Date.now(),
      productId: prod.id,
      productTitle: prod.title,
      quantity: qty,
      salePriceRub: salePrice,
      costPriceRub: costPrice,
      revenueRub: revenue,
      profitRub: profit,
      channel: saleChannel,
      date: new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date()),
    };

    const res = StorageService.addTradeSale(saleItem);
    setSales(res.sales);
    setProducts(res.products);

    if (profit > 0) {
      confetti({ particleCount: 45, spread: 65, origin: { y: 0.7 } });
    }

    setShowAddSale(false);
    setSaleQuantity("1");
  };

  // Quick 1-click Sale from card
  const handleQuickSaleOne = (prod: TradeProduct) => {
    if (prod.stockQuantity <= 0) return;
    const saleItem: TradeSale = {
      id: "sale_" + Date.now(),
      productId: prod.id,
      productTitle: prod.title,
      quantity: 1,
      salePriceRub: prod.sellPriceRub,
      costPriceRub: prod.buyPriceRub,
      revenueRub: prod.sellPriceRub,
      profitRub: prod.sellPriceRub - prod.buyPriceRub,
      channel: "Авито",
      date: new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" }).format(new Date()),
    };

    const res = StorageService.addTradeSale(saleItem);
    setSales(res.sales);
    setProducts(res.products);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Удалить этот товар со склада?")) {
      const updated = StorageService.deleteTradeProduct(id);
      setProducts(updated);
    }
  };

  const handleDeleteSale = (id: string) => {
    if (confirm("Отменить эту продажу? Товар вернется на склад.")) {
      const updated = StorageService.deleteTradeSale(id);
      setSales(updated);
      setProducts(StorageService.getTradeProducts());
    }
  };

  // Analytics Computation
  const totalRevenue = sales.reduce((sum, s) => sum + (s.revenueRub || 0), 0);
  const totalProfit = sales.reduce((sum, s) => sum + (s.profitRub || 0), 0);
  const totalCostSold = sales.reduce((sum, s) => sum + (s.costPriceRub * s.quantity || 0), 0);
  const overallROI = totalCostSold > 0 ? Math.round((totalProfit / totalCostSold) * 100) : 0;
  const capitalInStock = products.reduce((sum, p) => sum + p.buyPriceRub * p.stockQuantity, 0);
  const totalStockPieces = products.reduce((sum, p) => sum + p.stockQuantity, 0);

  // Selected product preview for modal
  const activeProdForSale = products.find((p) => p.id === selectedProductId);
  const calcSaleProfit = activeProdForSale
    ? ((parseFloat(saleCustomPrice) || activeProdForSale.sellPriceRub) - activeProdForSale.buyPriceRub) * (parseInt(saleQuantity) || 1)
    : 0;

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Header & KPI Financial Card */}
      <div className="apple-card p-5 rounded-3xl space-y-4 border border-rose-500/20 bg-gradient-to-b from-[#1b1722] to-[#12141a]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>Товарка & Бизнес</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                  PROFIT
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Склад, маржа и журнал продаж</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setShowAddSale(true);
                setShowAddProduct(false);
              }}
              className="px-3 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-slate-950 text-xs font-bold active:scale-95 transition-all shadow-md flex items-center gap-1"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Продажа</span>
            </button>
            <button
              onClick={() => {
                setShowAddProduct(true);
                setShowAddSale(false);
              }}
              className="p-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 active:scale-95 transition-all"
              title="Закупка товара"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Big Net Profit Display */}
        <div className="pt-1">
          <div className="text-[11px] text-slate-400 font-medium">Чистая прибыль за всё время</div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-white">
              {totalProfit >= 0 ? `+${totalProfit.toLocaleString("ru-RU")}` : totalProfit.toLocaleString("ru-RU")}
            </span>
            <span className="text-base font-bold text-rose-400">₽</span>
            {overallROI > 0 && (
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                ROI +{overallROI}%
              </span>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06]">
          <div className="p-2.5 rounded-2xl bg-white/[0.03]">
            <div className="text-[10px] text-slate-400">Выручка (Оборот)</div>
            <div className="text-xs font-mono font-bold text-slate-200 mt-0.5 truncate">
              {totalRevenue.toLocaleString("ru-RU")} ₽
            </div>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/[0.03]">
            <div className="text-[10px] text-slate-400">На складе (Деньги)</div>
            <div className="text-xs font-mono font-bold text-amber-300 mt-0.5 truncate">
              {capitalInStock.toLocaleString("ru-RU")} ₽
            </div>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/[0.03]">
            <div className="text-[10px] text-slate-400">Остаток товаров</div>
            <div className="text-xs font-mono font-bold text-rose-300 mt-0.5">
              {totalStockPieces} шт.
            </div>
          </div>
        </div>
      </div>

      {/* 2. New Product Form (Закупка партии) */}
      {showAddProduct && (
        <div className="apple-card p-4 rounded-3xl space-y-3 border border-rose-500/30 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5 text-rose-400" />
              <span>Закупка товара на склад</span>
            </span>
            <button
              onClick={() => setShowAddProduct(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Название товара</label>
              <input
                type="text"
                placeholder="Например: Наушники Air 2 / Чехлы MagSafe / Смарт-часы"
                value={prodTitle}
                onChange={(e) => setProdTitle(e.target.value)}
                className="w-full bg-[#1b1f2a] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Категория</label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                  className="w-full bg-[#1b1f2a] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Электроника">Электроника</option>
                  <option value="Аксессуары">Аксессуары</option>
                  <option value="Одежда/Обувь">Одежда/Обувь</option>
                  <option value="Автотовары">Автотовары</option>
                  <option value="Разное">Разное</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Количество (шт.)</label>
                <input
                  type="number"
                  placeholder="10"
                  value={prodQuantity}
                  onChange={(e) => setProdQuantity(e.target.value)}
                  className="w-full bg-[#1b1f2a] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Закупка (₽ за шт.)</label>
                <input
                  type="number"
                  placeholder="800"
                  value={prodBuyPrice}
                  onChange={(e) => setProdBuyPrice(e.target.value)}
                  className="w-full bg-[#1b1f2a] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Продажа (₽ за шт.)</label>
                <input
                  type="number"
                  placeholder="2200"
                  value={prodSellPrice}
                  onChange={(e) => setProdSellPrice(e.target.value)}
                  className="w-full bg-[#1b1f2a] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            {/* Profit potential preview */}
            {parseFloat(prodBuyPrice) > 0 && parseFloat(prodSellPrice) > 0 && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300 flex items-center justify-between">
                <span>Потенциал с партии ({parseInt(prodQuantity) || 1} шт):</span>
                <span className="font-bold font-mono text-emerald-400">
                  +{(((parseFloat(prodSellPrice) || 0) - (parseFloat(prodBuyPrice) || 0)) * (parseInt(prodQuantity) || 1)).toLocaleString("ru-RU")} ₽
                </span>
              </div>
            )}

            <button
              onClick={handleSaveProduct}
              className="w-full py-2 bg-rose-500 text-slate-950 font-bold rounded-xl text-xs active:scale-95 transition-all shadow-md mt-1"
            >
              Добавить партию на склад
            </button>
          </div>
        </div>
      )}

      {/* 3. New Sale Form (Фиксация продажи) */}
      {showAddSale && (
        <div className="apple-card p-4 rounded-3xl space-y-3 border border-emerald-500/30 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
              <span>Зафиксировать продажу</span>
            </span>
            <button
              onClick={() => setShowAddSale(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {products.filter((p) => p.stockQuantity > 0).length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400 space-y-2">
              <p>На складе нет товаров в наличии.</p>
              <button
                onClick={() => {
                  setShowAddSale(false);
                  setShowAddProduct(true);
                }}
                className="px-3 py-1 bg-white/[0.06] rounded-xl text-rose-300 font-bold"
              >
                + Закупить товар
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Выбери товар</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => handleProductSelectForSale(e.target.value)}
                  className="w-full bg-[#1b1f2a] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white"
                >
                  {products
                    .filter((p) => p.stockQuantity > 0)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} (ост. {p.stockQuantity} шт.) — розница {p.sellPriceRub} ₽
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Кол-во продано (шт.)</label>
                  <input
                    type="number"
                    min="1"
                    max={activeProdForSale?.stockQuantity || 1}
                    value={saleQuantity}
                    onChange={(e) => setSaleQuantity(e.target.value)}
                    className="w-full bg-[#1b1f2a] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Цена продажи за шт (₽)</label>
                  <input
                    type="number"
                    value={saleCustomPrice}
                    onChange={(e) => setSaleCustomPrice(e.target.value)}
                    className="w-full bg-[#1b1f2a] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Канал продажи</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {["Авито", "Telegram", "Лично", "Маркетплейс"].map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setSaleChannel(ch)}
                      className={`py-1.5 rounded-xl text-[10px] font-semibold border transition-all ${
                        saleChannel === ch
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                          : "bg-white/[0.03] border-transparent text-slate-400 hover:text-white"
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instant Profit Indicator */}
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-emerald-300/80">Чистая прибыль со сделки:</div>
                  <div className="text-base font-mono font-bold text-emerald-400">
                    +{calcSaleProfit.toLocaleString("ru-RU")} ₽
                  </div>
                </div>
                <div className="text-right text-[10px] text-slate-400">
                  Выручка: {((parseFloat(saleCustomPrice) || 0) * (parseInt(saleQuantity) || 1)).toLocaleString("ru-RU")} ₽
                </div>
              </div>

              <button
                onClick={handleSaveSale}
                className="w-full py-2.5 bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs active:scale-95 transition-all shadow-md"
              >
                Зафиксировать продажу 🚀
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. Products Inventory (Склад товаров) */}
      <div className="apple-card p-4 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-bold text-white tracking-tight">Товары на складе ({products.length})</span>
          </div>
          <button
            onClick={() => setShowAddProduct(true)}
            className="text-[11px] text-rose-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <Plus className="w-3 h-3" />
            <span>Новый товар</span>
          </button>
        </div>

        {products.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 space-y-2">
            <p>Склад пока пуст. Занеси первую партию товаров!</p>
            <button
              onClick={() => setShowAddProduct(true)}
              className="px-4 py-2 bg-rose-500 text-slate-950 rounded-2xl font-bold active:scale-95 transition-all shadow"
            >
              + Закупить товар
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {products.map((p) => {
              const marginPerPiece = p.sellPriceRub - p.buyPriceRub;
              const isLowStock = p.stockQuantity <= 2 && p.stockQuantity > 0;
              const isOutOfStock = p.stockQuantity === 0;

              return (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl bg-[#1b1f2a] flex items-center justify-between gap-3 group border border-white/[0.04]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">{p.title}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-400">
                        {p.category}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2 font-mono flex-wrap">
                      <span>Закупка: {p.buyPriceRub} ₽</span>
                      <span>•</span>
                      <span>Продажа: {p.sellPriceRub} ₽</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">
                        Маржа: +{marginPerPiece} ₽/шт
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          isOutOfStock
                            ? "bg-slate-500/20 text-slate-400"
                            : isLowStock
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-rose-500/20 text-rose-300"
                        }`}
                      >
                        {isOutOfStock
                          ? "Распродано"
                          : `Остаток: ${p.stockQuantity} из ${p.totalQuantity} шт.`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {!isOutOfStock && (
                      <button
                        onClick={() => handleQuickSaleOne(p)}
                        className="px-2.5 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold active:scale-95 transition-all flex items-center gap-1"
                        title="Продать 1 штуку в 1 клик"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Продать 1 шт</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                      title="Удалить товар"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Sales Journal (История продаж) */}
      <div className="apple-card p-4 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white tracking-tight">Журнал продаж ({sales.length})</span>
          </div>
        </div>

        {sales.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500">
            Сделок пока не было. Нажми «Продажа», когда отдашь первый товар клиенту!
          </div>
        ) : (
          <div className="space-y-2">
            {sales.map((s) => (
              <div
                key={s.id}
                className="p-3 rounded-2xl bg-[#1b1f2a] flex items-center justify-between gap-3 border border-white/[0.03]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate">
                      {s.quantity > 1 ? `${s.quantity} шт. • ` : ""}{s.productTitle}
                    </span>
                    {s.channel && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-400">
                        {s.channel}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                    Выручка: {s.revenueRub.toLocaleString("ru-RU")} ₽ • {s.date}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-emerald-400">
                      +{s.profitRub.toLocaleString("ru-RU")} ₽
                    </div>
                    <div className="text-[9px] text-slate-500 font-semibold">чистыми</div>
                  </div>
                  <button
                    onClick={() => handleDeleteSale(s.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                    title="Отменить сделку"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

