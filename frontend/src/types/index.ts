export type UtilityFamily = 
  | 'pricing-monetisation'
  | 'growth-ua'
  | 'intelligence-metrics'
  | 'economy-simulation'
  | 'liveops'
  | 'data-experimentation';

export interface UtilityMeta {
  id: string; // e.g. "01-ltv-calculator"
  code: string; // e.g. "01"
  name: string;
  family: UtilityFamily;
  description: string;
  isCore: boolean;
  tagText: string;
  tagColor: string;
}

export interface UserPreset {
  id: string;
  utilityId: string;
  name: string;
  createdAt: string;
  inputs: Record<string, any>;
}

// 1. LTV Calculator Engine Input/Output
export interface LtvInputs {
  d1Retention: number; // e.g. 40 (%)
  d7Retention: number; // e.g. 15 (%)
  d30Retention: number; // e.g. 6 (%)
  dailyArpu: number; // e.g. 0.15 ($)
  horizonDays: number; // 30, 90, 180, 365
}

export interface LtvDataPoint {
  day: number;
  retention: number; // %
  cumulativeLtv: number; // $
}

export interface LtvOutputs {
  decayCoeffB: number; // power law b
  coeffA: number; // power law a
  estimatedLtv: number; // $
  activeLifespanDays: number; // days
  d365Survival: number; // %
  chartData: LtvDataPoint[];
  healthRating: 'Excellent' | 'Healthy' | 'Needs Work' | 'Critical';
}

// 2. ROAS Calculator Engine Input/Output
export interface RoasInputs {
  adSpend: number; // e.g. 5000 ($)
  paidInstalls: number; // e.g. 2500
  d7Revenue: number;
  d30Revenue: number;
  d90Revenue: number;
  d180Revenue: number;
  organicMultiplier: number; // e.g. 1.2
}

export interface RoasOutputs {
  cpi: number; // $
  d7Roas: number; // %
  d30Roas: number; // %
  d90Roas: number; // %
  d180Roas: number; // %
  d30Arpu: number; // $
  breakEvenHorizon: string; // e.g. "Day 42" or "Beyond D180"
  breakEvenCpiCeiling: number; // $
  chartData: { day: string; roas: number; revenue: number; spend: number }[];
}

// 32. DAU / MAU Stickiness Calculator Input/Output
export interface StickinessInputs {
  dau: number; // e.g. 25000
  wau: number; // e.g. 75000
  mau: number; // e.g. 150000
  d1Churn: number; // e.g. 60 (%)
}

export interface StickinessOutputs {
  dauMauRatio: number; // %
  wauMauRatio: number; // %
  dauWauRatio: number; // %
  engagementTier: 'Hyperactive (World Class)' | 'Strong Engagement' | 'Moderate' | 'Low Stickiness';
  monthlyActiveChurn: number; // projected monthly churn %
  retentionCurve: { day: number; activeUsers: number }[];
}

// 14. Loot & Drop-Rate Calculator Input/Output
export interface LootInputs {
  dropRatePercent: number; // e.g. 2.5 (%)
  targetDrops: number; // e.g. 1
  pullCost: number; // e.g. 2.00 ($ or gems)
  confidenceThreshold: number; // e.g. 90 (%)
}

export interface LootOutputs {
  attemptsForConfidence: number;
  expectedPullsAverage: number;
  expectedCostAverage: number;
  cdfData: { pulls: number; probability: number }[];
}

// 36. Offer Discount Calculator Input/Output
export interface OfferInputs {
  primaryItemPrice: number; // $
  bonusItemsValue: number; // $
  hardCurrencyBonusValue: number; // $
  offerPackagePrice: number; // $
}

export interface OfferOutputs {
  totalAnchorValue: number; // $
  effectiveDiscountPercent: number; // %
  valueMultiplier: number; // e.g. 3.5x
  savingsAmount: number; // $
  positioningRating: 'Steep Discount' | 'Great Value (3x+)' | 'Fair Offer' | 'Overpriced';
}

// 27. A/B Test Sample Size Calculator Input/Output
export interface AbTestInputs {
  baselineConversionPercent: number; // e.g. 5.0 (%)
  mdePercent: number; // e.g. 10.0 (%) relative change
  significanceAlpha: number; // e.g. 5 (%)
  powerBeta: number; // e.g. 80 (%)
  dailyTrafficPerVariant: number; // e.g. 2000
}

export interface AbTestOutputs {
  sampleSizePerVariant: number;
  totalRequiredUsers: number;
  estimatedRuntimeDays: number;
  absoluteMde: number; // e.g. +0.5%
  feasibilityRating: 'Feasible Fast (< 7 days)' | 'Standard Run (7-14 days)' | 'High Traffic Needed (> 30 days)';
}

