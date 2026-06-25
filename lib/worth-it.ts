export type Category = "งาน" | "สุขภาพ" | "บ้าน" | "การเรียนรู้" | "งานอดิเรก" | "เทคโนโลยี" | "อื่นๆ";
export type PaymentPlan = "cash" | "reserved-installment" | "debt";
export type NeedGate = "essential" | "useful" | "nice";
export type UsageGate = "daily" | "weekly" | "monthly";
export type ReplacementGate = "replace" | "upgrade" | "duplicate";
export type TimingGate = "now" | "wait" | "bad";
export type AlternativeGate = "compared" | "not-compared" | "cheaper-good";
export type PurchaseStage = "park" | "research" | "saving" | "buy";
export type UpgradeReason = "broken" | "discomfort" | "productivity" | "qualityOfLife" | "wantBetter" | "fomo";
export type ProductType = "durable" | "upgrade" | "subscription" | "experience" | "learning" | "health" | "home";
export type EvidenceLevel = "feeling" | "researched" | "tried" | "problem-proven";
export type SortMode = "system" | "worth" | "regret-low" | "price-asc" | "price-desc" | "newest" | "closest";

export type WishItem = {
  id: string;
  name: string;
  price: number;
  category: Category;
  productType: ProductType;
  reason: string;
  evidenceLevel: EvidenceLevel;
  paymentPlan: PaymentPlan;
  savedForItem: number;
  monthlySetAside: number;
  recurringCost: number;
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
  purchaseStageOverride: PurchaseStage | null;
  expectedUseYears: number;
  currentProblem: string;
  upgradeReason: UpgradeReason;
  currentPainLevel: 0 | 1 | 2 | 3 | 4 | 5;
  improvementImpact: 0 | 1 | 2 | 3 | 4 | 5;
  createdAt: number;
  updatedAt?: number;
};

export type FinancialProfile = {
  emergencyReserve: number;
  targetEmergencyReserve: number;
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
  targetEmergencyReserve: 100000,
  monthlyFunBudget: 8000,
  funSpentThisMonth: 2500,
};

export const purchaseStageLabels: Record<PurchaseStage, string> = {
  park: "พักไว้ก่อน",
  research: "ศึกษาต่อ",
  saving: "กำลังเก็บเงิน",
  buy: "ซื้อได้",
};

export const upgradeReasonLabels: Record<UpgradeReason, string> = {
  broken: "🔧 ของเดิมเสีย / พัง / หมดสภาพ",
  discomfort: "😣 ส่งผลเสียต่อร่างกาย (ใช้แล้วปวด/เมื่อย/อึดอัด)",
  productivity: "🚀 ช่วยงานดีขึ้น (ประหยัดเวลา/ลดขั้นตอนชัดเจน)",
  qualityOfLife: "🏡 เพิ่มคุณภาพชีวิต (ผ่อนแรง/นอนดีขึ้น/สุขภาพจิตดีขึ้น)",
  wantBetter: "💎 ของเดิมยังดี แต่อยากได้ที่ใหม่/สเปกสูงกว่าเดิม",
  fomo: "🔥 ตามกระแส (โดนป้ายยา/โปรลดจำกัดเวลา)",
};

export const productTypeLabels: Record<ProductType, string> = {
  durable: "📦 ของใช้ / อุปกรณ์",
  upgrade: "⚡ อัปเกรดของเดิม",
  subscription: "🔄 สมาชิก / บริการต่อเนื่อง",
  experience: "✈️ ทริป / ประสบการณ์",
  learning: "🎓 การเรียนรู้",
  health: "🛡️ สุขภาพ / ความปลอดภัย",
  home: "🏠 บ้าน / เครื่องใช้",
};

export const evidenceLevelLabels: Record<EvidenceLevel, string> = {
  feeling: "💭 แค่ความรู้สึก (ยังไม่มีข้อมูลสเปก/ของจริง)",
  researched: "📖 หาข้อมูลแน่น (ดูรีวิวละเอียดและเปรียบเทียบแล้ว)",
  tried: "🧪 ทดลองใช้จริง (เคยไปลองที่ร้าน/ยืมเพื่อน/เช่ามาใช้)",
  "problem-proven": "🛠️ มีปัญหาชัดเจน (เกิดปัญหากับของเดิมจนยืนยันแล้ว)",
};

export const categories: Category[] = ["งาน", "สุขภาพ", "บ้าน", "การเรียนรู้", "งานอดิเรก", "เทคโนโลยี", "อื่นๆ"];
export const productTypes: ProductType[] = ["durable", "upgrade", "subscription", "experience", "learning", "health", "home"];
export const evidenceLevels: EvidenceLevel[] = ["feeling", "researched", "tried", "problem-proven"];

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
    productType: "upgrade",
    reason: "ช่วยโฟกัสตอนทำงานนอกบ้านและประชุมบ่อยขึ้น",
    evidenceLevel: "problem-proven",
    paymentPlan: "cash",
    savedForItem: 0,
    monthlySetAside: 2500,
    recurringCost: 0,
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
    purchaseStageOverride: null,
    expectedUseYears: 2,
    currentProblem: "ประชุมนอกบ้านแล้วเสียงรอบข้างรบกวนมาก",
    upgradeReason: "productivity",
    currentPainLevel: 4,
    improvementImpact: 4,
    createdAt: DEMO_CREATED_AT.headphones,
  },
  {
    id: "demo-2",
    name: "คีย์บอร์ดรุ่นใหม่",
    price: 5200,
    category: "เทคโนโลยี",
    productType: "upgrade",
    reason: "ตัวเก่ายังใช้ได้ แต่อยากได้สัมผัสใหม่และเห็นรีวิวบ่อย",
    evidenceLevel: "feeling",
    paymentPlan: "cash",
    savedForItem: 0,
    monthlySetAside: 1500,
    recurringCost: 0,
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
    purchaseStageOverride: null,
    expectedUseYears: 2,
    currentProblem: "",
    upgradeReason: "fomo",
    currentPainLevel: 1,
    improvementImpact: 2,
    createdAt: DEMO_CREATED_AT.keyboard,
  },
  {
    id: "demo-3",
    name: "รองเท้าวิ่ง",
    price: 3600,
    category: "สุขภาพ",
    productType: "health",
    reason: "คู่เดิมเริ่มเจ็บเท้า ถ้าวิ่งต่อควรเปลี่ยนจริง",
    evidenceLevel: "problem-proven",
    paymentPlan: "cash",
    savedForItem: 0,
    monthlySetAside: 0,
    recurringCost: 0,
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
    purchaseStageOverride: null,
    expectedUseYears: 1,
    currentProblem: "",
    upgradeReason: "qualityOfLife",
    currentPainLevel: 0,
    improvementImpact: 1,
    createdAt: DEMO_CREATED_AT.runningShoes,
  },
];

