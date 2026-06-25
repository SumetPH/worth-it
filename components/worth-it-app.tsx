"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ChevronDown, Download, Pencil, Plus, Trash2, Upload } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  PROFILE_KEY,
  STORAGE_KEY,
  categories,
  createBackupFileName,
  createBackupPayload,
  defaultProfile,
  demoItems,
  emptyItem,
  evidenceLevelLabels,
  evidenceLevels,
  formatCurrency,
  getFunBudgetLeft,
  normalizeFinancialProfile,
  normalizeItems,
  parseBackupPayload,
  productTypeLabels,
  productTypes,
  purchaseStageLabels,
  scoreItem,
  sortItems,
  upgradeReasonLabels,
  type FinancialProfile,
  type PurchaseStage,
  type SortMode,
  type UpgradeReason,
  type WishItem,
} from "@/lib/worth-it";

type Draft = Omit<WishItem, "id" | "createdAt">;
type RestoreStatus = { tone: "success" | "error"; message: string } | null;

const rules = [
  ["Monthly Fun", "แสดงเมื่อราคาของชิ้นนี้ไม่เกินงบความสุขที่เหลือในเดือนนี้"],
  ["Saved", "แสดงเมื่อของแพงกว่างบเดือนนี้ แต่คุณเก็บเงินเพื่อชิ้นนี้ครบแล้ว"],
  ["Needs plan", "แสดงเมื่อราคาเกินงบเดือนนี้ และยังไม่ได้ใส่จำนวนเงินที่จะกันเพิ่มต่อเดือน"],
  ["X mo left", "แสดงเมื่อมีแผนเก็บเงินแล้ว เช่น 4 mo left หมายถึงต้องเก็บอีกประมาณ 4 เดือน"],
  ["Needs profile", "แสดงเมื่อยังไม่ได้ตั้งงบความสุขรายเดือนใน Financial Profile"],
  ["Too risky", "แสดงเมื่อวิธีจ่ายต้องเป็นหนี้ หรือแตะเงินลงทุน/เงินสำรอง"],
] as const;

const emptySubscribe = () => () => {};

const paymentPlanOptions = [
  { value: "cash" as const, label: "💵 จ่ายสด", description: "ใช้จากงบความสุขเดือนนี้ หรือเงินเก็บสำหรับชิ้นนี้โดยเฉพาะ" },
  { value: "reserved-installment" as const, label: "💳 ผ่อน 0% ปลอดภัย", description: "แบ่งจ่ายแต่มีเงินสดเต็มจำนวนกันสำรองไว้เรียบร้อยแล้ว" },
  { value: "debt" as const, label: "🚨 การเงินเสี่ยง", description: "ต้องกู้เงิน/รูดบัตรที่ไม่มีเงินจ่ายเต็ม หรือดึงเงินสำรองฉุกเฉินมาใช้" },
];

const needGateOptions = [
  { value: "essential" as const, label: "🚨 จำเป็นวิกฤต", description: "ไม่มีแล้วชีวิต/งานมีปัญหาร้ายแรงทันที" },
  { value: "useful" as const, label: "✨ มีประโยชน์ชัด", description: "ช่วยให้สะดวกสบายขึ้นมาก แต่ไม่มีก็ยังใช้ชีวิตต่อได้" },
  { value: "nice" as const, label: "🧸 สนองความสุข", description: "อยากได้เพื่อความเพลิดเพลิน ไม่มีก็ไม่กระทบอะไรเลย" },
];

const usageGateOptions = [
  { value: "daily" as const, label: "📅 ทุกวัน / เกือบทุกวัน", description: "เช่น มือถือ, เก้าอี้ทำงาน" },
  { value: "weekly" as const, label: "🔁 ทุกสัปดาห์", description: "เช่น รองเท้าวิ่ง, อุปกรณ์ทำความสะอาด" },
  { value: "monthly" as const, label: "🌑 เดือนละครั้ง หรือน้อยกว่า", description: "เช่น เต็นท์แคมป์ปิ้ง, กล้องท่องเที่ยว" },
];

const replacementGateOptions = [
  { value: "replace" as const, label: "♻️ แทนของเดิม", description: "ซื้อเพื่อทดแทนของเก่าที่เสียหรือพังแล้ว" },
  { value: "upgrade" as const, label: "⚡ อัปเกรดของเดิม", description: "ซื้ออัปเกรดจากของเดิมที่ยังดีอยู่แต่ต้องการประสิทธิภาพเพิ่ม" },
  { value: "duplicate" as const, label: "👥 ซื้อซ้ำ/เพิ่ม", description: "ซื้อเพิ่มทั้งที่มีของทำหน้าที่เดียวกันอยู่แล้วและสภาพยังดี" },
];

const timingGateOptions = [
  { value: "now" as const, label: "⏰ ต้องซื้อช่วงนี้", description: "ถ้าช้ากว่านี้จะเสียโอกาสสำคัญหรือเกิดปัญหาเดือดร้อน" },
  { value: "wait" as const, label: "⏳ รอได้อีก", description: "รออีก 1-3 เดือนได้โดยไม่มีอะไรเสียหาย" },
  { value: "bad" as const, label: "❌ จังหวะยังไม่ดี", description: "มีค่าใช้จ่ายเร่งด่วนอื่น หรือยังไม่มีเวลาใช้งานจริงช่วงนี้" },
];

