export type Category = "งาน" | "สุขภาพ" | "บ้าน" | "การเรียนรู้" | "งานอดิเรก" | "เทคโนโลยี" | "อื่นๆ";
export type PaymentPlan = "cash" | "reserved-installment" | "debt";
export type NeedGate = "essential" | "useful" | "nice";
export type UsageGate = "daily" | "weekly" | "monthly";
export type ReplacementGate = "replace" | "upgrade" | "duplicate";
export type TimingGate = "now" | "wait" | "bad";
export type AlternativeGate = "compared" | "not-compared" | "cheaper-good";
export type SortMode = "priority" | "price-desc" | "price-asc" | "regret";

export type WishItem = {
  id: string;
  name: string;
  price: number;
  category: Category;
  reason: string;
  paymentPlan: PaymentPlan;
  savedForItem: number;
  monthlySetAside: number;
  needGate: NeedGate;
  usageGate: UsageGate;
  replacementGate: ReplacementGate;
  timingGate: TimingGate;
  alternativeGate: AlternativeGate;
  joy: number;
  similarOwned: boolean;
  trendDriven: boolean;
  pastUnused: boolean;
  promoOnly: boolean;
  canWait: boolean;
  coolingDays: number;
  stillWantIt: boolean;
  createdAt: number;
  updatedAt?: number;
};

export type FinancialProfile = {
  emergencyReserve: number;
  monthlyFunBudget: number;
  funSpentThisMonth: number;
};

export type BackupPayload = {
  version: 1;
  exportedAt: string;
  items: WishItem[];
  financialProfile: FinancialProfile;
};

export const STORAGE_KEY = "worth-it-items-v1";
export const PROFILE_KEY = "worth-it-financial-profile-v1";
export const BACKUP_FILE_PREFIX = "worth-it-backup";

export const defaultProfile: FinancialProfile = {
  emergencyReserve: 100000,
  monthlyFunBudget: 8000,
  funSpentThisMonth: 2500,
};

export const categories: Category[] = ["งาน", "สุขภาพ", "บ้าน", "การเรียนรู้", "งานอดิเรก", "เทคโนโลยี", "อื่นๆ"];

const DEMO_CREATED_AT = {
  headphones: Date.parse("2026-06-13T09:00:00.000Z"),
  keyboard: Date.parse("2026-06-14T08:00:00.000Z"),
  runningShoes: Date.parse("2026-06-12T09:00:00.000Z"),
} as const;

export const demoItems: WishItem[] = [
  {
    id: "demo-1",
    name: "หูฟังตัดเสียงรบกวน",
    price: 8900,
    category: "งาน",
    reason: "ช่วยโฟกัสตอนทำงานนอกบ้านและประชุมบ่อยขึ้น",
    paymentPlan: "cash",
    savedForItem: 0,
    monthlySetAside: 2500,
    needGate: "useful",
    usageGate: "daily",
    replacementGate: "upgrade",
    timingGate: "wait",
    alternativeGate: "compared",
    joy: 4,
    similarOwned: false,
    trendDriven: false,
    pastUnused: false,
    promoOnly: false,
    canWait: true,
    coolingDays: 30,
    stillWantIt: false,
    createdAt: DEMO_CREATED_AT.headphones,
  },
  {
    id: "demo-2",
    name: "คีย์บอร์ดรุ่นใหม่",
    price: 5200,
    category: "เทคโนโลยี",
    reason: "ตัวเก่ายังใช้ได้ แต่อยากได้สัมผัสใหม่และเห็นรีวิวบ่อย",
    paymentPlan: "cash",
    savedForItem: 0,
    monthlySetAside: 1500,
    needGate: "nice",
    usageGate: "weekly",
    replacementGate: "duplicate",
    timingGate: "wait",
    alternativeGate: "cheaper-good",
    joy: 3,
    similarOwned: true,
    trendDriven: true,
    pastUnused: true,
    promoOnly: true,
    canWait: true,
    coolingDays: 30,
    stillWantIt: false,
    createdAt: DEMO_CREATED_AT.keyboard,
  },
  {
    id: "demo-3",
    name: "รองเท้าวิ่ง",
    price: 3600,
    category: "สุขภาพ",
    reason: "คู่เดิมเริ่มเจ็บเท้า ถ้าวิ่งต่อควรเปลี่ยนจริง",
    paymentPlan: "cash",
    savedForItem: 0,
    monthlySetAside: 0,
    needGate: "essential",
    usageGate: "weekly",
    replacementGate: "replace",
    timingGate: "now",
    alternativeGate: "compared",
    joy: 4,
    similarOwned: false,
    trendDriven: false,
    pastUnused: false,
    promoOnly: false,
    canWait: false,
    coolingDays: 7,
    stillWantIt: true,
    createdAt: DEMO_CREATED_AT.runningShoes,
  },
];