// 03. Break-even CPI Calculator Types
export interface CpiInputs {
  targetD30Ltv: number;
  targetMarginPercent: number;
  organicKFactor: number;
}
export interface CpiOutputs {
  maxSustainableCpi: number;
  totalEffectiveLtv: number;
  profitMarginPerInstall: number;
  bidRecommendationTier: string;
}

// 05. LTV to CAC & Cash Runway Types
export interface LtvCacInputs {
  ltvValue: number;
  cacValue: number;
  monthlyBurnRate: number;
  cashReserve: number;
}
export interface LtvCacOutputs {
  ltvCacRatio: number;
  netProfitPerUser: number;
  runwayMonths: number;
  healthStatus: 'Healthy (3x+)' | 'Viable (1.5x-3x)' | 'Unsustainable (< 1.5x)';
}

// 04. UA Payback Economics Types
export interface UaPaybackInputs {
  totalAdSpend: number;
  d1Revenue: number;
  d7Revenue: number;
  d30Revenue: number;
}
export interface UaPaybackOutputs {
  d1PaybackPercent: number;
  d7PaybackPercent: number;
  d30PaybackPercent: number;
  estimatedDaysToPayback: number;
  paybackPace: string;
}

// 07. ARPDAU / ARPPU Types
export interface ArpdauInputs {
  dau: number;
  dailyRevenue: number;
  payingUsers: number;
}
export interface ArpdauOutputs {
  arpdau: number;
  arppu: number;
  payerConversionRate: number;
  monetisationHealth: string;
}

// 08. PPP Regional Price Types
export interface PppInputs {
  baseUsdPrice: number;
  targetCountryPppMultiplier: number;
}
export interface PppOutputs {
  suggestedTierPrice: number;
  rawRegionalPrice: number;
  effectiveDiscountVsUsd: number;
  pricingTierCategory: string;
}

// 09. IAP Pack Value Types
export interface PackValueInputs {
  packUsdPrice: number;
  baseGemsAmount: number;
  bonusGemsPercent: number;
}
export interface PackValueOutputs {
  totalGems: number;
  effectiveGemsPerDollar: number;
  costPerGemUsd: number;
  valueEfficiencyRating: string;
}

// 10. Currency Exchange Types
export interface CurrencyExchangeInputs {
  realMoneyUsd: number;
  usdToHardRatio: number;
  hardToSoftRatio: number;
}
export interface CurrencyExchangeOutputs {
  hardCurrencyEquivalent: number;
  softCurrencyEquivalent: number;
  softPerUsd: number;
}

// 12. Economy Inflation Types
export interface EconomyInflationInputs {
  dailyCurrencyGenerated: number;
  dailyCurrencyBurned: number;
  currentCirculatingSupply: number;
}
export interface EconomyInflationOutputs {
  netDailyDelta: number;
  netDailyInflationRate: number;
  projected30DaySupply: number;
  stateRating: string;
}

// 13. Source / Sink Balance Types
export interface SourceSinkInputs { dailySources: number; dailySinks: number; }
export interface SourceSinkOutputs { netBalance: number; ratio: number; balanceState: string; }

// 15. Pity System Types
export interface PityInputs { baseRatePercent: number; softPityPull: number; hardPityPull: number; }
export interface PityOutputs { expectedPullsWithPity: number; hardPityCap: number; effectiveRate: number; }

// 16. Gacha Cost Types
export interface GachaCostInputs { pullsRequired: number; gemCostPerPull: number; usdCostPer1000Gems: number; }
export interface GachaCostOutputs { totalGemsNeeded: number; totalUsdCost: number; }

// 17. XP Curve Types
export interface XpCurveInputs { maxLevel: number; baseLevelXp: number; exponentMultiplier: number; }
export interface XpCurveOutputs { maxLevel: number; totalCumulativeXp: number; curveData: { level: number; xpRequired: number; cumulativeXp: number }[]; }

// 18. Reward Value Types
export interface RewardValueInputs { rewardItemGemsValue: number; rewardCount: number; }
export interface RewardValueOutputs { totalEconomyValue: number; }

// 20. Battle Pass Types
export interface BattlePassInputs { totalTiers: number; xpPerTier: number; dailyFreeXp: number; }
export interface BattlePassOutputs { totalTiers: number; totalXpRequired: number; daysRequired: number; }

// 21. Energy System Types
export interface EnergySystemInputs { maxEnergyCap: number; regenMinutesPerUnit: number; energyPerSession: number; }
export interface EnergySystemOutputs { totalMinutesToFullRegen: number; fullRegenHours: number; maxSessionsPerFullCap: number; }

// 23. Ad Revenue Types
export interface AdRevenueInputs { dau: number; impressionsPerUser: number; fillRatePercent: number; ecpmUsd: number; }
export interface AdRevenueOutputs { dailyAdRevenue: number; monthlyAdRevenue: number; }


