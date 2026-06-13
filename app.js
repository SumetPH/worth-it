const STORAGE_KEY = "worth-it-items-v1";
const PROFILE_KEY = "worth-it-financial-profile-v1";
const defaultProfile = {
  emergencyReserve: 100000,
  monthlyFunBudget: 8000,
  funSpentThisMonth: 2500
};

const demoItems = [
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
    createdAt: Date.now() - 86400000
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
    createdAt: Date.now() - 3600000
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
    createdAt: Date.now() - 172800000
  }
];

let items = loadItems();
let financialProfile = loadProfile();
let editingId = null;

const form = document.querySelector("#itemForm");
const profileForm = document.querySelector("#profileForm");
const profileStatus = document.querySelector("#profileStatus");
const wishlist = document.querySelector("#wishlist");
const template = document.querySelector("#itemTemplate");
const emptyState = document.querySelector("#emptyState");
const sortMode = document.querySelector("#sortMode");
const resetDemoButton = document.querySelector("#resetDemoButton");
const clearButton = document.querySelector("#clearButton");
const submitButton = document.querySelector("#submitButton");
const cancelEditButton = document.querySelector("#cancelEditButton");

const sliderIds = ["joy"];

sliderIds.forEach((id) => {
  const input = document.querySelector(`#${id}`);
  const output = document.querySelector(`#${id}Out`);
  input.addEventListener("input", () => {
    output.value = input.value;
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const existingItem = items.find((candidate) => candidate.id === editingId);
  const item = {
    id: editingId || crypto.randomUUID(),
    name: String(data.get("name")).trim(),
    price: Number(data.get("price")) || 0,
    category: String(data.get("category")),
    reason: String(data.get("reason")).trim(),
    paymentPlan: String(data.get("paymentPlan")),
    savedForItem: Number(data.get("savedForItem")) || 0,
    monthlySetAside: Number(data.get("monthlySetAside")) || 0,
    needGate: String(data.get("needGate")),
    usageGate: String(data.get("usageGate")),
    replacementGate: String(data.get("replacementGate")),
    timingGate: String(data.get("timingGate")),
    alternativeGate: String(data.get("alternativeGate")),
    joy: Number(data.get("joy")),
    similarOwned: data.has("similarOwned"),
    trendDriven: data.has("trendDriven"),
    pastUnused: data.has("pastUnused"),
    promoOnly: data.has("promoOnly"),
    canWait: data.has("canWait"),
    coolingDays: Number(data.get("coolingDays")) || 30,
    stillWantIt: data.has("stillWantIt"),
    createdAt: existingItem?.createdAt || Date.now(),
    updatedAt: editingId ? Date.now() : undefined
  };

  items = editingId
    ? items.map((candidate) => (candidate.id === editingId ? item : candidate))
    : [item, ...items];
  saveItems();
  resetFormMode();
  render();
});

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(profileForm);
  financialProfile = {
    emergencyReserve: Number(data.get("emergencyReserve")) || 0,
    monthlyFunBudget: Number(data.get("monthlyFunBudget")) || 0,
    funSpentThisMonth: Number(data.get("funSpentThisMonth")) || 0
  };
  saveProfile();
  render();
});

sortMode.addEventListener("change", render);
cancelEditButton.addEventListener("click", resetFormMode);

resetDemoButton.addEventListener("click", () => {
  items = structuredClone(demoItems);
  resetFormMode();
  saveItems();
  render();
});

clearButton.addEventListener("click", () => {
  if (!items.length) return;
  const confirmed = window.confirm("ล้างรายการทั้งหมดใช่ไหม?");
  if (!confirmed) return;
  items = [];
  saveItems();
  render();
});

function loadItems() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : structuredClone(demoItems);
  } catch {
    return structuredClone(demoItems);
  }
}

function loadProfile() {
  try {
    const stored = localStorage.getItem(PROFILE_KEY);
    return stored ? { ...defaultProfile, ...JSON.parse(stored) } : { ...defaultProfile };
  } catch {
    return { ...defaultProfile };
  }
}

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function saveProfile() {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(financialProfile));
}