export const emptyItem = (): Omit<WishItem, "id" | "createdAt"> => ({
  name: "",
  price: 0,
  category: "งาน",
  productType: "durable",
  reason: "",
  evidenceLevel: "feeling",
  paymentPlan: "cash",
  savedForItem: 0,
  monthlySetAside: 0,
  recurringCost: 0,
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
  purchaseStageOverride: null,
  expectedUseYears: 1,
  currentProblem: "",
  upgradeReason: "wantBetter",
  currentPainLevel: 0,
  improvementImpact: 1,
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

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isCategory(value: unknown): value is Category {
  return typeof value === "string" && categories.includes(value as Category);
}

function isProductType(value: unknown): value is ProductType {
  return typeof value === "string" && productTypes.includes(value as ProductType);
}

function isEvidenceLevel(value: unknown): value is EvidenceLevel {
  return typeof value === "string" && evidenceLevels.includes(value as EvidenceLevel);
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

function isPurchaseStage(value: unknown): value is PurchaseStage {
  return value === "park" || value === "research" || value === "saving" || value === "buy";
}

function isUpgradeReason(value: unknown): value is UpgradeReason {
  return value === "broken" || value === "discomfort" || value === "productivity" || value === "qualityOfLife" || value === "wantBetter" || value === "fomo";
}

function isPainOrImpactLevel(value: unknown): value is 0 | 1 | 2 | 3 | 4 | 5 {
  return isFiniteNumber(value) && value >= 0 && value <= 5 && Number.isInteger(value);
}

function isWishItem(value: unknown): value is WishItem {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    isFiniteNumber(value.price) &&
    isCategory(value.category) &&
    isProductType(value.productType) &&
    typeof value.reason === "string" &&
    isEvidenceLevel(value.evidenceLevel) &&
    isPaymentPlan(value.paymentPlan) &&
    isFiniteNumber(value.savedForItem) &&
    isFiniteNumber(value.monthlySetAside) &&
    isFiniteNumber(value.recurringCost) &&
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
    (value.purchaseStageOverride === null || isPurchaseStage(value.purchaseStageOverride)) &&
    isFiniteNumber(value.expectedUseYears) &&
    typeof value.currentProblem === "string" &&
    isUpgradeReason(value.upgradeReason) &&
    isPainOrImpactLevel(value.currentPainLevel) &&
    isPainOrImpactLevel(value.improvementImpact) &&
    isFiniteNumber(value.createdAt) &&
    (value.updatedAt === undefined || isFiniteNumber(value.updatedAt))
  );
}

function isFinancialProfile(value: unknown): value is FinancialProfile {
  if (!isRecord(value)) return false;

  return (
    isFiniteNumber(value.emergencyReserve) &&
    isFiniteNumber(value.targetEmergencyReserve) &&
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
    const normalized = normalizeBackupPayload(parsed);
    if (normalized) return normalized;
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

function getUsesPerYear(usageGate: UsageGate) {
  return { daily: 365, weekly: 52, monthly: 12 }[usageGate] || 12;
}

function getAnnualRecurringCost(item: WishItem) {
  return Math.max(item.recurringCost, 0) * 12;
}

function getOwnershipCost(item: WishItem) {
  return item.price + getAnnualRecurringCost(item) * Math.max(item.expectedUseYears || 1, 1);
}

export function getCostPerUse(item: WishItem) {
  const usesPerYear = getUsesPerYear(item.usageGate);
  const expectedUseYears = Math.max(item.expectedUseYears || 1, 1);
  const ownershipCost = getOwnershipCost(item);
  const value = ownershipCost / (usesPerYear * expectedUseYears);

  return {
    value,
    label: `ประมาณ ${value.toFixed(2)} บาท/ครั้ง`,
    usesPerYear,
    expectedUseYears,
    ownershipCost,
  };
}

function getEffectiveReplacementGate(item: WishItem): ReplacementGate {
  if (item.similarOwned && item.replacementGate === "upgrade") return "upgrade";
  return item.replacementGate;
}

function getEffectiveNeedGate(item: WishItem): NeedGate {
  if (item.similarOwned && item.replacementGate === "upgrade" && item.needGate === "essential") {
    return "useful";
  }
  return item.needGate;
}

function isUpgradeItem(item: WishItem) {
  return item.replacementGate === "upgrade" || item.similarOwned;
}

function getUpgradeReasonScore(item: WishItem) {
  if (!isUpgradeItem(item)) return 0;

  return {
    broken: 14,
    discomfort: 12,
    productivity: 9,
    qualityOfLife: 4,
    wantBetter: -2,
    fomo: -10,
  }[item.upgradeReason];
}

function getUpgradeAnalysis(item: WishItem) {
  const hasCurrentProblem = item.currentProblem.trim().length > 0;
  const hasMeaningfulReason =
    item.reason.trim().length > 0 ||
    hasCurrentProblem ||
    item.upgradeReason === "broken" ||
    item.upgradeReason === "discomfort" ||
    item.upgradeReason === "productivity" ||
    item.currentPainLevel > 0 ||
    item.improvementImpact > 0;
  const lowPainLowImpact = item.currentPainLevel <= 1 && item.improvementImpact <= 2;
  const highPainOrImpact = item.currentPainLevel >= 3 || item.improvementImpact >= 4;
  const dailyProblemUpgrade =
    item.usageGate === "daily" &&
    item.currentPainLevel >= 4 &&
    item.improvementImpact >= 4 &&
    (item.upgradeReason === "discomfort" || item.upgradeReason === "productivity" || item.upgradeReason === "qualityOfLife");
  const missingProblemForWeakReason =
    item.replacementGate === "upgrade" &&
    !hasCurrentProblem &&
    (item.upgradeReason === "wantBetter" || item.upgradeReason === "fomo");
  const weakOwnedUpgrade =
    item.similarOwned &&
    item.replacementGate === "upgrade" &&
    (item.upgradeReason === "wantBetter" || item.upgradeReason === "fomo") &&
    item.currentPainLevel <= 2;

  return {
    hasCurrentProblem,
    lowPainLowImpact,
    highPainOrImpact,
    dailyProblemUpgrade,
    missingProblemForWeakReason,
    weakOwnedUpgrade,
    hasMeaningfulReason,
    isMeaningfulUpgrade:
      item.replacementGate === "upgrade" &&
      (item.upgradeReason === "broken" || item.upgradeReason === "discomfort" || item.upgradeReason === "productivity") &&
      (highPainOrImpact || hasCurrentProblem),
  } as const;
}

function isLowPriceUsefulItem(item: WishItem, profile: FinancialProfile) {
  return (
    item.price <= getFunBudgetLeft(profile) &&
    item.paymentPlan !== "debt" &&
    item.currentPainLevel >= 4 &&
    item.improvementImpact >= 4 &&
    item.usageGate === "daily"
  );
}

function getEvidenceScore(item: WishItem) {
  return {
    feeling: 1,
    researched: 3,
    tried: 4,
    "problem-proven": 5,
  }[item.evidenceLevel];
}

function getProductTypeScore(item: WishItem) {
  const base = {
    durable: 3,
    upgrade: item.replacementGate === "upgrade" ? 3 : 2,
    subscription: item.recurringCost > 0 ? 2 : 1,
    experience: item.canWait ? 2 : 3,
    learning: item.usageGate === "daily" || item.usageGate === "weekly" ? 4 : 3,
    health: item.currentPainLevel >= 3 || item.needGate === "essential" ? 5 : 4,
    home: item.replacementGate === "replace" ? 4 : 3,
  }[item.productType];

  return clamp(base, 1, 5);
}

function getRecurringBurden(item: WishItem, profile: FinancialProfile) {
  if (item.recurringCost <= 0) return { level: "none", scorePenalty: 0, regretPenalty: 0, label: "" } as const;

  const ratio = profile.monthlyFunBudget > 0 ? item.recurringCost / profile.monthlyFunBudget : 1;
  if (ratio >= 0.25) {
    return {
      level: "high",
      scorePenalty: 12,
      regretPenalty: 16,
      label: `ค่าใช้จ่ายต่อเนื่องสูง (${formatCurrency(item.recurringCost)}/เดือน)`,
    } as const;
  }
  if (ratio >= 0.1) {
    return {
      level: "medium",
      scorePenalty: 6,
      regretPenalty: 8,
      label: `มีค่าใช้จ่ายต่อเนื่อง ${formatCurrency(item.recurringCost)}/เดือน`,
    } as const;
  }

  return {
    level: "low",
    scorePenalty: 2,
    regretPenalty: 3,
    label: `มีค่าใช้จ่ายต่อเนื่อง ${formatCurrency(item.recurringCost)}/เดือน`,
  } as const;
}

function getSuggestedCoolingDays(item: WishItem) {
  if (item.evidenceLevel === "feeling") return 30;
  if (item.upgradeReason === "fomo" || item.trendDriven || item.promoOnly) return 30;
  if (item.productType === "subscription" || item.recurringCost > 0) return 30;
  if (item.price <= 1500) return 7;
  if (item.price <= 3000) return 14;
  return 30;
}

function getFinancialGate(item: WishItem, profile: FinancialProfile) {
  const funBudgetLeft = getFunBudgetLeft(profile);
  const savedForItem = Math.min(item.savedForItem, item.price);
  const remainingToSave = Math.max(item.price - savedForItem, 0);
  const monthsLeft = remainingToSave === 0 ? 0 : item.monthlySetAside > 0 ? Math.ceil(remainingToSave / item.monthlySetAside) : null;
  const usingDebtWithoutFullSavings = item.paymentPlan === "debt" && savedForItem < item.price;
  const expensiveItemNeedsDedicatedMoney = item.price > 3000 && savedForItem < item.price && item.price > funBudgetLeft;
  const expensiveReserveBlocked =
    item.price > 10000 && profile.emergencyReserve < profile.targetEmergencyReserve && savedForItem < item.price;
  const recurringBurden = getRecurringBurden(item, profile);

  if (item.paymentPlan === "debt" && item.replacementGate === "upgrade" && savedForItem < item.price) {
    return {
      status: "risky",
      score: 0,
      label: "ห้ามผ่อนของที่เป็นการอัปเกรด",
      planLabel: "ห้ามใช้หนี้กับของที่ยังไม่จำเป็นจริง",
      planSummary: "Too risky",
    } as const;
  }
  if (usingDebtWithoutFullSavings) {
    return {
      status: "risky",
      score: 0,
      label: "การเงินเสี่ยง: ต้องเป็นหนี้หรือแตะเงินลงทุน/เงินสำรอง",
      planLabel: "ห้ามแตะเงินลงทุนและเงินสำรอง",
      planSummary: "Too risky",
    } as const;
  }
  if (expensiveReserveBlocked) {
    return {
      status: "risky",
      score: 1,
      label: "เงินสำรองฉุกเฉินยังไม่ถึงเป้า",
      planLabel: "ของราคาสูงควรเก็บเงินแยกก่อนซื้อ",
      planSummary: "Too risky",
    } as const;
  }
  if (profile.monthlyFunBudget <= 0) {
    return { status: "review", score: 3, label: "การเงินต้องเช็ก: ยังไม่ได้ตั้งงบความสุขรายเดือน", planLabel: "ตั้ง Financial Profile ก่อน", planSummary: "Needs profile" } as const;
  }
  if (recurringBurden.level === "high") {
    return {
      status: "review",
      score: 2,
      label: recurringBurden.label,
      planLabel: "เช็กว่ายังรับภาระรายเดือนได้จริงก่อนเริ่ม",
      planSummary: "Recurring",
    } as const;
  }
  if (expensiveItemNeedsDedicatedMoney) {
    return {
      status: "review",
      score: 2,
      label: "ของราคาสูงควรเก็บเงินแยกก่อนซื้อ",
      planLabel: `ยังขาด ${formatCurrency(remainingToSave)}`,
      planSummary: "Needs plan",
    } as const;
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
  const effectiveNeedGate = getEffectiveNeedGate(item);
  const effectiveReplacementGate = getEffectiveReplacementGate(item);
  const upgradeAnalysis = getUpgradeAnalysis(item);
  const replacementBase = { replace: 5, upgrade: 3, duplicate: 1 }[effectiveReplacementGate] || 3;
  const replacementScore =
    effectiveReplacementGate === "upgrade"
      ? clamp(replacementBase + Math.round(getUpgradeReasonScore(item) / 4) + (upgradeAnalysis.highPainOrImpact ? 1 : 0) - (upgradeAnalysis.lowPainLowImpact ? 1 : 0), 1, 5)
      : replacementBase;

  return {
    need: { essential: 5, useful: 3, nice: 1 }[effectiveNeedGate] || 3,
    usage: { daily: 5, weekly: 3, monthly: 1 }[item.usageGate] || 3,
    replacement: replacementScore,
    timing: { now: 5, wait: 3, bad: 1 }[item.timingGate] || 3,
    alternative: { compared: 5, "not-compared": 2, "cheaper-good": 1 }[item.alternativeGate] || 2,
    evidence: getEvidenceScore(item),
    productType: getProductTypeScore(item),
  };
}

function getRegretSignals(item: WishItem, profile: FinancialProfile, financial: ReturnType<typeof getFinancialGate>) {
  const upgradeAnalysis = getUpgradeAnalysis(item);
  const funBudgetLeft = getFunBudgetLeft(profile);
  const recurringBurden = getRecurringBurden(item, profile);
  const count = [
    item.similarOwned,
    item.trendDriven,
    item.pastUnused,
    item.promoOnly,
    item.replacementGate === "duplicate",
    item.needGate === "nice",
    item.timingGate === "bad",
    item.alternativeGate === "cheaper-good",
    item.evidenceLevel === "feeling",
    recurringBurden.level === "high",
  ].filter(Boolean).length;

  let score = 40;

  if (item.similarOwned) score += 8;
  if (item.pastUnused) score += 18;
  if (item.paymentPlan === "debt") score += 18;
  if (item.replacementGate === "upgrade") score += 6;
  if (item.upgradeReason === "wantBetter") score += 4;
  if (item.upgradeReason === "fomo") score += 18;
  if (item.trendDriven) score += 8;
  if (item.promoOnly) score += 10;
  if (item.canWait) score += 5;
  if (item.price > funBudgetLeft && funBudgetLeft > 0) score += Math.min(Math.round((item.price / funBudgetLeft) * 5), 18);
  if (item.price > 10000 && profile.emergencyReserve < profile.targetEmergencyReserve) score += 12;
  if (upgradeAnalysis.missingProblemForWeakReason) score += 14;
  if (upgradeAnalysis.lowPainLowImpact && item.replacementGate === "upgrade") score += 4;
  if (item.evidenceLevel === "feeling") score += 12;
  if (item.evidenceLevel === "researched") score -= 4;
  if (item.evidenceLevel === "tried") score -= 8;
  if (item.evidenceLevel === "problem-proven") score -= 10;
  score += recurringBurden.regretPenalty;

  if (item.upgradeReason === "broken") score -= 8;
  if (item.upgradeReason === "discomfort") score -= 8;
  if (item.upgradeReason === "productivity") score -= 7;
  if (item.currentPainLevel >= 4) score -= 7;
  if (item.improvementImpact >= 4) score -= 6;
  if (item.usageGate === "daily") score -= 7;
  if (item.price <= funBudgetLeft && financial.status === "safe") score -= 8;
  if (item.savedForItem >= item.price) score -= 8;
  if (isLowPriceUsefulItem(item, profile)) score -= 8;

  score = clamp(score, 0, 100);

  return {
    count,
    level:
      item.similarOwned && item.pastUnused
        ? "high"
        : score >= 65 || upgradeAnalysis.weakOwnedUpgrade || item.upgradeReason === "fomo"
          ? "high"
          : score >= 35 || count >= 1
              ? "medium"
              : "low",
    score,
  } as const;
}

function getBaseRecommendation(item: WishItem, profile: FinancialProfile, worthScore: number, regretRisk: number, financial: ReturnType<typeof getFinancialGate>, regretSignals: ReturnType<typeof getRegretSignals>) {
  const upgradeAnalysis = getUpgradeAnalysis(item);
  const lowPriceUseful = isLowPriceUsefulItem(item, profile);
  if (financial.status === "risky") return { label: "Too Risky", className: "drop" } as const;
  if (item.similarOwned && item.pastUnused) return { label: "Too Risky", className: "drop" } as const;
  if (!lowPriceUseful && (upgradeAnalysis.weakOwnedUpgrade || upgradeAnalysis.missingProblemForWeakReason)) return { label: "Not Now", className: "wait" } as const;
  if (financial.status === "save") return { label: "Save First", className: "save" } as const;
  if (financial.status === "review") return { label: "Needs Review", className: "wait" } as const;
  if (item.evidenceLevel === "feeling" && item.price > 1500) return { label: "Find Evidence", className: "compare" } as const;
  if (item.alternativeGate !== "compared") return { label: "Compare", className: "compare" } as const;
  if (regretSignals.level === "high") return { label: "Wait 30 Days", className: "wait" } as const;
  if (worthScore >= 74 && regretRisk <= 34 && financial.status === "safe") return { label: "Buy Now", className: "buy" } as const;
  if (worthScore <= 42 || regretRisk >= 70) return { label: "Drop", className: "drop" } as const;
  return { label: item.canWait ? "Wait 30 Days" : "Wait", className: "wait" } as const;
}

function getBlockedReason(item: WishItem, financial: ReturnType<typeof getFinancialGate>, regretSignals: ReturnType<typeof getRegretSignals>, worthScore: number, regretRisk: number) {
  const upgradeAnalysis = getUpgradeAnalysis(item);
  if (financial.status !== "safe") return financial.label;
  if (upgradeAnalysis.missingProblemForWeakReason) return "ยังไม่ได้ระบุปัญหาของของเดิม";
  if (upgradeAnalysis.lowPainLowImpact && item.replacementGate === "upgrade") return "ของเดิมยังไม่ได้มีปัญหาชัดเจน";
  if (upgradeAnalysis.weakOwnedUpgrade) return "เป็นการอัปเกรดเพราะอยากได้มากกว่าจำเป็น";
  if (item.similarOwned && item.canWait) return "มีของคล้ายกันอยู่แล้วและยังรอได้";
  if (item.similarOwned && item.pastUnused) return "เคยซื้อของแนวนี้แล้วไม่ค่อยได้ใช้";
  if (item.alternativeGate === "not-compared") return "ยังไม่ได้เทียบอย่างน้อย 2 ตัวเลือก";
  if (item.alternativeGate === "cheaper-good") return "มีตัวเลือกถูกกว่าที่ตอบโจทย์พอ";
  if (item.evidenceLevel === "feeling" && item.price > 1500) return "เหตุผลยังเป็นความรู้สึกมากกว่าหลักฐาน";
  if (regretSignals.level === "high") return "สัญญาณเสียดายสูงเกินไป";
  if (item.needGate === "nice" && item.usageGate !== "daily") return "ยังเป็นของอยากได้มากกว่าของที่ใช้จริงบ่อย";
  return `คะแนนยังไม่ถึงเกณฑ์: Worth ${worthScore}/100, Regret ${Math.round(regretRisk)}%`;
}

function getReadiness(item: WishItem, profile: FinancialProfile, worthScore: number, regretRisk: number, recommendation: ReturnType<typeof getBaseRecommendation>, financial: ReturnType<typeof getFinancialGate>, regretSignals: ReturnType<typeof getRegretSignals>) {
  const upgradeAnalysis = getUpgradeAnalysis(item);
  const lowPriceUseful = isLowPriceUsefulItem(item, profile);
  const daysWaited = getDaysWaited(item.createdAt);
  const effectiveCoolingDays = Math.min(item.coolingDays, getSuggestedCoolingDays(item));
  const daysLeft = Math.max(effectiveCoolingDays - daysWaited, 0);
  const coolingDone = !item.canWait || daysLeft === 0;
  const stillWantConfirmed = !item.canWait || item.stillWantIt;
  const upgradeReady =
    item.replacementGate !== "upgrade" ||
    (
      !upgradeAnalysis.missingProblemForWeakReason &&
      !upgradeAnalysis.lowPainLowImpact &&
      (!upgradeAnalysis.weakOwnedUpgrade || lowPriceUseful) &&
      item.upgradeReason !== "fomo"
    );
  const gatesReady =
    recommendation.label === "Buy Now" &&
    financial.status === "safe" &&
    (!(item.similarOwned && item.canWait) || lowPriceUseful) &&
    upgradeReady &&
    regretSignals.level !== "high" &&
    item.evidenceLevel !== "feeling" &&
    item.alternativeGate === "compared" &&
    (item.needGate !== "nice" || item.usageGate === "daily");

  if (gatesReady && coolingDone && stillWantConfirmed) {
    return { readyToBuy: true, className: "ready", label: "โอเคแล้ว ซื้อได้", detail: item.canWait ? `รอครบ ${effectiveCoolingDays} วัน และยังอยากได้อยู่` : "คะแนนผ่านและไม่จำเป็นต้องรอ" } as const;
  }
  if (!gatesReady) {
    return { readyToBuy: false, className: "blocked", label: "ยังไม่ผ่านเกณฑ์ซื้อ", detail: getBlockedReason(item, financial, regretSignals, worthScore, regretRisk) } as const;
  }
  if (!coolingDone) {
    return { readyToBuy: false, className: "pending", label: `รออีก ${daysLeft} วัน`, detail: `รอมาแล้ว ${daysWaited}/${effectiveCoolingDays} วัน ก่อนประเมินซ้ำ` } as const;
  }
  return { readyToBuy: false, className: "pending", label: "รอยืนยันความอยาก", detail: "ครบเวลารอแล้ว ถ้ายังอยากได้จริงให้ติ๊กตอนแก้ไขรายการ" } as const;
}

function getReasons(item: WishItem, profile: FinancialProfile, financial: ReturnType<typeof getFinancialGate>, regretSignals: ReturnType<typeof getRegretSignals>) {
  const upgradeAnalysis = getUpgradeAnalysis(item);
  const recurringBurden = getRecurringBurden(item, profile);
  const reasons: string[] = [financial.label];
  if (financial.planLabel) reasons.push(financial.planLabel);
  reasons.push(productTypeLabels[item.productType]);
  reasons.push(evidenceLevelLabels[item.evidenceLevel]);
  if (recurringBurden.label) reasons.push(recurringBurden.label);
  if (getEffectiveNeedGate(item) === "essential") reasons.push("จำเป็นจริง");
  if (item.usageGate === "daily") reasons.push("ใช้เกือบทุกวัน");
  if (item.replacementGate === "replace") reasons.push("แทนของเดิมที่มีปัญหา");
  if (item.replacementGate === "duplicate") reasons.push("ซ้ำกับของที่มี");
  if (item.similarOwned && item.replacementGate === "upgrade") reasons.push("เป็นการอัปเกรดมากกว่าความจำเป็น");
  if (upgradeAnalysis.missingProblemForWeakReason) reasons.push("ยังไม่ได้ระบุปัญหาของของเดิม");
  if (upgradeAnalysis.lowPainLowImpact && item.replacementGate === "upgrade") reasons.push("ของเดิมยังไม่ได้มีปัญหาชัดเจน");
  if (upgradeAnalysis.dailyProblemUpgrade) reasons.push("อัปเกรดนี้ช่วยแก้ปัญหาที่กระทบชีวิตประจำวัน");
  if (upgradeAnalysis.weakOwnedUpgrade) reasons.push("ของเดิมยังใช้งานได้");
  if (upgradeAnalysis.weakOwnedUpgrade) reasons.push("เป็นการอัปเกรดเพราะอยากได้มากกว่าจำเป็น");
  if (item.alternativeGate === "not-compared") reasons.push("ยังไม่ได้เทียบตัวเลือก");
  if (item.alternativeGate === "cheaper-good") reasons.push("มีตัวถูกกว่าที่ตอบโจทย์");
  if (item.similarOwned) reasons.push("มีของคล้ายกันอยู่แล้ว");
  if (item.trendDriven) reasons.push("อาจโดนโปรหรือกระแสลาก");
  if (item.pastUnused) reasons.push("เคยซื้อของแนวนี้แล้วไม่ค่อยได้ใช้");
  if (item.promoOnly) reasons.push("อยากได้เพราะโปรเป็นหลัก");
  if (regretSignals.level === "high") reasons.push("เสี่ยงเสียดายสูง");
  if (item.canWait) reasons.push(`ตั้งเวลารอ ${item.coolingDays} วัน`);
  if (item.stillWantIt) reasons.push("รอแล้ว ยังอยากได้อยู่");
  return [...new Set(reasons)].slice(0, 6);
}

function getBlocks(item: WishItem, profile: FinancialProfile, financial: ReturnType<typeof getFinancialGate>) {
  const upgradeAnalysis = getUpgradeAnalysis(item);
  const recurringBurden = getRecurringBurden(item, profile);
  const daysWaited = getDaysWaited(item.createdAt);
  const effectiveCoolingDays = Math.min(item.coolingDays, getSuggestedCoolingDays(item));
  const daysLeft = Math.max(effectiveCoolingDays - daysWaited, 0);
  const lowPriceUseful = isLowPriceUsefulItem(item, profile);
  const blocks = {
    financial: [] as string[],
    decision: [] as string[],
    upgrade: [] as string[],
    cooling: [] as string[],
  };

  if (financial.status === "risky" || financial.status === "save" || financial.status === "review") blocks.financial.push(financial.label);
  if (financial.planLabel && financial.status !== "safe") blocks.financial.push(financial.planLabel);
  if (recurringBurden.level === "medium" || recurringBurden.level === "high") blocks.financial.push(recurringBurden.label);
  if (item.evidenceLevel === "feeling" && item.price > 1500) blocks.decision.push("เหตุผลยังเป็นความรู้สึก ควรหาหลักฐานเพิ่มก่อนซื้อ");
  if (item.alternativeGate === "not-compared") blocks.decision.push("ยังไม่ได้เทียบอย่างน้อย 2 ตัวเลือก");
  if (item.alternativeGate === "cheaper-good") blocks.decision.push("มีตัวเลือกถูกกว่าที่ตอบโจทย์พอ");
  if (item.similarOwned) blocks.decision.push(lowPriceUseful ? "มีของคล้ายกันอยู่แล้ว แต่ราคาต่ำและแก้ปัญหาที่เจอทุกวัน" : "มีของคล้ายกันอยู่แล้วและยังรอได้");
  if (item.replacementGate === "upgrade" && upgradeAnalysis.lowPainLowImpact) blocks.decision.push("ของเดิมยังใช้งานได้");
  if (upgradeAnalysis.missingProblemForWeakReason) blocks.decision.push("ยังไม่ได้ระบุปัญหาของของเดิม");
  if (item.replacementGate === "upgrade" && !lowPriceUseful && !upgradeAnalysis.isMeaningfulUpgrade) blocks.upgrade.push("เป็นการอัปเกรดมากกว่าความจำเป็น");
  if (upgradeAnalysis.weakOwnedUpgrade) blocks.upgrade.push("เป็นการอัปเกรดเพราะอยากได้มากกว่าจำเป็น");
  if (item.pastUnused) blocks.upgrade.push("เคยซื้อของแนวนี้แล้วไม่ค่อยได้ใช้");
  if (item.canWait) blocks.cooling.push(`ตั้งเวลารอ ${effectiveCoolingDays} วัน`);
  if (item.canWait && daysLeft > 0) blocks.cooling.push("ยังไม่ผ่านช่วงรอคิด");

  return {
    financial: [...new Set(blocks.financial)],
    decision: [...new Set(blocks.decision)],
    upgrade: [...new Set(blocks.upgrade)],
    cooling: [...new Set(blocks.cooling)],
  };
}

function getRecommendedPurchaseStage(
  item: WishItem,
  profile: FinancialProfile,
  financial: ReturnType<typeof getFinancialGate>,
  readiness: { readyToBuy: boolean },
  recommendation: { label: string },
) {
  const upgradeAnalysis = getUpgradeAnalysis(item);
  const savedEnough = item.savedForItem >= item.price;
  const funBudgetReady = item.price <= getFunBudgetLeft(profile);
  const smallSafeItem = item.price <= 1500 && funBudgetReady && item.paymentPlan !== "debt";
  const lowPriceUseful = isLowPriceUsefulItem(item, profile);
  const meaningfulProblem =
    upgradeAnalysis.hasMeaningfulReason &&
    (item.currentPainLevel >= 3 || item.improvementImpact >= 3 || item.needGate !== "nice" || item.replacementGate === "replace");
  const fomoDriven = item.upgradeReason === "fomo" || item.trendDriven || item.promoOnly;

  if (
    readiness.readyToBuy &&
    financial.status === "safe" &&
    !fomoDriven &&
    (savedEnough || funBudgetReady || smallSafeItem)
  ) {
    return {
      recommended: "buy" as const,
      reason: savedEnough ? "เก็บเงินครบแล้วและผ่านเกณฑ์ซื้อ" : "ผ่านเกณฑ์ซื้อและอยู่ในงบที่ปลอดภัย",
    };
  }

  if (financial.status === "risky" || fomoDriven || upgradeAnalysis.weakOwnedUpgrade || (!lowPriceUseful && item.similarOwned && item.currentPainLevel <= 2)) {
    return {
      recommended: "park" as const,
      reason: financial.status === "risky" ? "การเงินยังเสี่ยงเกินไป" : "ยังรอได้หรือเป็นอัปเกรดที่เหตุผลยังไม่หนักพอ",
    };
  }

  if (meaningfulProblem && item.savedForItem < item.price && (item.monthlySetAside > 0 || recommendation.label === "Save First")) {
    return {
      recommended: "saving" as const,
      reason: "แก้ปัญหาจริง แต่เงินสำหรับชิ้นนี้ยังไม่พร้อมครบ",
    };
  }

  if (meaningfulProblem && (item.alternativeGate !== "compared" || !item.stillWantIt || item.canWait || financial.status === "review" || lowPriceUseful)) {
    return {
      recommended: "research" as const,
      reason: lowPriceUseful ? "ของราคาต่ำและแก้ปัญหาที่เจอทุกวัน แต่ยังควรรอคิดก่อนซื้อ" : "มีปัญหาจริงให้แก้ แต่ยังควรเทียบข้อมูลหรือรอคิดก่อน",
    };
  }

  return {
    recommended: "park" as const,
    reason: "ยังรอได้ ของเดิมยังพอใช้ หรือผลลัพธ์ที่ดีขึ้นยังไม่ชัดพอ",
  };
}

export function scoreItem(item: WishItem, profile: FinancialProfile) {
  const financial = getFinancialGate(item, profile);
  const gateScores = getGateScores(item);
  const regretSignals = getRegretSignals(item, profile, financial);
  const upgradeAnalysis = getUpgradeAnalysis(item);
  const positiveScore =
    gateScores.need * 20 +
    gateScores.usage * 16 +
    item.joy * 12 +
    gateScores.replacement * 13 +
    gateScores.timing * 12 +
    gateScores.alternative * 10 +
    gateScores.evidence * 8 +
    gateScores.productType * 6 +
    financial.score * 17 +
    getUpgradeReasonScore(item) * 3 +
    item.currentPainLevel * 2 +
    item.improvementImpact * 2;

  const similarOwnedPenalty = item.similarOwned ? 14 : 0;
  const recurringBurden = getRecurringBurden(item, profile);
  const regretRisk = regretSignals.score;
  const worthScore = clamp(
    Math.round(
      positiveScore / 5 -
        regretRisk * 0.35 -
        recurringBurden.scorePenalty -
        similarOwnedPenalty -
        (upgradeAnalysis.missingProblemForWeakReason ? 12 : 0) -
        (upgradeAnalysis.lowPainLowImpact && item.replacementGate === "upgrade" ? 8 : 0),
    ),
    0,
    100,
  );
  const recommendation = getBaseRecommendation(item, profile, worthScore, regretRisk, financial, regretSignals);
  const readiness = getReadiness(item, profile, worthScore, regretRisk, recommendation, financial, regretSignals);
  const recommendedStage = getRecommendedPurchaseStage(item, profile, financial, readiness, recommendation);
  const effectiveStage = item.purchaseStageOverride ?? recommendedStage.recommended;
  const blocks = getBlocks(item, profile, financial);
  const priority =
    worthScore -
    regretRisk * 0.35 -
    item.price / 25000 +
    (readiness.readyToBuy ? 18 : 0) +
    (upgradeAnalysis.dailyProblemUpgrade ? 10 : 0) +
    (upgradeAnalysis.highPainOrImpact ? 4 : 0);
  const sortPriority =
    (recommendedStage.recommended === "buy" ? 40 : recommendedStage.recommended === "saving" ? 30 : recommendedStage.recommended === "research" ? 20 : 5) +
    (item.upgradeReason === "broken" ? 20 : item.upgradeReason === "discomfort" ? 18 : item.upgradeReason === "productivity" ? 15 : item.upgradeReason === "qualityOfLife" ? 8 : 0) +
    item.currentPainLevel * 4 +
    item.improvementImpact * 3 +
    (item.usageGate === "daily" ? 10 : 0) +
    (item.price <= getFunBudgetLeft(profile) ? 10 : 0) +
    (item.savedForItem >= item.price ? 10 : 0) +
    (item.evidenceLevel === "problem-proven" ? 10 : item.evidenceLevel === "tried" ? 8 : item.evidenceLevel === "researched" ? 4 : 0) -
    recurringBurden.scorePenalty -
    (recommendation.label === "Too Risky" ? 30 : 0) -
    (item.paymentPlan === "debt" && item.replacementGate === "upgrade" ? 25 : 0) -
    (item.pastUnused ? 20 : 0) -
    (item.evidenceLevel === "feeling" ? 12 : 0) -
    (item.upgradeReason === "fomo" ? 15 : 0) -
    (item.upgradeReason === "wantBetter" ? 10 : 0) -
    (item.similarOwned && item.currentPainLevel <= 2 ? 10 : 0) -
    (item.canWait && item.improvementImpact <= 2 ? 10 : 0);
  const costPerUse = getCostPerUse(item);

  return {
    worthScore,
    regretRisk: Math.round(regretRisk),
    priority,
    sortPriority,
    recommendation: readiness.readyToBuy ? { label: "Ready to Buy", className: "buy" as const } : recommendation,
    readiness,
    financial,
    blocks,
    stage: {
      recommended: recommendedStage.recommended,
      effective: effectiveStage,
      overridden: item.purchaseStageOverride !== null,
      reason: recommendedStage.reason,
    },
    costPerUse,
    upgrade: {
      reasonLabel: upgradeReasonLabels[item.upgradeReason],
      currentProblem: item.currentProblem,
      currentPainLevel: item.currentPainLevel,
      improvementImpact: item.improvementImpact,
    },
    reasons: getReasons(item, profile, financial, regretSignals),
  };
}

export function sortItems(items: WishItem[], profile: FinancialProfile, sortMode: SortMode) {
  return [...items]
    .map((item) => ({ ...item, score: scoreItem(item, profile) }))
    .sort((a, b) => {
      if (sortMode === "worth") return b.score.worthScore - a.score.worthScore || (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt);
      if (sortMode === "regret-low") return a.score.regretRisk - b.score.regretRisk || b.score.sortPriority - a.score.sortPriority;
      if (sortMode === "price-desc") return b.price - a.price;
      if (sortMode === "price-asc") return a.price - b.price;
      if (sortMode === "newest") return (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt);
      if (sortMode === "closest") {
        const stageRank: Record<PurchaseStage, number> = { buy: 4, saving: 3, research: 2, park: 1 };
        return stageRank[b.score.stage.effective] - stageRank[a.score.stage.effective] || b.score.sortPriority - a.score.sortPriority;
      }
      return (
        b.score.sortPriority - a.score.sortPriority ||
        a.score.regretRisk - b.score.regretRisk ||
        a.price - b.price ||
        (b.updatedAt || 0) - (a.updatedAt || 0) ||
        b.createdAt - a.createdAt
      );
    });
}

function normalizeWishItem(raw: unknown, profile = defaultProfile): WishItem | null {
  if (!isRecord(raw)) return null;

  const base = emptyItem();
  const createdAt = isFiniteNumber(raw.createdAt) ? raw.createdAt : Date.now();
  const item: WishItem = {
    id: typeof raw.id === "string" ? raw.id : crypto.randomUUID(),
    name: typeof raw.name === "string" ? raw.name : "",
    price: isFiniteNumber(raw.price) ? raw.price : 0,
    category: isCategory(raw.category) ? raw.category : base.category,
    productType: isProductType(raw.productType) ? raw.productType : base.productType,
    reason: typeof raw.reason === "string" ? raw.reason : "",
    evidenceLevel: isEvidenceLevel(raw.evidenceLevel) ? raw.evidenceLevel : base.evidenceLevel,
    paymentPlan: isPaymentPlan(raw.paymentPlan) ? raw.paymentPlan : base.paymentPlan,
    savedForItem: isFiniteNumber(raw.savedForItem) ? raw.savedForItem : 0,
    monthlySetAside: isFiniteNumber(raw.monthlySetAside) ? raw.monthlySetAside : 0,
    recurringCost: isFiniteNumber(raw.recurringCost) ? Math.max(raw.recurringCost, 0) : base.recurringCost,
    needGate: isNeedGate(raw.needGate) ? raw.needGate : base.needGate,
    usageGate: isUsageGate(raw.usageGate) ? raw.usageGate : base.usageGate,
    replacementGate: isReplacementGate(raw.replacementGate) ? raw.replacementGate : base.replacementGate,
    timingGate: isTimingGate(raw.timingGate) ? raw.timingGate : base.timingGate,
    alternativeGate: isAlternativeGate(raw.alternativeGate) ? raw.alternativeGate : base.alternativeGate,
    joy: isFiniteNumber(raw.joy) ? clamp(raw.joy, 1, 5) : base.joy,
    similarOwned: isBoolean(raw.similarOwned) ? raw.similarOwned : false,
    trendDriven: isBoolean(raw.trendDriven) ? raw.trendDriven : false,
    pastUnused: isBoolean(raw.pastUnused) ? raw.pastUnused : false,
    promoOnly: isBoolean(raw.promoOnly) ? raw.promoOnly : false,
    canWait: isBoolean(raw.canWait) ? raw.canWait : true,
    coolingDays: isFiniteNumber(raw.coolingDays) ? raw.coolingDays : base.coolingDays,
    stillWantIt: isBoolean(raw.stillWantIt) ? raw.stillWantIt : false,
    purchaseStageOverride: null,
    expectedUseYears: isFiniteNumber(raw.expectedUseYears) ? Math.max(raw.expectedUseYears, 1) : base.expectedUseYears,
    currentProblem: typeof raw.currentProblem === "string" ? raw.currentProblem : base.currentProblem,
    upgradeReason: isUpgradeReason(raw.upgradeReason) ? raw.upgradeReason : base.upgradeReason,
    currentPainLevel: isPainOrImpactLevel(raw.currentPainLevel) ? raw.currentPainLevel : base.currentPainLevel,
    improvementImpact: isPainOrImpactLevel(raw.improvementImpact) ? raw.improvementImpact : base.improvementImpact,
    createdAt,
    updatedAt: isFiniteNumber(raw.updatedAt) ? raw.updatedAt : undefined,
  };

  item.purchaseStageOverride = isPurchaseStage(raw.purchaseStageOverride)
    ? raw.purchaseStageOverride
    : isPurchaseStage(raw.purchaseStage)
      ? raw.purchaseStage
      : null;
  return item;
}

export function normalizeFinancialProfile(raw: unknown): FinancialProfile {
  if (!isRecord(raw)) return defaultProfile;

  return {
    emergencyReserve: isFiniteNumber(raw.emergencyReserve) ? raw.emergencyReserve : defaultProfile.emergencyReserve,
    targetEmergencyReserve: isFiniteNumber(raw.targetEmergencyReserve)
      ? raw.targetEmergencyReserve
      : defaultProfile.targetEmergencyReserve,
    monthlyFunBudget: isFiniteNumber(raw.monthlyFunBudget) ? raw.monthlyFunBudget : defaultProfile.monthlyFunBudget,
    funSpentThisMonth: isFiniteNumber(raw.funSpentThisMonth) ? raw.funSpentThisMonth : defaultProfile.funSpentThisMonth,
  };
}

export function normalizeItems(raw: unknown, profile = defaultProfile): WishItem[] {
  if (!Array.isArray(raw)) return demoItems;
  return raw.map((item) => normalizeWishItem(item, profile)).filter((item): item is WishItem => item !== null);
}

function normalizeBackupPayload(raw: unknown): BackupPayload | null {
  if (!isRecord(raw) || raw.version !== 1 || typeof raw.exportedAt !== "string") return null;
  const financialProfile = normalizeFinancialProfile(raw.financialProfile);
  const items = normalizeItems(raw.items, financialProfile);

  return {
    version: 1,
    exportedAt: raw.exportedAt,
    items,
    financialProfile,
  };
}