export const emptyItem = (): Omit<WishItem, "id" | "createdAt"> => ({
  name: "",
  price: 0,
  category: "งาน",
  reason: "",
  paymentPlan: "cash",
  savedForItem: 0,
  monthlySetAside: 0,
  needGate: "useful",
  usageGate: "weekly",
  replacementGate: "upgrade",
  timingGate: "wait",
  alternativeGate: "not-compared",
  joy: 3,
  similarOwned: false,
  trendDriven: false,
  pastUnused: false,
  promoOnly: false,
  canWait: true,
  coolingDays: 30,
  stillWantIt: false,
  updatedAt: undefined,
});

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFiniteNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value);
}

function isBoolean(value: unknown) {
  return typeof value === "boolean";
}

function isCategory(value: unknown): value is Category {
  return typeof value === "string" && categories.includes(value as Category);
}

function isPaymentPlan(value: unknown): value is PaymentPlan {
  return value === "cash" || value === "reserved-installment" || value === "debt";
}

function isNeedGate(value: unknown): value is NeedGate {
  return value === "essential" || value === "useful" || value === "nice";
}

function isUsageGate(value: unknown): value is UsageGate {
  return value === "daily" || value === "weekly" || value === "monthly";
}

function isReplacementGate(value: unknown): value is ReplacementGate {
  return value === "replace" || value === "upgrade" || value === "duplicate";
}

function isTimingGate(value: unknown): value is TimingGate {
  return value === "now" || value === "wait" || value === "bad";
}

function isAlternativeGate(value: unknown): value is AlternativeGate {
  return value === "compared" || value === "not-compared" || value === "cheaper-good";
}

function isWishItem(value: unknown): value is WishItem {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    isFiniteNumber(value.price) &&
    isCategory(value.category) &&
    typeof value.reason === "string" &&
    isPaymentPlan(value.paymentPlan) &&
    isFiniteNumber(value.savedForItem) &&
    isFiniteNumber(value.monthlySetAside) &&
    isNeedGate(value.needGate) &&
    isUsageGate(value.usageGate) &&
    isReplacementGate(value.replacementGate) &&
    isTimingGate(value.timingGate) &&
    isAlternativeGate(value.alternativeGate) &&
    isFiniteNumber(value.joy) &&
    isBoolean(value.similarOwned) &&
    isBoolean(value.trendDriven) &&
    isBoolean(value.pastUnused) &&
    isBoolean(value.promoOnly) &&
    isBoolean(value.canWait) &&
    isFiniteNumber(value.coolingDays) &&
    isBoolean(value.stillWantIt) &&
    isFiniteNumber(value.createdAt) &&
    (value.updatedAt === undefined || isFiniteNumber(value.updatedAt))
  );
}

function isFinancialProfile(value: unknown): value is FinancialProfile {
  if (!isRecord(value)) return false;

  return (
    isFiniteNumber(value.emergencyReserve) &&
    isFiniteNumber(value.monthlyFunBudget) &&
    isFiniteNumber(value.funSpentThisMonth)
  );
}