function scoreItem(item) {
  const normalized = normalizeItem(item);
  const financial = getFinancialGate(normalized, financialProfile);
  const gateScores = getGateScores(normalized);
  const regretSignals = getRegretSignals(normalized);
  const positiveScore =
    gateScores.need * 20 +
    gateScores.usage * 16 +
    Number(normalized.joy) * 12 +
    gateScores.replacement * 13 +
    gateScores.timing * 12 +
    gateScores.alternative * 10 +
    financial.score * 17;

  const regretRisk = clamp(regretSignals.score - gateScores.usage * 4 - gateScores.need * 3, 0, 100);
  const worthScore = clamp(Math.round(positiveScore / 5 - regretRisk * 0.35), 0, 100);
  const baseRecommendation = getBaseRecommendation(normalized, worthScore, regretRisk, financial, regretSignals);
  const readiness = getReadiness(normalized, worthScore, regretRisk, baseRecommendation, financial, regretSignals);
  const priority = worthScore - regretRisk * 0.35 - normalized.price / 25000 + (readiness.readyToBuy ? 18 : 0);
  const reasons = getReasons(normalized, financial, regretSignals);

  return {
    worthScore,
    regretRisk: Math.round(regretRisk),
    priority,
    recommendation: readiness.readyToBuy ? { label: "Ready to Buy", className: "buy" } : baseRecommendation,
    readiness,
    financial,
    reasons
  };
}

function getBaseRecommendation(item, worthScore, regretRisk, financial, regretSignals) {
  if (financial.status === "risky") {
    return { label: "Too Risky", className: "drop" };
  }
  if (financial.status === "save") {
    return { label: "Save First", className: "save" };
  }
  if (financial.status === "review") {
    return { label: "Needs Review", className: "wait" };
  }
  if (item.alternativeGate === "cheaper-good" || item.alternativeGate === "not-compared") {
    return { label: "Compare", className: "compare" };
  }
  if (regretSignals.level === "high") {
    return { label: "Wait 30 Days", className: "wait" };
  }
  if (worthScore >= 74 && regretRisk <= 34 && financial.status === "safe") {
    return { label: "Buy Now", className: "buy" };
  }
  if (worthScore <= 42 || regretRisk >= 70) {
    return { label: "Drop", className: "drop" };
  }
  return { label: item.canWait ? "Wait 30 Days" : "Wait", className: "wait" };
}

function getReadiness(item, worthScore, regretRisk, recommendation, financial, regretSignals) {
  const coolingDays = Number(item.coolingDays) || 30;
  const daysWaited = getDaysWaited(item.createdAt);
  const daysLeft = Math.max(coolingDays - daysWaited, 0);
  const coolingDone = !item.canWait || daysLeft === 0;
  const stillWantConfirmed = !item.canWait || Boolean(item.stillWantIt);
  const gatesReady =
    recommendation.label === "Buy Now" &&
    financial.status === "safe" &&
    regretSignals.level !== "high" &&
    item.alternativeGate === "compared" &&
    (item.needGate !== "nice" || item.usageGate === "daily");
  const readyToBuy = gatesReady && coolingDone && stillWantConfirmed;

  if (readyToBuy) {
    return {
      readyToBuy,
      className: "ready",
      label: "โอเคแล้ว ซื้อได้",
      detail: item.canWait ? `รอครบ ${coolingDays} วัน และยังอยากได้อยู่` : "คะแนนผ่านและไม่จำเป็นต้องรอ"
    };
  }

  if (!gatesReady) {
    return {
      readyToBuy,
      className: "blocked",
      label: "ยังไม่ผ่านเกณฑ์ซื้อ",
      detail: getBlockedReason(item, financial, regretSignals, worthScore, regretRisk)
    };
  }

  if (!coolingDone) {
    return {
      readyToBuy,
      className: "pending",
      label: `รออีก ${daysLeft} วัน`,
      detail: `รอมาแล้ว ${daysWaited}/${coolingDays} วัน ก่อนประเมินซ้ำ`
    };
  }

  return {
    readyToBuy,
    className: "pending",
    label: "รอยืนยันความอยาก",
    detail: "ครบเวลารอแล้ว ถ้ายังอยากได้จริงให้ติ๊กตอนแก้ไขรายการ"
  };
}