const alternativeGateOptions = [
  { value: "compared" as const, label: "🔍 เทียบแล้วละเอียด", description: "เปรียบเทียบสเปกและราคาอย่างน้อย 2-3 แบรนด์/ร้าน" },
  { value: "not-compared" as const, label: "⚠️ ยังไม่ได้เทียบ", description: "เจอแล้วอยากได้เลย ยังไม่ได้เปรียบเทียบกับตัวเลือกอื่น" },
  { value: "cheaper-good" as const, label: "💡 มีตัวอื่นที่ถูกและดีพอ", description: "มีตัวเลือกที่ประหยัดกว่าแต่ตอบโจทย์หลักได้พอๆ กัน" },
];

const coolingDaysOptions = [
  { value: 7, label: "7 วัน", description: "ของทั่วไป ราคาไม่สูง" },
  { value: 14, label: "14 วัน", description: "ของราคาปานกลาง หรือเริ่มลังเล" },
  { value: 30, label: "30 วัน", description: "ของราคาสูง หรือเสี่ยงเสียดายสูง" },
];

export function WorthItApp() {
  const isHydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<WishItem[]>(() => {
    if (typeof window === "undefined") return demoItems;
    try {
      const storedItems = localStorage.getItem(STORAGE_KEY);
      const storedProfile = localStorage.getItem(PROFILE_KEY);
      const profile = storedProfile ? normalizeFinancialProfile(JSON.parse(storedProfile)) : defaultProfile;
      return storedItems ? normalizeItems(JSON.parse(storedItems), profile) : demoItems;
    } catch {
      return demoItems;
    }
  });
  const [financialProfile, setFinancialProfile] = useState<FinancialProfile>(() => {
    if (typeof window === "undefined") return defaultProfile;
    try {
      const storedProfile = localStorage.getItem(PROFILE_KEY);
      return storedProfile ? normalizeFinancialProfile(JSON.parse(storedProfile)) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });
  const [sortMode, setSortMode] = useState<SortMode>("worth");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyItem());
  const [draftCreatedAt, setDraftCreatedAt] = useState(0);
  const [restoreStatus, setRestoreStatus] = useState<RestoreStatus>(null);
  const displayItems = useMemo(() => (isHydrated ? items : []), [isHydrated, items]);
  const displayFinancialProfile = useMemo(() => (isHydrated ? financialProfile : defaultProfile), [financialProfile, isHydrated]);

  const evidenceLevelOptions = useMemo(() =>
    evidenceLevels.map((level) => {
      const fullLabel = evidenceLevelLabels[level];
      const parts = fullLabel.split(" (");
      return {
        value: level,
        label: parts[0],
        description: parts[1] ? parts[1].replace(")", "") : undefined,
      };
    }),
    []
  );

  const upgradeReasonOptions = useMemo(() =>
    Object.entries(upgradeReasonLabels).map(([value, label]) => {
      const parts = label.split(" (");
      return {
        value: value as UpgradeReason,
        label: parts[0],
        description: parts[1] ? parts[1].replace(")", "") : undefined,
      };
    }),
    []
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(financialProfile));
  }, [financialProfile]);

  const sortedItems = useMemo(() => sortItems(displayItems, displayFinancialProfile, sortMode), [displayFinancialProfile, displayItems, sortMode]);
  const draftScore = useMemo(() => scoreItem({ ...draft, id: editingId ?? "draft", createdAt: draftCreatedAt }, displayFinancialProfile), [displayFinancialProfile, draft, draftCreatedAt, editingId]);
  const summary = useMemo(() => {
    const totalCost = displayItems.reduce((sum, item) => sum + item.price, 0);
    const totalRecurring = displayItems.reduce((sum, item) => sum + item.recurringCost, 0);
    const readyCount = sortedItems.filter((item) => item.score.readiness.readyToBuy).length;
    return { totalItems: displayItems.length, totalCost, totalRecurring, readyCount };
  }, [displayItems, sortedItems]);

  function updateDraft<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function resetDialog() {
    setEditingId(null);
    setDraft(emptyItem());
    setDraftCreatedAt(0);
    setDialogOpen(false);
  }

  function openCreateDialog() {
    setEditingId(null);
    setDraft(emptyItem());
    setDraftCreatedAt(Date.now());
    setDialogOpen(true);
  }

  function openEditDialog(item: WishItem) {
    setEditingId(item.id);
    setDraft({ ...item, updatedAt: item.updatedAt });
    setDraftCreatedAt(item.createdAt);
    setDialogOpen(true);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = draft.name.trim();
    if (!trimmedName) return;

    const nextItem: WishItem = {
      ...draft,
      id: editingId ?? crypto.randomUUID(),
      name: trimmedName,
      reason: draft.reason.trim(),
      currentProblem: draft.currentProblem.trim(),
      createdAt: items.find((item) => item.id === editingId)?.createdAt ?? Date.now(),
      updatedAt: editingId ? Date.now() : undefined,
    };

    setItems((current) => (editingId ? current.map((item) => (item.id === editingId ? nextItem : item)) : [nextItem, ...current]));
    resetDialog();
  }

  function removeItem(itemId: string) {
    setItems((current) => current.filter((item) => item.id !== itemId));
    if (editingId === itemId) resetDialog();
  }

  function handleBackup() {
    const backup = createBackupPayload(items, financialProfile);
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = createBackupFileName();
    link.click();

    URL.revokeObjectURL(url);
    setRestoreStatus({ tone: "success", message: `ดาวน์โหลด backup แล้ว (${items.length} รายการ)` });
  }

  async function handleRestore(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const confirmed = window.confirm("การ restore จะเขียนทับรายการและ Financial Profile ปัจจุบัน ต้องการทำต่อไหม?");
    if (!confirmed) return;

    try {
      const text = await file.text();
      const backup = parseBackupPayload(text);

      setItems(backup.items);
      setFinancialProfile(backup.financialProfile);
      setEditingId(null);
      setDraft(emptyItem());
      setDraftCreatedAt(0);
      setDialogOpen(false);
      setRestoreStatus({
        tone: "success",
        message: `restore สำเร็จ: ${backup.items.length} รายการ จากไฟล์ ${file.name}`,
      });
    } catch (error) {
      setRestoreStatus({
        tone: "error",
        message: error instanceof Error ? error.message : "restore ไม่สำเร็จ",
      });
    }
  }

  const funBudgetLeft = getFunBudgetLeft(displayFinancialProfile);

  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 py-6">
      <header className="mb-[18px] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-[0.78rem] font-bold uppercase tracking-[0.08em] text-accent">Personal purchase decision system</p>
          <h1 className="text-[clamp(2rem,5vw,4.25rem)] leading-[0.95] font-bold text-foreground">Worth It?</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleRestore} />
          <Button type="button" variant="secondary" onClick={handleBackup} disabled={!isHydrated}>
            <Download className="size-4" />
            Backup
          </Button>
          <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={!isHydrated}>
            <Upload className="size-4" />
            Restore
          </Button>
        </div>
      </header>

      {restoreStatus ? (
        <div
          className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
            restoreStatus.tone === "success"
              ? "border-[rgba(134,239,172,0.2)] bg-[rgba(134,239,172,0.08)] text-(--good)"
              : "border-[rgba(251,113,133,0.2)] bg-[rgba(251,113,133,0.08)] text-(--danger)"
          }`}
        >
          {restoreStatus.message}
        </div>
      ) : null}

      {isHydrated ? (
        <section className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4" aria-label="สรุปภาพรวม">
          <MetricCard label="รายการทั้งหมด" value={String(summary.totalItems)} />
          <MetricCard label="งบรวม" value={formatCurrency(summary.totalCost)} />
          <MetricCard label="รายเดือนเพิ่ม" value={formatCurrency(summary.totalRecurring)} />
          <MetricCard label="ซื้อได้แล้วจริง" value={String(summary.readyCount)} />
        </section>
      ) : null}

      {!isHydrated ? (
        <Card className="mb-4 border-dashed">
          <CardContent className="flex min-h-40 items-center justify-center px-6 py-10 text-center">
            <div>
              <p className="text-sm font-semibold text-(--foreground)">กำลังโหลดข้อมูลของคุณ</p>
              <p className="mt-2 text-sm leading-6 text-(--muted-foreground)">รอสักครู่เพื่อดึงรายการและ Financial Profile จากเครื่องนี้</p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className={`mb-4 ${!isHydrated ? "hidden" : ""}`} aria-hidden={!isHydrated}>
        <CardHeader>
          <CardTitle>Financial Profile</CardTitle>
          <CardDescription>ตัวเลขกลางที่ใช้ประเมินทุก wishlist item: เงินสำรองคือเส้นห้ามแตะ ส่วนงบความสุขคือเงินที่ใช้ตัดสินใจซื้อ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="grid gap-[10px] md:grid-cols-3" onSubmit={(event) => event.preventDefault()}>
            <Field label="เงินสำรองฉุกเฉินตอนนี้" help="เงินสำรองปัจจุบัน ถ้ายังต่ำกว่าเป้า ของแพงจะถูกบล็อกให้เก็บเงินแยกก่อน">
              <Input type="number" min={0} value={displayFinancialProfile.emergencyReserve === 0 ? "" : displayFinancialProfile.emergencyReserve} onChange={(event) => setFinancialProfile((current) => ({ ...current, emergencyReserve: event.target.value === "" ? 0 : Number(event.target.value) }))} />
            </Field>
            <Field label="เป้าเงินสำรองฉุกเฉิน" help="ของเกิน 10,000 บาทจะต้องเช็กว่าถึงเป้านี้แล้วหรือยัง ถ้ายังและยังเก็บเงินไม่ครบจะยังไม่ควรซื้อ">
              <Input type="number" min={0} value={displayFinancialProfile.targetEmergencyReserve === 0 ? "" : displayFinancialProfile.targetEmergencyReserve} onChange={(event) => setFinancialProfile((current) => ({ ...current, targetEmergencyReserve: event.target.value === "" ? 0 : Number(event.target.value) }))} />
            </Field>
            <Field label="งบความสุขรายเดือน" help="งบสำหรับของอยากได้ ความบันเทิง หรือของที่ทำให้ชีวิตดีขึ้นในเดือนนี้">
              <Input type="number" min={0} value={displayFinancialProfile.monthlyFunBudget === 0 ? "" : displayFinancialProfile.monthlyFunBudget} onChange={(event) => setFinancialProfile((current) => ({ ...current, monthlyFunBudget: event.target.value === "" ? 0 : Number(event.target.value) }))} />
            </Field>
            <Field label="ใช้งบความสุขไปแล้ว" help="ระบบเอาค่านี้ไปหัก เพื่อคำนวณงบความสุขที่เหลือของเดือนนี้">
              <Input type="number" min={0} value={displayFinancialProfile.funSpentThisMonth === 0 ? "" : displayFinancialProfile.funSpentThisMonth} onChange={(event) => setFinancialProfile((current) => ({ ...current, funSpentThisMonth: event.target.value === "" ? 0 : Number(event.target.value) }))} />
            </Field>
          </form>

          <div className="flex flex-wrap gap-2">
            <StatusPill text={`งบความสุขเหลือ ${formatCurrency(funBudgetLeft)}`} />
            <StatusPill text={`เงินสำรองตอนนี้ ${formatCurrency(displayFinancialProfile.emergencyReserve)}`} />
            <StatusPill text={`เป้าสำรองฉุกเฉิน ${formatCurrency(displayFinancialProfile.targetEmergencyReserve)}`} />
          </div>

          <details className="rounded-lg border border-(--border) bg-(--card-muted)">
            <summary className="cursor-pointer px-3 py-2 text-[0.9rem] font-extrabold text-[#5eead4]">กฎที่ใช้ตัดสิน</summary>
            <div className="grid gap-[10px] px-3 pb-3 md:grid-cols-2 xl:grid-cols-4">
              {rules.map(([title, detail]) => (
                <section key={title} className="rounded-lg border border-(--border) bg-[#121717] p-[10px]">
                  <h3 className="mb-[5px] text-[0.86rem] font-semibold text-(--foreground)">{title}</h3>
                  <p className="text-[0.78rem] leading-[1.45] text-(--muted-foreground)">{detail}</p>
                </section>
              ))}
            </div>
          </details>
        </CardContent>
      </Card>

      <section className={!isHydrated ? "hidden" : ""} aria-hidden={!isHydrated}>
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-[1.05rem] font-semibold tracking-tight text-(--foreground)">รายการที่ควรตัดสินใจ</h2>
            <p className="text-sm leading-6 text-(--muted-foreground)">ระบบเรียงจากความเหมาะสมสูงสุด พร้อมสถานะและเหตุผลแบบสั้น</p>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div className="grid w-44 gap-2">
              <Label htmlFor="sortMode">เรียงตาม</Label>
              <Select id="sortMode" value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}>
                <option value="system">แนะนำโดยระบบ</option>
                <option value="worth">คะแนนคุ้มค่าสูงสุด</option>
                <option value="regret-low">ความเสี่ยงเสียใจต่ำสุด</option>
                <option value="price-asc">ราคาต่ำสุด</option>
                <option value="price-desc">ราคาสูงสุด</option>
                <option value="newest">เพิ่มล่าสุด</option>
                <option value="closest">ใกล้ซื้อได้ที่สุด</option>
              </Select>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button" onClick={openCreateDialog} className="self-end">
                  <Plus className="size-4" />
                  เพิ่มของที่อยากซื้อ
                </Button>
              </DialogTrigger>
              <DialogContent onCloseAutoFocus={(event) => event.preventDefault()}>
                <DialogHeader>
                  <DialogTitle>{editingId ? "แก้ไขรายการ" : "เพิ่มของที่อยากซื้อ"}</DialogTitle>
                  <DialogDescription>กรอกเร็วพอให้ไม่ขี้เกียจ แต่ลึกพอให้ตัดสินใจไม่หลอกตัวเอง</DialogDescription>
                </DialogHeader>

                <form className="grid gap-5" onSubmit={handleSubmit}>
                  <div className="-mx-1 max-h-[68vh] overflow-y-auto px-1">
                    <div className="grid gap-5 pr-2">
                      <Field label="ชื่อรายการ">
                        <Input required value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} placeholder="เช่น หูฟังตัดเสียงรบกวน" />
                      </Field>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="ราคา">
                          <Input type="number" min={0} required value={draft.price === 0 ? "" : draft.price} onChange={(event) => updateDraft("price", event.target.value === "" ? 0 : Number(event.target.value))} />
                        </Field>
                        <Field label="หมวดหมู่">
                          <Select value={draft.category} onChange={(event) => updateDraft("category", event.target.value as WishItem["category"])}>
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </Select>
                        </Field>
                        <Field label="ประเภทสินค้า" help="ช่วยให้ระบบแยกของใช้ทั่วไป สมาชิก ประสบการณ์ สุขภาพ และการเรียนรู้ได้แม่นขึ้น">
                          <Select value={draft.productType} onChange={(event) => updateDraft("productType", event.target.value as WishItem["productType"])}>
                            {productTypes.map((type) => (
                              <option key={type} value={type}>
                                {productTypeLabels[type]}
                              </option>
                            ))}
                          </Select>
                        </Field>
                        <div className="sm:col-span-2">
                          <Field label="หลักฐานของเหตุผล" help="ถ้ายังเป็นแค่ความรู้สึก ระบบจะชวนหาหลักฐานเพิ่มก่อนซื้อของราคาสูง">
                            <OptionGrid
                              value={draft.evidenceLevel}
                              onChange={(value) => updateDraft("evidenceLevel", value)}
                              options={evidenceLevelOptions}
                              cols={2}
                            />
                          </Field>
                        </div>
                        <div className="grid gap-3 rounded-lg border border-(--border) bg-(--card-muted) p-4 sm:col-span-2">
                          <div>
                            <span className="block text-[0.78rem] text-(--muted-foreground)">สถานะที่ระบบแนะนำ</span>
                            <strong className="mt-1 block text-sm font-semibold text-(--foreground)">{purchaseStageLabels[draftScore.stage.recommended]}</strong>
                            <p className="mt-1 text-xs leading-5 text-(--muted-foreground)">{draftScore.stage.reason}</p>
                          </div>
                          <Field label="ปรับเอง" help="ปล่อยไว้ที่ค่าระบบ ถ้าไม่ได้อยาก override สถานะนี้ด้วยตัวเอง">
                            <div className="flex flex-col gap-2 sm:flex-row">
                              <Select
                                value={draft.purchaseStageOverride ?? "__system"}
                                onChange={(event) => updateDraft("purchaseStageOverride", event.target.value === "__system" ? null : (event.target.value as PurchaseStage))}
                              >
                                <option value="__system">ใช้ค่าที่ระบบแนะนำ</option>
                                {Object.entries(purchaseStageLabels).map(([value, label]) => (
                                  <option key={value} value={value}>
                                    {label}
                                  </option>
                                ))}
                              </Select>
                              <Button type="button" variant="secondary" onClick={() => updateDraft("purchaseStageOverride", null)}>
                                ใช้ค่าที่ระบบแนะนำ
                              </Button>
                            </div>
                          </Field>
                        </div>
                        <Field label="คาดว่าจะใช้กี่ปี" help="ใช้คำนวณ cost per use แบบง่ายๆ ถ้าไม่แน่ใจให้เริ่มที่ 1 ปี">
                          <Input type="number" min={1} value={draft.expectedUseYears || 1} onChange={(event) => updateDraft("expectedUseYears", Math.max(Number(event.target.value) || 1, 1))} />
                        </Field>
                      </div>

                      <Field label="เหตุผลที่อยากได้">
                        <Textarea value={draft.reason} onChange={(event) => updateDraft("reason", event.target.value)} placeholder="มันช่วยอะไรในชีวิตจริง หรือแค่อยากได้เพราะเห็นโปร?" />
                      </Field>

                      <SectionTitle title="กฎการเงิน" />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <Field label="วิธีจ่าย" help="ถ้าเลือกเป็นหนี้หรือแตะเงินหลัก รายการจะเป็น Too Risky ทันที">
                            <OptionGrid
                              value={draft.paymentPlan}
                              onChange={(value) => updateDraft("paymentPlan", value)}
                              options={paymentPlanOptions}
                            />
                          </Field>
                        </div>
                        <div className="sm:col-span-2">
                          <Field label="เพิ่มคุณภาพชีวิต" help="ให้คะแนนผลระยะยาว ไม่ใช่อารมณ์อยากได้ตอนเห็นของ">
                            <div className="rounded-lg border border-(--border) bg-(--card-muted) px-4 py-4">
                              <input className="w-full accent-(--accent)" type="range" min={1} max={5} value={draft.joy} onChange={(event) => updateDraft("joy", Number(event.target.value))} />
                              <div className="mt-2 flex items-center justify-between text-xs font-medium text-(--muted-foreground)">
                                <span>นิดเดียว</span>
                                <span className="rounded-full bg-[rgba(45,212,191,0.14)] px-3 py-1 text-(--accent)">{draft.joy}</span>
                                <span>ชัดเจน</span>
                              </div>
                            </div>
                          </Field>
                        </div>
                        <Field label="เก็บไว้เพื่อชิ้นนี้แล้ว" help="ถ้าเก็บครบแล้วจะผ่านกฎการเงิน">
                          <Input type="number" min={0} value={draft.savedForItem === 0 ? "" : draft.savedForItem} onChange={(event) => updateDraft("savedForItem", event.target.value === "" ? 0 : Number(event.target.value))} />
                        </Field>
                        <Field label="จะกันเพิ่มต่อเดือน" help="ระบบใช้ค่านี้คำนวณว่าเหลืออีกกี่เดือนก่อนซื้อได้">
                          <Input type="number" min={0} value={draft.monthlySetAside === 0 ? "" : draft.monthlySetAside} onChange={(event) => updateDraft("monthlySetAside", event.target.value === "" ? 0 : Number(event.target.value))} />
                        </Field>
                        <div className="sm:col-span-2">
                          <Field label="ค่าใช้จ่ายต่อเดือน" help="ใส่เมื่อเป็น subscription, ค่าบำรุงรักษา, accessory หรือค่าใช้จ่ายที่ตามมาทุกเดือน">
                            <Input type="number" min={0} value={draft.recurringCost === 0 ? "" : draft.recurringCost} onChange={(event) => updateDraft("recurringCost", event.target.value === "" ? 0 : Number(event.target.value))} />
                          </Field>
                        </div>
                      </div>

                      <SectionTitle title="Decision gates" />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <Field label="ความจำเป็น">
                            <OptionGrid
                              value={draft.needGate}
                              onChange={(value) => updateDraft("needGate", value)}
                              options={needGateOptions}
                            />
                          </Field>
                        </div>
                        <div className="sm:col-span-2">
                          <Field label="ความถี่ในการใช้">
                            <OptionGrid
                              value={draft.usageGate}
                              onChange={(value) => updateDraft("usageGate", value)}
                              options={usageGateOptions}
                            />
                          </Field>
                        </div>
                        <div className="sm:col-span-2">
                          <Field label="ของนี้ซ้ำกับของที่มีไหม">
                            <OptionGrid
                              value={draft.replacementGate}
                              onChange={(value) => updateDraft("replacementGate", value)}
                              options={replacementGateOptions}
                            />
                          </Field>
                        </div>
                        <div className="sm:col-span-2">
                          <Field label="จังหวะเวลาตอนนี้">
                            <OptionGrid
                              value={draft.timingGate}
                              onChange={(value) => updateDraft("timingGate", value)}
                              options={timingGateOptions}
                            />
                          </Field>
                        </div>
                        <div className="sm:col-span-2">
                          <Field label="เทียบตัวเลือกแล้วหรือยัง">
                            <OptionGrid
                              value={draft.alternativeGate}
                              onChange={(value) => updateDraft("alternativeGate", value)}
                              options={alternativeGateOptions}
                            />
                          </Field>
                        </div>
                      </div>

                      <SectionTitle title="สัญญาณเสี่ยงซื้อแล้วเสียดาย" />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <ToggleRow checked={draft.similarOwned} onChange={(checked) => updateDraft("similarOwned", checked)} label="มีของคล้ายกันอยู่แล้ว" />
                        <ToggleRow checked={draft.trendDriven} onChange={(checked) => updateDraft("trendDriven", checked)} label="อยากได้เพราะโปร กระแส หรือคนอื่นใช้" />
                        <ToggleRow checked={draft.pastUnused} onChange={(checked) => updateDraft("pastUnused", checked)} label="เคยซื้อของประเภทนี้แล้วไม่ค่อยได้ใช้" />
                        <ToggleRow checked={draft.promoOnly} onChange={(checked) => updateDraft("promoOnly", checked)} label="ถ้าไม่มีโปร/ส่วนลด จะไม่อยากซื้อเท่านี้" />
                        <ToggleRow checked={draft.canWait} onChange={(checked) => updateDraft("canWait", checked)} label="รอ 30 วันได้โดยชีวิตไม่พัง" />
                        <ToggleRow checked={draft.stillWantIt} onChange={(checked) => updateDraft("stillWantIt", checked)} label="รอแล้ว ยังอยากได้อยู่" />
                        <div className="sm:col-span-2">
                          <Field label="ระยะเวลารอ" help="ของแพงหรือเสี่ยงเสียดายควรใช้ 30 วันเป็นค่าเริ่มต้น">
                            <OptionGrid
                              value={draft.coolingDays}
                              onChange={(value) => updateDraft("coolingDays", value)}
                              options={coolingDaysOptions}
                            />
                          </Field>
                        </div>
                      </div>

                      {draft.replacementGate === "upgrade" || draft.similarOwned ? (
                        <>
                          <SectionTitle title="Upgrade Check" />
                          <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="ของเดิมมีปัญหาอะไร" help="สั้นๆ แต่ชัดพอว่า setup เดิมมี friction อะไรที่ของใหม่จะช่วยแก้">
                              <Textarea value={draft.currentProblem} onChange={(event) => updateDraft("currentProblem", event.target.value)} placeholder="เช่น ปวดหูหลังใส่เกิน 1 ชั่วโมง หรือประชุมแล้วเสียงรอบข้างรบกวนมาก" />
                            </Field>
                            <div className="sm:col-span-2">
                              <Field label="เหตุผลที่อยากอัปเกรด">
                                <OptionGrid
                                  value={draft.upgradeReason}
                                  onChange={(value) => updateDraft("upgradeReason", value)}
                                  options={upgradeReasonOptions}
                                  cols={2}
                                />
                              </Field>
                            </div>
                            <Field label="ปัญหาของเดิมหนักแค่ไหน" help="0 คือแทบไม่มีปัญหา 5 คือกระทบชีวิตประจำวันชัดเจน">
                              <RangeField value={draft.currentPainLevel} onChange={(value) => updateDraft("currentPainLevel", value as Draft["currentPainLevel"])} />
                            </Field>
                            <Field label="ของใหม่จะช่วยได้มากแค่ไหน" help="0 คือแทบไม่ต่าง 5 คือดีขึ้นชัดเจนมาก">
                              <RangeField value={draft.improvementImpact} onChange={(value) => updateDraft("improvementImpact", value as Draft["improvementImpact"])} />
                            </Field>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="secondary" onClick={resetDialog}>
                      ยกเลิก
                    </Button>
                    <Button type="submit">{editingId ? "บันทึกการแก้ไข" : "เพิ่มเข้ารายการ"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {sortedItems.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border px-6 py-12 text-center">
            <h3 className="text-xl font-semibold text-foreground">ยังไม่มีรายการ</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">เริ่มจากของที่ลังเลอยู่ตอนนี้สักหนึ่งชิ้น แล้วให้คะแนนแบบซื่อๆ</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {sortedItems.map((item) => (
              <WishCard key={item.id} item={item} onEdit={() => openEditDialog(item)} onDelete={() => removeItem(item.id)} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="min-h-[92px] bg-linear-to-b from-card-raised to-card">
      <CardContent className="px-4 py-4">
        <span className="block text-[0.85rem] text-muted-foreground">{label}</span>
        <strong className="mt-[10px] block text-[1.6rem] font-semibold text-foreground">{value}</strong>
      </CardContent>
    </Card>
  );
}

function WishCard({ item, onEdit, onDelete }: { item: ReturnType<typeof sortItems>[number]; onEdit: () => void; onDelete: () => void }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <article className="rounded-lg border border-border bg-linear-to-b from-card-raised/64 to-card/96 p-4 shadow-custom sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-semibold text-foreground">{item.name}</h3>
            <span className="rounded-full border border-border bg-[#121717] px-3 py-1 text-xs font-semibold text-muted-foreground">{item.category}</span>
            <span className="rounded-full border border-border bg-[#121717] px-3 py-1 text-xs font-semibold text-muted-foreground">{productTypeLabels[item.productType]}</span>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{getReasonCopy(item)}</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="icon" onClick={onEdit} title="แก้ไขรายการ">
            <Pencil className="size-4" />
            <span className="sr-only">แก้ไขรายการ</span>
          </Button>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="ghost" size="icon" title="ลบรายการ" className="hover:border-danger hover:text-danger">
                <Trash2 className="size-4" />
                <span className="sr-only">ลบรายการ</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[min(520px,calc(100vw-1.5rem))]">
              <DialogHeader>
                <DialogTitle>ยืนยันการลบรายการ</DialogTitle>
                <DialogDescription>ถ้าลบแล้ว รายการ {item.name} จะหายจากหน้าและต้องเพิ่มใหม่เองหากอยากได้กลับมา</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setDeleteDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    onDelete();
                    setDeleteDialogOpen(false);
                  }}
                  className="border-danger/20 bg-danger/12 text-danger hover:bg-danger/18"
                >
                  ลบรายการนี้
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-2">
        <span className={`rounded-lg border px-3 py-2 text-sm font-semibold ${recommendationClass(item.score.recommendation.className)}`}>{item.score.recommendation.label}</span>
        <span className={`rounded-lg px-3 py-2 text-sm leading-6 ${readinessClass(item.score.readiness.className)}`}>
          {item.score.readiness.label}: {item.score.readiness.detail}
        </span>
        <span className="rounded-lg border border-accent/20 bg-accent/8 px-3 py-2 text-sm font-semibold text-[#5eead4]">
          {purchaseStageLabels[item.score.stage.effective]}
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
        <ScoreBox label="Worth Score" value={`${item.score.worthScore}/100`} />
        <ScoreBox label="Regret Risk" value={`${item.score.regretRisk}%`} />
        <ScoreBox label="ราคา" value={formatCurrency(item.price)} />
        <ScoreBox label="รายเดือน" value={item.recurringCost > 0 ? formatCurrency(item.recurringCost) : "-"} />
        <ScoreBox label="Cost / use" value={item.score.costPerUse.label} />
        <ScoreBox label="Plan" value={item.score.financial.planSummary} />
      </div>

      <details className="group mt-4 border-t border-white/6 pt-3">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm font-semibold text-foreground hover:bg-white/4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span>รายละเอียดการตัดสินใจ</span>
          <ChevronDown className="size-4 text-muted-foreground transition group-open:rotate-180" />
        </summary>

        <div className="pt-3">
          <div className="flex flex-wrap items-start gap-2">
            <span className="rounded-lg border border-accent/20 bg-accent/8 px-3 py-2 text-sm font-semibold text-[#5eead4]">
              สถานะที่ระบบแนะนำ: {purchaseStageLabels[item.score.stage.recommended]}
            </span>
            {item.score.stage.overridden ? (
              <span className="rounded-lg border border-warning/20 bg-warning/8 px-3 py-2 text-sm font-semibold text-warning">
                ปรับเอง: {purchaseStageLabels[item.score.stage.effective]}
              </span>
            ) : null}
          </div>

          <div className="mt-3 grid gap-2 lg:grid-cols-3">
            <DetailBox label="เหตุผลสถานะ" value={purchaseStageLabels[item.score.stage.recommended]} note={item.score.stage.reason} />
            <DetailBox
              label="Cost per use"
              value={item.score.costPerUse.label}
              note={`${item.score.costPerUse.usesPerYear} ครั้ง/ปี x ${item.score.costPerUse.expectedUseYears} ปี จากต้นทุนรวม ${formatCurrency(item.score.costPerUse.ownershipCost)}`}
            />
            <DetailBox label="หลักฐาน" value={evidenceLevelLabels[item.evidenceLevel]} note="ใช้ลด/เพิ่มความเสี่ยงซื้อแล้วเสียดาย" />
          </div>

          <BlockGroups blocks={item.score.blocks} />

          {item.replacementGate === "upgrade" || item.similarOwned ? (
            <div className="mt-4 border-t border-white/6 pt-4">
              <div className="grid gap-2 lg:grid-cols-3">
                <DetailBox label="อัปเกรดเพราะ" value={item.score.upgrade.reasonLabel} />
                <DetailBox label="ปัญหาของเดิม" value={`${item.score.upgrade.currentPainLevel}/5`} note={item.score.upgrade.currentProblem || "ยังไม่ได้ระบุปัญหาของของเดิม"} />
                <DetailBox label="ผลลัพธ์ที่คาดว่าจะดีขึ้น" value={`${item.score.upgrade.improvementImpact}/5`} />
              </div>
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            {item.score.reasons.map((reason) => (
              <StatusPill key={reason} text={reason} />
            ))}
          </div>
        </div>
      </details>
    </article>
  );
}

function ScoreBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/8 bg-[#121717]/52 px-3 py-3 backdrop-blur-[2px]">
      <span className="block text-[0.78rem] text-muted-foreground">{label}</span>
      <strong className="mt-2 block text-base font-semibold text-foreground">{value}</strong>
    </div>
  );
}

function DetailBox({ label, value, note, tone = "normal" }: { label: string; value: string; note?: string; tone?: "normal" | "danger" }) {
  return (
    <div
      className={`rounded-lg px-3 py-3 ${
        tone === "danger"
          ? "border border-[rgba(251,113,133,0.16)] bg-[rgba(251,113,133,0.08)]"
          : "border border-[rgba(255,255,255,0.07)] bg-[rgba(18,23,23,0.42)]"
      }`}
    >
      <span className="block text-[0.78rem] text-(--muted-foreground)">{label}</span>
      <strong className={`mt-2 block text-sm font-semibold ${tone === "danger" ? "text-(--danger)" : "text-(--foreground)"}`}>{value}</strong>
      {note ? <p className="mt-2 text-xs leading-5 text-(--muted-foreground)">{note}</p> : null}
    </div>
  );
}

function BlockGroups({ blocks }: { blocks: ReturnType<typeof scoreItem>["blocks"] }) {
  const groups = [
    ["การเงิน", blocks.financial],
    ["การตัดสินใจ", blocks.decision],
    ["การอัปเกรด", blocks.upgrade],
    ["Cooling period", blocks.cooling],
  ] as const;
  const visibleGroups = groups.filter(([, reasons]) => reasons.length > 0);

  if (visibleGroups.length === 0) return null;

  return (
    <section className="mt-4 border-t border-[rgba(251,191,36,0.12)] pt-4">
      <h4 className="text-sm font-semibold text-(--warning)">เหตุผลที่ยังไม่ควรซื้อ</h4>
      <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        {visibleGroups.map(([label, reasons]) => (
          <div key={label} className="rounded-lg border border-[rgba(251,191,36,0.16)] bg-[rgba(251,191,36,0.05)] px-3 py-3">
            <strong className="block text-xs font-semibold text-(--foreground)">{label}</strong>
            <ul className="mt-2 grid gap-1 text-xs leading-5 text-(--muted-foreground)">
              {reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function getReasonCopy(item: ReturnType<typeof sortItems>[number]) {
  if (item.reason.trim()) return item.reason;
  if (item.currentProblem.trim()) return "มีปัญหาของเดิมแล้ว แต่ถ้าอยากชัดขึ้นให้เพิ่มเหตุผลสั้น ๆ ได้";
  if (item.upgradeReason !== "wantBetter" || item.currentPainLevel > 0 || item.improvementImpact > 0) {
    return "มีข้อมูลปัญหา/ผลลัพธ์บางส่วนแล้ว ถ้าอยากชัดขึ้นให้เพิ่มเหตุผลสั้น ๆ ได้";
  }
  return "ยังไม่ได้ใส่เหตุผล ลองเพิ่มเหตุผลเพื่อกันการซื้อจากอารมณ์ล้วนๆ";
}

function RangeField({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="rounded-lg border border-(--border) bg-(--card-muted) px-4 py-4">
      <input className="w-full accent-(--accent)" type="range" min={0} max={5} value={value} onChange={(event) => onChange(Number(event.target.value))} />
      <div className="mt-2 flex items-center justify-between text-xs font-medium text-(--muted-foreground)">
        <span>0</span>
        <span className="rounded-full bg-[rgba(45,212,191,0.14)] px-3 py-1 text-(--accent)">{value}</span>
        <span>5</span>
      </div>
    </div>
  );
}

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
      {help ? <p className="text-[0.76rem] font-medium leading-[1.4] text-(--muted-foreground)">{help}</p> : null}
    </div>
  );
}

function ToggleRow({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 rounded-lg border border-(--border) bg-(--card-muted) px-4 py-3 text-sm text-(--foreground)">
      <input className="size-4 accent-(--accent)" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function StatusPill({ text }: { text: string }) {
  return <span className="rounded-full border border-border bg-[#121717] px-[9px] py-[5px] text-[0.78rem] font-bold text-muted-foreground">{text}</span>;
}

interface OptionGridProps<T extends string | number> {
  value: T;
  onChange: (value: T) => void;
  options: {
    value: T;
    label: string;
    description?: string;
  }[];
  cols?: 1 | 2 | 3 | 4;
}

function OptionGrid<T extends string | number>({ value, onChange, options, cols = 3 }: OptionGridProps<T>) {
  const gridColsClass = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
  }[cols] || "grid-cols-1 sm:grid-cols-3";

  return (
    <div className={cn("grid gap-2 w-full", gridColsClass)}>
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex flex-col items-start gap-1.5 p-3 text-left border rounded-lg transition-all duration-200 outline-none text-sm cursor-pointer",
              isSelected
                ? "border-accent bg-accent/8 text-foreground ring-1 ring-accent"
                : "border-border bg-card-muted hover:border-accent hover:bg-card-raised text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="font-semibold text-sm leading-tight">{opt.label}</span>
            {opt.description ? (
              <span className="text-xs text-muted-foreground leading-normal mt-1">{opt.description}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h3 className="border-t border-border pt-5 text-base font-semibold text-foreground">{title}</h3>;
}

function recommendationClass(state: string) {
  if (state === "buy") return "border-good/20 bg-good/8 text-good";
  if (state === "save") return "border-warning/20 bg-warning/8 text-warning";
  if (state === "drop") return "border-danger/20 bg-danger/8 text-danger";
  if (state === "compare") return "border-accent/20 bg-accent/8 text-[#5eead4]";
  return "border-muted-foreground/20 bg-muted-foreground/8 text-muted-foreground";
}

function readinessClass(state: string) {
  if (state === "ready") return "border border-good/20 bg-good/8 text-good";
  if (state === "blocked") return "border border-danger/20 bg-danger/8 text-danger";
  return "border border-warning/20 bg-warning/8 text-warning";
}