function isBackupPayload(value: unknown): value is BackupPayload {
  if (!isRecord(value)) return false;

  return (
    value.version === 1 &&
    typeof value.exportedAt === "string" &&
    Array.isArray(value.items) &&
    value.items.every(isWishItem) &&
    isFinancialProfile(value.financialProfile)
  );
}

export function createBackupPayload(items: WishItem[], financialProfile: FinancialProfile): BackupPayload {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    items,
    financialProfile,
  };
}

export function createBackupFileName(date = new Date()) {
  const iso = date.toISOString().replaceAll(":", "-").replaceAll(".", "-");
  return `${BACKUP_FILE_PREFIX}-${iso}.json`;
}

export function parseBackupPayload(raw: string) {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("ไฟล์ไม่ใช่ JSON ที่อ่านได้");
  }

  if (!isBackupPayload(parsed)) {
    throw new Error("รูปแบบไฟล์ backup ไม่ถูกต้อง");
  }

  return parsed;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getDaysWaited(createdAt: number) {
  return Math.max(Math.floor((Date.now() - createdAt) / 86400000), 0);
}

export function getFunBudgetLeft(profile: FinancialProfile) {
  return Math.max(profile.monthlyFunBudget - profile.funSpentThisMonth, 0);
}

export function getCostPerUse(item: WishItem) {
  const usesPerYear = { daily: 260, weekly: 52, monthly: 12 }[item.usageGate] || 12;
  return Math.round(item.price / usesPerYear);
}

function getFinancialGate(item: WishItem, profile: FinancialProfile) {
  const funBudgetLeft = getFunBudgetLeft(profile);
  const savedForItem = Math.min(item.savedForItem, item.price);
  const remainingToSave = Math.max(item.price - savedForItem, 0);
  const monthsLeft = remainingToSave === 0 ? 0 : item.monthlySetAside > 0 ? Math.ceil(remainingToSave / item.monthlySetAside) : null;

  if (item.paymentPlan === "debt") {
    return { status: "risky", score: 0, label: "การเงินเสี่ยง: ต้องเป็นหนี้หรือแตะเงินลงทุน/เงินสำรอง", planLabel: "ห้ามแตะเงินลงทุนและเงินสำรอง", planSummary: "Too risky" } as const;
  }
  if (profile.monthlyFunBudget <= 0) {
    return { status: "review", score: 3, label: "การเงินต้องเช็ก: ยังไม่ได้ตั้งงบความสุขรายเดือน", planLabel: "ตั้ง Financial Profile ก่อน", planSummary: "Needs profile" } as const;
  }
  if (item.price <= funBudgetLeft) {
    return { status: "safe", score: 5, label: "Monthly Fun ผ่าน: อยู่ในงบความสุขเดือนนี้", planLabel: `งบความสุขเหลือ ${formatCurrency(funBudgetLeft - item.price)} หลังซื้อ`, planSummary: "Monthly Fun" } as const;
  }
  if (remainingToSave === 0) {
    return { status: "safe", score: 5, label: "Planned Want ผ่าน: เก็บเงินครบแล้ว", planLabel: "ซื้อได้จากเงินที่ตั้งใจเก็บไว้ ไม่แตะเงินหลัก", planSummary: "Saved" } as const;
  }
  if (item.monthlySetAside <= 0) {
    return { status: "review", score: 3, label: "ต้องทำแผนเก็บเงิน: ราคาเกินงบความสุขเดือนนี้", planLabel: `ยังขาด ${formatCurrency(remainingToSave)}`, planSummary: "Needs plan" } as const;
  }
  return { status: "save", score: 2, label: "Planned Want: ต้องเก็บเพิ่มก่อนซื้อ", planLabel: `ยังขาด ${formatCurrency(remainingToSave)} อีกประมาณ ${monthsLeft} เดือน`, planSummary: `${monthsLeft} mo left` } as const;
}

function getGateScores(item: WishItem) {
  return {
    need: { essential: 5, useful: 3, nice: 1 }[item.needGate] || 3,
    usage: { daily: 5, weekly: 3, monthly: 1 }[item.usageGate] || 3,
    replacement: { replace: 5, upgrade: 3, duplicate: 1 }[item.replacementGate] || 3,
    timing: { now: 5, wait: 3, bad: 1 }[item.timingGate] || 3,
    alternative: { compared: 5, "not-compared": 2, "cheaper-good": 1 }[item.alternativeGate] || 2,
  };
}