function getReasons(item, financial, regretSignals) {
  const reasons = [];
  reasons.push(financial.label);
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
  if (item.canWait) reasons.push(`ตั้งเวลารอ ${Number(item.coolingDays) || 30} วัน`);
  if (item.stillWantIt) reasons.push("รอแล้ว ยังอยากได้อยู่");
  return reasons.slice(0, 5);
}

function render() {
  const scored = items.map((item) => ({ ...item, score: scoreItem(item) }));
  const sorted = sortItems(scored, sortMode.value);

  wishlist.innerHTML = "";
  emptyState.hidden = sorted.length > 0;

  sorted.forEach((item) => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.querySelector("h3").textContent = item.name;
    node.querySelector(".tag").textContent = item.category;
    node.querySelector(".item-reason").textContent = item.reason || "ยังไม่ได้ใส่เหตุผล ลองเพิ่มเหตุผลเพื่อกันการซื้อจากอารมณ์ล้วนๆ";
    node.querySelector(".worth-score").textContent = `${item.score.worthScore}/100`;
    node.querySelector(".regret-risk").textContent = `${item.score.regretRisk}%`;
    node.querySelector(".price").textContent = formatCurrency(item.price);
    node.querySelector(".cost-per-use").textContent = formatCurrency(getCostPerUse(normalizeItem(item)));
    node.querySelector(".saving-plan").textContent = item.score.financial.planSummary;

    const recommendation = node.querySelector(".recommendation");
    recommendation.textContent = item.score.recommendation.label;
    recommendation.classList.add(item.score.recommendation.className);

    const readiness = node.querySelector(".readiness");
    readiness.textContent = `${item.score.readiness.label}: ${item.score.readiness.detail}`;
    readiness.classList.add(item.score.readiness.className);

    const reasonList = node.querySelector(".reason-list");
    item.score.reasons.forEach((reason) => {
      const pill = document.createElement("span");
      pill.className = "reason-pill";
      pill.textContent = reason;
      reasonList.append(pill);
    });

    node.querySelector(".remove-button").addEventListener("click", () => {
      const confirmed = window.confirm(`ลบ "${item.name}" ออกจาก wishlist ใช่ไหม?`);
      if (!confirmed) return;
      items = items.filter((candidate) => candidate.id !== item.id);
      if (editingId === item.id) resetFormMode();
      saveItems();
      render();
    });

    node.querySelector(".edit-button").addEventListener("click", () => {
      startEdit(item.id);
    });

    wishlist.append(node);
  });

  renderSummary(scored);
}

