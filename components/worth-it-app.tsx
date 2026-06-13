"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Download, Pencil, Plus, RotateCcw, Trash2, Upload } from "lucide-react";

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
  formatCurrency,
  getCostPerUse,
  getFunBudgetLeft,
  parseBackupPayload,
  sortItems,
  type FinancialProfile,
  type SortMode,
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

export function WorthItApp() {
  const isHydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<WishItem[]>(() => {
    if (typeof window === "undefined") return demoItems;
    try {
      const storedItems = localStorage.getItem(STORAGE_KEY);
      return storedItems ? (JSON.parse(storedItems) as WishItem[]) : demoItems;
    } catch {
      return demoItems;
    }
  });
  const [financialProfile, setFinancialProfile] = useState<FinancialProfile>(() => {
    if (typeof window === "undefined") return defaultProfile;
    try {
      const storedProfile = localStorage.getItem(PROFILE_KEY);
      return storedProfile ? { ...defaultProfile, ...(JSON.parse(storedProfile) as FinancialProfile) } : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });
  const [sortMode, setSortMode] = useState<SortMode>("priority");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyItem());
  const [restoreStatus, setRestoreStatus] = useState<RestoreStatus>(null);
  const displayItems = useMemo(() => (isHydrated ? items : []), [isHydrated, items]);
  const displayFinancialProfile = useMemo(() => (isHydrated ? financialProfile : defaultProfile), [financialProfile, isHydrated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(financialProfile));
  }, [financialProfile]);

  const sortedItems = useMemo(() => sortItems(displayItems, displayFinancialProfile, sortMode), [displayFinancialProfile, displayItems, sortMode]);
  const summary = useMemo(() => {
    const totalCost = displayItems.reduce((sum, item) => sum + item.price, 0);
    const readyCount = sortedItems.filter((item) => item.score.readiness.readyToBuy).length;
    const averageRegret = displayItems.length ? Math.round(sortedItems.reduce((sum, item) => sum + item.score.regretRisk, 0) / displayItems.length) : 0;
    return { totalItems: displayItems.length, totalCost, readyCount, averageRegret };
  }, [displayItems, sortedItems]);

  function updateDraft<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function resetDialog() {
    setEditingId(null);
    setDraft(emptyItem());
    setDialogOpen(false);
  }

  function openCreateDialog() {
    setEditingId(null);
    setDraft(emptyItem());
    setDialogOpen(true);
  }

  function openEditDialog(item: WishItem) {
    setEditingId(item.id);
    setDraft({ ...item, updatedAt: item.updatedAt });
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

  function resetDemo() {
    setItems(demoItems);
    setEditingId(null);
    setDraft(emptyItem());
    setRestoreStatus(null);
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
          <p className="mb-1 text-[0.78rem] font-bold uppercase tracking-[0.08em] text-[var(--accent)]">Personal purchase decision system</p>
          <h1 className="text-[clamp(2rem,5vw,4.25rem)] leading-[0.95] font-bold text-[var(--foreground)]">Worth It?</h1>
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
          <Button type="button" variant="secondary" size="icon" onClick={resetDemo} title="โหลดตัวอย่าง">
            <RotateCcw className="size-4" />
            <span className="sr-only">โหลดตัวอย่าง</span>
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={() => setItems([])} title="ล้างข้อมูลทั้งหมด" className="hover:border-[var(--danger)] hover:text-[var(--danger)]">
            <Trash2 className="size-4" />
            <span className="sr-only">ล้างข้อมูลทั้งหมด</span>
          </Button>
        </div>
      </header>

      {restoreStatus ? (
        <div
          className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
            restoreStatus.tone === "success"
              ? "border-[rgba(134,239,172,0.2)] bg-[rgba(134,239,172,0.08)] text-[var(--good)]"
              : "border-[rgba(251,113,133,0.2)] bg-[rgba(251,113,133,0.08)] text-[var(--danger)]"
          }`}
        >
          {restoreStatus.message}
        </div>
      ) : null}

      {isHydrated ? (
        <section className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4" aria-label="สรุปภาพรวม">
          <MetricCard label="รายการทั้งหมด" value={String(summary.totalItems)} />
          <MetricCard label="งบรวม" value={formatCurrency(summary.totalCost)} />
          <MetricCard label="ซื้อได้แล้วจริง" value={String(summary.readyCount)} />
          <MetricCard label="ความเสี่ยงเสียดายเฉลี่ย" value={`${summary.averageRegret}%`} />
        </section>
      ) : null}

      {!isHydrated ? (
        <Card className="mb-4 border-dashed">
          <CardContent className="flex min-h-40 items-center justify-center px-6 py-10 text-center">
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">กำลังโหลดข้อมูลของคุณ</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">รอสักครู่เพื่อดึงรายการและ Financial Profile จากเครื่องนี้</p>
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
            <Field label="เงินสำรองขั้นต่ำ" help="เส้นห้ามแตะสำหรับเหตุฉุกเฉิน ถ้าต้องใช้เงินก้อนนี้จะถือว่า Too Risky">
              <Input type="number" min={0} value={displayFinancialProfile.emergencyReserve} onChange={(event) => setFinancialProfile((current) => ({ ...current, emergencyReserve: Number(event.target.value) || 0 }))} />
            </Field>
            <Field label="งบความสุขรายเดือน" help="งบสำหรับของอยากได้ ความบันเทิง หรือของที่ทำให้ชีวิตดีขึ้นในเดือนนี้">
              <Input type="number" min={0} value={displayFinancialProfile.monthlyFunBudget} onChange={(event) => setFinancialProfile((current) => ({ ...current, monthlyFunBudget: Number(event.target.value) || 0 }))} />
            </Field>
            <Field label="ใช้งบความสุขไปแล้ว" help="ระบบเอาค่านี้ไปหัก เพื่อคำนวณงบความสุขที่เหลือของเดือนนี้">
              <Input type="number" min={0} value={displayFinancialProfile.funSpentThisMonth} onChange={(event) => setFinancialProfile((current) => ({ ...current, funSpentThisMonth: Number(event.target.value) || 0 }))} />
            </Field>
          </form>

          <div className="flex flex-wrap gap-2">
            <StatusPill text={`งบความสุขเหลือ ${formatCurrency(funBudgetLeft)}`} />
            <StatusPill text={`เงินสำรองขั้นต่ำ ${formatCurrency(displayFinancialProfile.emergencyReserve)} ห้ามแตะ`} />
          </div>

          <details className="rounded-lg border border-[var(--border)] bg-[var(--card-muted)]">
            <summary className="cursor-pointer px-3 py-2 text-[0.9rem] font-extrabold text-[#5eead4]">กฎที่ใช้ตัดสิน</summary>
            <div className="grid gap-[10px] px-3 pb-3 md:grid-cols-2 xl:grid-cols-4">
              {rules.map(([title, detail]) => (
                <section key={title} className="rounded-lg border border-[var(--border)] bg-[#121717] p-[10px]">
                  <h3 className="mb-[5px] text-[0.86rem] font-semibold text-[var(--foreground)]">{title}</h3>
                  <p className="text-[0.78rem] leading-[1.45] text-[var(--muted-foreground)]">{detail}</p>
                </section>
              ))}
            </div>
          </details>
        </CardContent>
      </Card>

      <Card className={!isHydrated ? "hidden" : ""} aria-hidden={!isHydrated}>
        <CardHeader className="gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle>รายการที่ควรตัดสินใจ</CardTitle>
            <CardDescription>ระบบเรียงจากความเหมาะสมสูงสุด พร้อมสถานะและเหตุผลแบบสั้น</CardDescription>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div className="grid w-44 gap-2">
              <Label htmlFor="sortMode">เรียงตาม</Label>
              <Select id="sortMode" value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}>
                <option value="priority">ความเหมาะสม</option>
                <option value="price-desc">ราคาแพงก่อน</option>
                <option value="price-asc">ราคาถูกก่อน</option>
                <option value="regret">เสี่ยงเสียดายสูงก่อน</option>
              </Select>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button" onClick={openCreateDialog} className="self-end">
                  <Plus className="size-4" />
                  เพิ่มของที่อยากซื้อ
                </Button>
              </DialogTrigger>
              <DialogContent>
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
                          <Input type="number" min={0} required value={draft.price || ""} onChange={(event) => updateDraft("price", Number(event.target.value) || 0)} />
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
                      </div>

                      <Field label="เหตุผลที่อยากได้">
                        <Textarea value={draft.reason} onChange={(event) => updateDraft("reason", event.target.value)} placeholder="มันช่วยอะไรในชีวิตจริง หรือแค่อยากได้เพราะเห็นโปร?" />
                      </Field>

                      <SectionTitle title="กฎการเงิน" />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="วิธีจ่าย" help="ถ้าเลือกเป็นหนี้หรือแตะเงินหลัก รายการจะเป็น Too Risky ทันที">
                          <Select value={draft.paymentPlan} onChange={(event) => updateDraft("paymentPlan", event.target.value as WishItem["paymentPlan"])}>
                            <option value="cash">ใช้เงินจากงบความสุข/เงินที่เก็บไว้</option>
                            <option value="reserved-installment">ผ่อน 0% แต่กันเงินครบแล้ว</option>
                            <option value="debt">ต้องเป็นหนี้/แตะเงินลงทุนหรือเงินสำรอง</option>
                          </Select>
                        </Field>
                        <Field label="เพิ่มคุณภาพชีวิต" help="ให้คะแนนผลระยะยาว ไม่ใช่อารมณ์อยากได้ตอนเห็นของ">
                          <div className="rounded-lg border border-[var(--border)] bg-[var(--card-muted)] px-4 py-4">
                            <input className="w-full accent-[var(--accent)]" type="range" min={1} max={5} value={draft.joy} onChange={(event) => updateDraft("joy", Number(event.target.value))} />
                            <div className="mt-2 flex items-center justify-between text-xs font-medium text-[var(--muted-foreground)]">
                              <span>นิดเดียว</span>
                              <span className="rounded-full bg-[rgba(45,212,191,0.14)] px-3 py-1 text-[var(--accent)]">{draft.joy}</span>
                              <span>ชัดเจน</span>
                            </div>
                          </div>
                        </Field>
                        <Field label="เก็บไว้เพื่อชิ้นนี้แล้ว" help="ถ้าเก็บครบแล้วจะผ่านกฎการเงิน">
                          <Input type="number" min={0} value={draft.savedForItem || ""} onChange={(event) => updateDraft("savedForItem", Number(event.target.value) || 0)} />
                        </Field>
                        <Field label="จะกันเพิ่มต่อเดือน" help="ระบบใช้ค่านี้คำนวณว่าเหลืออีกกี่เดือนก่อนซื้อได้">
                          <Input type="number" min={0} value={draft.monthlySetAside || ""} onChange={(event) => updateDraft("monthlySetAside", Number(event.target.value) || 0)} />
                        </Field>
                      </div>

                      <SectionTitle title="Decision gates" />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="ความจำเป็น">
                          <Select value={draft.needGate} onChange={(event) => updateDraft("needGate", event.target.value as WishItem["needGate"])}>
                            <option value="essential">จำเป็นจริง ไม่ซื้อแล้วมีปัญหา</option>
                            <option value="useful">มีประโยชน์ แต่ยังไม่จำเป็น</option>
                            <option value="nice">อยากได้เฉยๆ</option>
                          </Select>
                        </Field>
                        <Field label="ความถี่ในการใช้">
                          <Select value={draft.usageGate} onChange={(event) => updateDraft("usageGate", event.target.value as WishItem["usageGate"])}>
                            <option value="daily">ทุกวัน/เกือบทุกวัน</option>
                            <option value="weekly">ทุกสัปดาห์</option>
                            <option value="monthly">เดือนละครั้งหรือน้อยกว่า</option>
                          </Select>
                        </Field>
                        <Field label="ของนี้ซ้ำกับของที่มีไหม">
                          <Select value={draft.replacementGate} onChange={(event) => updateDraft("replacementGate", event.target.value as WishItem["replacementGate"])}>
                            <option value="replace">แทนของเดิมที่มีปัญหา</option>
                            <option value="upgrade">อัปเกรดจากของเดิมที่ยังใช้ได้</option>
                            <option value="duplicate">ซ้ำกับของที่มีอยู่แล้ว</option>
                          </Select>
                        </Field>
                        <Field label="จังหวะเวลาตอนนี้">
                          <Select value={draft.timingGate} onChange={(event) => updateDraft("timingGate", event.target.value as WishItem["timingGate"])}>
                            <option value="now">ต้องซื้อช่วงนี้ มีเหตุผลจริง</option>
                            <option value="wait">รอได้</option>
                            <option value="bad">ยังไม่เหมาะตอนนี้</option>
                          </Select>
                        </Field>
                        <Field label="เทียบตัวเลือกแล้วหรือยัง">
                          <Select value={draft.alternativeGate} onChange={(event) => updateDraft("alternativeGate", event.target.value as WishItem["alternativeGate"])}>
                            <option value="compared">เทียบแล้วอย่างน้อย 2 ตัวเลือก</option>
                            <option value="not-compared">ยังไม่ได้เทียบ</option>
                            <option value="cheaper-good">มีตัวถูกกว่าที่ตอบโจทย์พอ</option>
                          </Select>
                        </Field>
                      </div>

                      <SectionTitle title="สัญญาณเสี่ยงซื้อแล้วเสียดาย" />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <ToggleRow checked={draft.similarOwned} onChange={(checked) => updateDraft("similarOwned", checked)} label="มีของคล้ายกันอยู่แล้ว" />
                        <ToggleRow checked={draft.trendDriven} onChange={(checked) => updateDraft("trendDriven", checked)} label="อยากได้เพราะโปร กระแส หรือคนอื่นใช้" />
                        <ToggleRow checked={draft.pastUnused} onChange={(checked) => updateDraft("pastUnused", checked)} label="เคยซื้อของประเภทนี้แล้วไม่ค่อยได้ใช้" />
                        <ToggleRow checked={draft.promoOnly} onChange={(checked) => updateDraft("promoOnly", checked)} label="ถ้าไม่มีโปร/ส่วนลด จะไม่อยากซื้อเท่านี้" />
                        <ToggleRow checked={draft.canWait} onChange={(checked) => updateDraft("canWait", checked)} label="รอ 30 วันได้โดยชีวิตไม่พัง" />
                        <ToggleRow checked={draft.stillWantIt} onChange={(checked) => updateDraft("stillWantIt", checked)} label="รอแล้ว ยังอยากได้อยู่" />
                        <Field label="ระยะเวลารอ" help="ของแพงหรือเสี่ยงเสียดายควรใช้ 30 วันเป็นค่าเริ่มต้น">
                          <Select value={String(draft.coolingDays)} onChange={(event) => updateDraft("coolingDays", Number(event.target.value))}>
                            <option value="7">7 วัน</option>
                            <option value="14">14 วัน</option>
                            <option value="30">30 วัน</option>
                          </Select>
                        </Field>
                      </div>
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
        </CardHeader>

        <CardContent>
          {sortedItems.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[var(--border)] px-6 py-12 text-center">
              <h3 className="text-xl font-semibold text-[var(--foreground)]">ยังไม่มีรายการ</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">เริ่มจากของที่ลังเลอยู่ตอนนี้สักหนึ่งชิ้น แล้วให้คะแนนแบบซื่อๆ</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {sortedItems.map((item) => (
                <WishCard key={item.id} item={item} onEdit={() => openEditDialog(item)} onDelete={() => removeItem(item.id)} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="min-h-[92px] bg-[linear-gradient(180deg,var(--card-raised),var(--card))]">
      <CardContent className="px-4 py-4">
        <span className="block text-[0.85rem] text-[var(--muted-foreground)]">{label}</span>
        <strong className="mt-[10px] block text-[1.6rem] font-semibold text-[var(--foreground)]">{value}</strong>
      </CardContent>
    </Card>
  );
}

function WishCard({ item, onEdit, onDelete }: { item: ReturnType<typeof sortItems>[number]; onEdit: () => void; onDelete: () => void }) {
  return (
    <article className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-semibold text-[var(--foreground)]">{item.name}</h3>
            <span className="rounded-full border border-[var(--border)] bg-[#121717] px-3 py-1 text-xs font-semibold text-[var(--muted-foreground)]">{item.category}</span>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">{item.reason || "ยังไม่ได้ใส่เหตุผล ลองเพิ่มเหตุผลเพื่อกันการซื้อจากอารมณ์ล้วนๆ"}</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="icon" onClick={onEdit} title="แก้ไขรายการ">
            <Pencil className="size-4" />
            <span className="sr-only">แก้ไขรายการ</span>
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={onDelete} title="ลบรายการ" className="hover:border-[var(--danger)] hover:text-[var(--danger)]">
            <Trash2 className="size-4" />
            <span className="sr-only">ลบรายการ</span>
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <ScoreBox label="Worth Score" value={`${item.score.worthScore}/100`} />
        <ScoreBox label="Regret Risk" value={`${item.score.regretRisk}%`} />
        <ScoreBox label="ราคา" value={formatCurrency(item.price)} />
        <ScoreBox label="Cost / use" value={formatCurrency(getCostPerUse(item))} />
        <ScoreBox label="Plan" value={item.score.financial.planSummary} />
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <span className={`rounded-lg border px-4 py-3 text-sm font-semibold ${recommendationClass(item.score.recommendation.className)}`}>{item.score.recommendation.label}</span>
        <span className={`rounded-lg px-4 py-3 text-sm leading-6 ${readinessClass(item.score.readiness.className)}`}>
          {item.score.readiness.label}: {item.score.readiness.detail}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {item.score.reasons.map((reason) => (
          <StatusPill key={reason} text={reason} />
        ))}
      </div>
    </article>
  );
}

function ScoreBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[#121717] p-4">
      <span className="block text-[0.78rem] text-[var(--muted-foreground)]">{label}</span>
      <strong className="mt-2 block text-base font-semibold text-[var(--foreground)]">{value}</strong>
    </div>
  );
}

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
      {help ? <p className="text-[0.76rem] font-medium leading-[1.4] text-[var(--muted-foreground)]">{help}</p> : null}
    </div>
  );
}

function ToggleRow({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card-muted)] px-4 py-3 text-sm text-[var(--foreground)]">
      <input className="size-4 accent-[var(--accent)]" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function StatusPill({ text }: { text: string }) {
  return <span className="rounded-full border border-[var(--border)] bg-[#121717] px-[9px] py-[5px] text-[0.78rem] font-bold text-[var(--muted-foreground)]">{text}</span>;
}

function SectionTitle({ title }: { title: string }) {
  return <h3 className="border-t border-[var(--border)] pt-5 text-base font-semibold text-[var(--foreground)]">{title}</h3>;
}

function recommendationClass(state: string) {
  if (state === "buy") return "border-[rgba(134,239,172,0.2)] bg-[rgba(134,239,172,0.08)] text-[var(--good)]";
  if (state === "save") return "border-[rgba(251,191,36,0.2)] bg-[rgba(251,191,36,0.08)] text-[var(--warning)]";
  if (state === "drop") return "border-[rgba(251,113,133,0.2)] bg-[rgba(251,113,133,0.08)] text-[var(--danger)]";
  if (state === "compare") return "border-[rgba(45,212,191,0.2)] bg-[rgba(45,212,191,0.08)] text-[#5eead4]";
  return "border-[rgba(169,176,170,0.2)] bg-[rgba(169,176,170,0.08)] text-[var(--muted-foreground)]";
}

function readinessClass(state: string) {
  if (state === "ready") return "border border-[rgba(134,239,172,0.2)] bg-[rgba(134,239,172,0.08)] text-[var(--good)]";
  if (state === "blocked") return "border border-[rgba(251,113,133,0.2)] bg-[rgba(251,113,133,0.08)] text-[var(--danger)]";
  return "border border-[rgba(251,191,36,0.2)] bg-[rgba(251,191,36,0.08)] text-[var(--warning)]";
}