function getRegretSignals(item: WishItem) {
  const count = [
    item.similarOwned,
    item.trendDriven,
    item.pastUnused,
    item.promoOnly,
    item.replacementGate === "duplicate",
    item.needGate === "nice",
    item.timingGate === "bad",
    item.alternativeGate === "cheaper-good",
  ].filter(Boolean).length;

  return {
    count,
    level: count >= 3 ? "high" : count >= 1 ? "medium" : "low",
    score: count * 16 + (item.canWait ? 8 : 0),
  } as const;
}

function getBaseRecommendation(item: WishItem, worthScore: number, regretRisk: number, financial: ReturnType<typeof getFinancialGate>, regretSignals: ReturnType<typeof getRegretSignals>) {
  if (financial.status === "risky") return { label: "Too Risky", className: "drop" } as const;
  if (financial.status === "save") return { label: "Save First", className: "save" } as const;
  if (financial.status === "review") return { label: "Needs Review", className: "wait" } as const;
  if (item.alternativeGate !== "compared") return { label: "Compare", className: "compare" } as const;
  if (regretSignals.level === "high") return { label: "Wait 30 Days", className: "wait" } as const;
  if (worthScore >= 74 && regretRisk <= 34 && financial.status === "safe") return { label: "Buy Now", className: "buy" } as const;
  if (worthScore <= 42 || regretRisk >= 70) return { label: "Drop", className: "drop" } as const;
  return { label: item.canWait ? "Wait 30 Days" : "Wait", className: "wait" } as const;
}

function getBlockedReason(item: WishItem, financial: ReturnType<typeof getFinancialGate>, regretSignals: ReturnType<typeof getRegretSignals>, worthScore: number, regretRisk: number) {
  if (financial.status !== "safe") return financial.label;
  if (item.alternativeGate === "not-compared") return "ยังไม่ได้เทียบอย่างน้อย 2 ตัวเลือก";
  if (item.alternativeGate === "cheaper-good") return "มีตัวเลือกถูกกว่าที่ตอบโจทย์พอ";
  if (regretSignals.level === "high") return "สัญญาณเสียดายสูงเกินไป";
  if (item.needGate === "nice" && item.usageGate !== "daily") return "ยังเป็นของอยากได้มากกว่าของที่ใช้จริงบ่อย";
  return `คะแนนยังไม่ถึงเกณฑ์: Worth ${worthScore}/100, Regret ${Math.round(regretRisk)}%`;
}

function getReadiness(item: WishItem, worthScore: number, regretRisk: number, recommendation: ReturnType<typeof getBaseRecommendation>, financial: ReturnType<typeof getFinancialGate>, regretSignals: ReturnType<typeof getRegretSignals>) {
  const daysWaited = getDaysWaited(item.createdAt);
  const daysLeft = Math.max(item.coolingDays - daysWaited, 0);
  const coolingDone = !item.canWait || daysLeft === 0;
  const stillWantConfirmed = !item.canWait || item.stillWantIt;
  const gatesReady =
    recommendation.label === "Buy Now" &&
    financial.status === "safe" &&
    regretSignals.level !== "high" &&
    item.alternativeGate === "compared" &&
    (item.needGate !== "nice" || item.usageGate === "daily");

  if (gatesReady && coolingDone && stillWantConfirmed) {
    return { readyToBuy: true, className: "ready", label: "โอเคแล้ว ซื้อได้", detail: item.canWait ? `รอครบ ${item.coolingDays} วัน และยังอยากได้อยู่` : "คะแนนผ่านและไม่จำเป็นต้องรอ" } as const;
  }
  if (!gatesReady) {
    return { readyToBuy: false, className: "blocked", label: "ยังไม่ผ่านเกณฑ์ซื้อ", detail: getBlockedReason(item, financial, regretSignals, worthScore, regretRisk) } as const;
  }
  if (!coolingDone) {
    return { readyToBuy: false, className: "pending", label: `รออีก ${daysLeft} วัน`, detail: `รอมาแล้ว ${daysWaited}/${item.coolingDays} วัน ก่อนประเมินซ้ำ` } as const;
  }
  return { readyToBuy: false, className: "pending", label: "รอยืนยันความอยาก", detail: "ครบเวลารอแล้ว ถ้ายังอยากได้จริงให้ติ๊กตอนแก้ไขรายการ" } as const;
}