function startEdit(itemId) {
  const item = items.find((candidate) => candidate.id === itemId);
  if (!item) return;

  editingId = item.id;
  form.name.value = item.name;
  form.price.value = item.price;
  form.category.value = item.category;
  form.reason.value = item.reason;
  const normalized = normalizeItem(item);
  form.paymentPlan.value = normalized.paymentPlan;
  form.savedForItem.value = normalized.savedForItem || "";
  form.monthlySetAside.value = normalized.monthlySetAside || "";
  form.needGate.value = normalized.needGate;
  form.usageGate.value = normalized.usageGate;
  form.replacementGate.value = normalized.replacementGate;
  form.timingGate.value = normalized.timingGate;
  form.alternativeGate.value = normalized.alternativeGate;
  sliderIds.forEach((id) => {
    form[id].value = normalized[id];
    document.querySelector(`#${id}Out`).value = normalized[id];
  });
  form.similarOwned.checked = normalized.similarOwned;
  form.trendDriven.checked = normalized.trendDriven;
  form.pastUnused.checked = normalized.pastUnused;
  form.promoOnly.checked = normalized.promoOnly;
  form.canWait.checked = normalized.canWait;
  form.coolingDays.value = normalized.coolingDays || 30;
  form.stillWantIt.checked = Boolean(normalized.stillWantIt);
  submitButton.textContent = "บันทึกการแก้ไข";
  cancelEditButton.hidden = false;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetFormMode() {
  editingId = null;
  form.reset();
  sliderIds.forEach((id) => {
    document.querySelector(`#${id}Out`).value = document.querySelector(`#${id}`).value;
  });
  submitButton.textContent = "เพิ่มเข้ารายการ";
  cancelEditButton.hidden = true;
}

function renderSummary(scored) {
  const totalCost = scored.reduce((sum, item) => sum + item.price, 0);
  const readyCount = scored.filter((item) => item.score.readiness.readyToBuy).length;
  const averageRegret = scored.length
    ? Math.round(scored.reduce((sum, item) => sum + item.score.regretRisk, 0) / scored.length)
    : 0;

  document.querySelector("#totalItems").textContent = String(scored.length);
  document.querySelector("#totalCost").textContent = formatCurrency(totalCost);
  document.querySelector("#readyCount").textContent = String(readyCount);
  document.querySelector("#averageRegret").textContent = `${averageRegret}%`;
  renderProfile();
}

function sortItems(scored, mode) {
  return [...scored].sort((a, b) => {
    if (mode === "price-desc") return b.price - a.price;
    if (mode === "price-asc") return a.price - b.price;
    if (mode === "regret") return b.score.regretRisk - a.score.regretRisk;
    return b.score.priority - a.score.priority;
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0
  }).format(value);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getDaysWaited(createdAt) {
  const createdTime = Number(createdAt) || Date.now();
  return Math.max(Math.floor((Date.now() - createdTime) / 86400000), 0);
}

function normalizeItem(item) {
  const needGate = item.needGate || (Number(item.need) >= 4 ? "essential" : Number(item.need) <= 2 ? "nice" : "useful");
  const usageGate = item.usageGate || (Number(item.usage) >= 5 ? "daily" : Number(item.usage) <= 2 ? "monthly" : "weekly");
  const timingGate = item.timingGate || (Number(item.timing) >= 4 ? "now" : Number(item.timing) <= 2 ? "bad" : "wait");
  const alternativeGate =
    item.alternativeGate ||
    (Number(item.alternatives) >= 4 ? "cheaper-good" : Number(item.alternatives) <= 2 ? "compared" : "not-compared");
  const replacementGate = item.replacementGate || (item.similarOwned ? "duplicate" : "upgrade");
  const financialSafety = Number(item.financialSafety) || 3;

  return {
    ...item,
    price: Number(item.price) || 0,
    joy: Number(item.joy) || 3,
    paymentPlan: item.paymentPlan || (financialSafety <= 2 ? "debt" : "cash"),
    savedForItem: Number(item.savedForItem) || 0,
    monthlySetAside: Number(item.monthlySetAside) || 0,
    needGate,
    usageGate,
    replacementGate,
    timingGate,
    alternativeGate,
    similarOwned: Boolean(item.similarOwned),
    trendDriven: Boolean(item.trendDriven),
    pastUnused: Boolean(item.pastUnused),
    promoOnly: Boolean(item.promoOnly),
    canWait: Boolean(item.canWait),
    coolingDays: Number(item.coolingDays) || 30,
    stillWantIt: Boolean(item.stillWantIt)
  };
}

function getFinancialGate(item, profile) {
  const funBudgetLeft = getFunBudgetLeft(profile);
  const savedForItem = Math.min(item.savedForItem, item.price);
  const remainingToSave = Math.max(item.price - savedForItem, 0);
  const monthsLeft = remainingToSave === 0 ? 0 : item.monthlySetAside > 0 ? Math.ceil(remainingToSave / item.monthlySetAside) : null;

  if (item.paymentPlan === "debt") {
    return {
      status: "risky",
      score: 0,
      label: "การเงินเสี่ยง: ต้องเป็นหนี้หรือแตะเงินลงทุน/เงินสำรอง",
      planLabel: "ห้ามแตะเงินลงทุนและเงินสำรอง",
      planSummary: "Too risky"
    };
  }
  if (profile.monthlyFunBudget <= 0) {
    return {
      status: "review",
      score: 3,
      label: "การเงินต้องเช็ก: ยังไม่ได้ตั้งงบความสุขรายเดือน",
      planLabel: "ตั้ง Financial Profile ก่อน",
      planSummary: "Needs profile"
    };
  }
  if (item.price <= funBudgetLeft) {
    return {
      status: "safe",
      score: 5,
      label: "Monthly Fun ผ่าน: อยู่ในงบความสุขเดือนนี้",
      planLabel: `งบความสุขเหลือ ${formatCurrency(funBudgetLeft - item.price)} หลังซื้อ`,
      planSummary: "Monthly Fun"
    };
  }
  if (remainingToSave === 0) {
    return {
      status: "safe",
      score: 5,
      label: "Planned Want ผ่าน: เก็บเงินครบแล้ว",
      planLabel: "ซื้อได้จากเงินที่ตั้งใจเก็บไว้ ไม่แตะเงินหลัก",
      planSummary: "Saved"
    };
  }
  if (item.monthlySetAside <= 0) {
    return {
      status: "review",
      score: 3,
      label: "ต้องทำแผนเก็บเงิน: ราคาเกินงบความสุขเดือนนี้",
      planLabel: `ยังขาด ${formatCurrency(remainingToSave)}`,
      planSummary: "Needs plan"
    };
  }
  return {
    status: "save",
    score: 2,
    label: "Planned Want: ต้องเก็บเพิ่มก่อนซื้อ",
    planLabel: `ยังขาด ${formatCurrency(remainingToSave)} อีกประมาณ ${monthsLeft} เดือน`,
    planSummary: `${monthsLeft} mo left`
  };
}

function getGateScores(item) {
  return {
    need: { essential: 5, useful: 3, nice: 1 }[item.needGate] || 3,
    usage: { daily: 5, weekly: 3, monthly: 1 }[item.usageGate] || 3,
    replacement: { replace: 5, upgrade: 3, duplicate: 1 }[item.replacementGate] || 3,
    timing: { now: 5, wait: 3, bad: 1 }[item.timingGate] || 3,
    alternative: { compared: 5, "not-compared": 2, "cheaper-good": 1 }[item.alternativeGate] || 2
  };
}

function getRegretSignals(item) {
  const count = [
    item.similarOwned,
    item.trendDriven,
    item.pastUnused,
    item.promoOnly,
    item.replacementGate === "duplicate",
    item.needGate === "nice",
    item.timingGate === "bad",
    item.alternativeGate === "cheaper-good"
  ].filter(Boolean).length;
  return {
    count,
    level: count >= 3 ? "high" : count >= 1 ? "medium" : "low",
    score: count * 16 + (item.canWait ? 8 : 0)
  };
}

function getBlockedReason(item, financial, regretSignals, worthScore, regretRisk) {
  if (financial.status === "risky") return financial.label;
  if (financial.status === "save") return financial.label;
  if (financial.status === "review") return financial.label;
  if (item.alternativeGate === "not-compared") return "ยังไม่ได้เทียบอย่างน้อย 2 ตัวเลือก";
  if (item.alternativeGate === "cheaper-good") return "มีตัวเลือกถูกกว่าที่ตอบโจทย์พอ";
  if (regretSignals.level === "high") return "สัญญาณเสียดายสูงเกินไป";
  if (item.needGate === "nice" && item.usageGate !== "daily") return "ยังเป็นของอยากได้มากกว่าของที่ใช้จริงบ่อย";
  return `คะแนนยังไม่ถึงเกณฑ์: Worth ${worthScore}/100, Regret ${Math.round(regretRisk)}%`;
}

function getCostPerUse(item) {
  const usesPerYear = { daily: 260, weekly: 52, monthly: 12 }[item.usageGate] || 12;
  return Math.round(item.price / usesPerYear);
}

function getFunBudgetLeft(profile) {
  return Math.max(Number(profile.monthlyFunBudget) - Number(profile.funSpentThisMonth), 0);
}

function renderProfile() {
  profileForm.emergencyReserve.value = financialProfile.emergencyReserve || "";
  profileForm.monthlyFunBudget.value = financialProfile.monthlyFunBudget || "";
  profileForm.funSpentThisMonth.value = financialProfile.funSpentThisMonth || "";

  const funLeft = getFunBudgetLeft(financialProfile);
  profileStatus.innerHTML = "";
  [
    `งบความสุขเหลือ ${formatCurrency(funLeft)}`,
    `เงินสำรองขั้นต่ำ ${formatCurrency(financialProfile.emergencyReserve)} ห้ามแตะ`
  ].forEach((text) => {
    const pill = document.createElement("span");
    pill.className = "status-pill";
    pill.textContent = text;
    profileStatus.append(pill);
  });
}

render();
