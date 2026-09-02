import { LtvInputs } from '../types';

export interface CampaignImpactInputs {
  targetReach: number;
  openRatePct: number;       // e.g. 8.5 (%)
  conversionRatePct: number; // e.g. 4.8 (%)
  offerPrice: number;        // e.g. 4.99 ($)
}

export interface CampaignImpactResults {
  estimatedOpens: number;
  estimatedConversions: number;
  projectedGrossRevenue: number;
  projectedRevenuePerRecipient: number;
  estimatedD7UpliftPct: number;
}

/**
 * Calculates projected reach, conversions, gross revenue, and retention uplift
 * for a push notification campaign dispatched to a specific cohort.
 */
export function calculateCampaignImpact(inputs: CampaignImpactInputs): CampaignImpactResults {
  const reach = Math.max(0, inputs.targetReach || 0);
  const openRate = Math.min(100, Math.max(0, inputs.openRatePct || 0)) / 100;
  const convRate = Math.min(100, Math.max(0, inputs.conversionRatePct || 0)) / 100;
  const price = Math.max(0, inputs.offerPrice || 0);

  const estimatedOpens = Math.round(reach * openRate);
  const estimatedConversions = Math.round(estimatedOpens * convRate);
  const projectedGrossRevenue = Number((estimatedConversions * price).toFixed(2));
  const projectedRevenuePerRecipient = reach > 0 ? Number((projectedGrossRevenue / reach).toFixed(4)) : 0;

  // Retention uplift estimation: each successful re-engagement push increases D7 retention baseline
  // calibrated to mobile benchmarks (typically +0.5% to +3.5% based on open engagement)
  const openShare = reach > 0 ? estimatedOpens / reach : 0;
  const estimatedD7UpliftPct = Number((openShare * 3.2).toFixed(2));

  return {
    estimatedOpens,
    estimatedConversions,
    projectedGrossRevenue,
    projectedRevenuePerRecipient,
    estimatedD7UpliftPct,
  };
}

/**
 * Maps a PNS cohort segment definition to calibrated baseline LTV assumptions
 * for immediate ingestion into the LTV Calculator.
 */
export function mapCohortToLtvAssumptions(cohortName: string, reach: number): Partial<LtvInputs> & { cohortReach: number } {
  const lower = (cohortName || '').toLowerCase();

  if (lower.includes('whale') || lower.includes('vip')) {
    return {
      d1Retention: 45,
      d7Retention: 28,
      d30Retention: 16,
      dailyArpu: 0.85,
      horizonDays: 180,
      cohortReach: reach || 2450,
    };
  }

  if (lower.includes('lapsed') || lower.includes('inactive')) {
    return {
      d1Retention: 18,
      d7Retention: 6,
      d30Retention: 2,
      dailyArpu: 0.05,
      horizonDays: 90,
      cohortReach: reach || 6890,
    };
  }

  if (lower.includes('minnow') || lower.includes('non-payer')) {
    return {
      d1Retention: 42,
      d7Retention: 18,
      d30Retention: 7,
      dailyArpu: 0.08,
      horizonDays: 180,
      cohortReach: reach || 14200,
    };
  }

  if (lower.includes('new install') || lower.includes('onboarding')) {
    return {
      d1Retention: 48,
      d7Retention: 20,
      d30Retention: 8,
      dailyArpu: 0.12,
      horizonDays: 180,
      cohortReach: reach || 9350,
    };
  }

  // Default / All Active Players
  return {
    d1Retention: 40,
    d7Retention: 16,
    d30Retention: 6,
    dailyArpu: 0.15,
    horizonDays: 180,
    cohortReach: reach || 48200,
  };
}