function getReasons(item: WishItem, financial: ReturnType<typeof getFinancialGate>, regretSignals: ReturnType<typeof getRegretSignals>) {
  const reasons: string[] = [financial.label];
  if (financial.planLabel) reasons.push(financial.planLabel);
  if (item.needGate === "essential") reasons.push("จำเป็นจริง");
  if (item.usageGate === "daily") reasons.push("ใช้เกือบทุกวัน");
  if (item.replacementGate === "replace") reasons.push("แทนของเดิมที่มีปัญหา");
  if (item.replacementGate === "duplicate") reasons.push("ซ้ำกับของที่มี");
  if (item.alternativeGate === "not-compared") reasons.push("ยังไม่ได้เทียบตัวเลือก");
  if (item.alternativeGate === "cheaper-good") reasons.push("มีตัวถูกกว่าที่ตอบโจทย์");
  if (item.similarOwned) reasons.push("มีของคล้ายกันอยู่แล้ว");
  if (item.trendDriven) reasons.push("อาจโดนโปรหรือกระแสลาก");
  if (item.pastUnused) reasons.push("เคยซื้อแล้วไม่ค่อยใช้");
  if (item.promoOnly) reasons.push("อยากได้เพราะโปรเป็นหลัก");
  if (regretSignals.level === "high") reasons.push("เสี่ยงเสียดายสูง");
  if (item.canWait) reasons.push(`ตั้งเวลารอ ${item.coolingDays} วัน`);
  if (item.stillWantIt) reasons.push("รอแล้ว ยังอยากได้อยู่");
  return reasons.slice(0, 5);
}

export function scoreItem(item: WishItem, profile: FinancialProfile) {
  const financial = getFinancialGate(item, profile);
  const gateScores = getGateScores(item);
  const regretSignals = getRegretSignals(item);
  const positiveScore =
    gateScores.need * 20 +
    gateScores.usage * 16 +
    item.joy * 12 +
    gateScores.replacement * 13 +
    gateScores.timing * 12 +
    gateScores.alternative * 10 +
    financial.score * 17;

  const regretRisk = clamp(regretSignals.score - gateScores.usage * 4 - gateScores.need * 3, 0, 100);
  const worthScore = clamp(Math.round(positiveScore / 5 - regretRisk * 0.35), 0, 100);
  const recommendation = getBaseRecommendation(item, worthScore, regretRisk, financial, regretSignals);
  const readiness = getReadiness(item, worthScore, regretRisk, recommendation, financial, regretSignals);
  const priority = worthScore - regretRisk * 0.35 - item.price / 25000 + (readiness.readyToBuy ? 18 : 0);

  return {
    worthScore,
    regretRisk: Math.round(regretRisk),
    priority,
    recommendation: readiness.readyToBuy ? { label: "Ready to Buy", className: "buy" as const } : recommendation,
    readiness,
    financial,
    reasons: getReasons(item, financial, regretSignals),
  };
}

export function sortItems(items: WishItem[], profile: FinancialProfile, sortMode: SortMode) {
  return [...items]
    .map((item) => ({ ...item, score: scoreItem(item, profile) }))
    .sort((a, b) => {
      if (sortMode === "price-desc") return b.price - a.price;
      if (sortMode === "price-asc") return a.price - b.price;
      if (sortMode === "regret") return b.score.regretRisk - a.score.regretRisk;
      return b.score.priority - a.score.priority;
    });
}
