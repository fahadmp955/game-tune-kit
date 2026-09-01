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
