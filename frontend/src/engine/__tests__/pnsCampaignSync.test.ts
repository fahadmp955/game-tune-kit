import { describe, it, expect } from 'vitest';
import { calculateCampaignImpact, mapCohortToLtvAssumptions } from '../pnsCampaignSync';

describe('PNS Campaign Sync Engine', () => {
  it('calculates campaign open impressions and projected revenue correctly', () => {
    const results = calculateCampaignImpact({
      targetReach: 2450,
      openRatePct: 8.5,
      conversionRatePct: 4.8,
      offerPrice: 4.99,
    });

    // 2450 * 0.085 = 208.25 -> 208 opens
    expect(results.estimatedOpens).toBe(208);
    // 208 * 0.048 = 9.984 -> 10 conversions
    expect(results.estimatedConversions).toBe(10);
    // 10 * 4.99 = 49.90
    expect(results.projectedGrossRevenue).toBe(49.90);
    expect(results.projectedRevenuePerRecipient).toBeGreaterThan(0);
    expect(results.estimatedD7UpliftPct).toBeGreaterThan(0);
  });

  it('handles edge cases (zero reach, 0% rates)', () => {
    const zeroResults = calculateCampaignImpact({
      targetReach: 0,
      openRatePct: 10,
      conversionRatePct: 5,
      offerPrice: 9.99,
    });

    expect(zeroResults.estimatedOpens).toBe(0);
    expect(zeroResults.estimatedConversions).toBe(0);
    expect(zeroResults.projectedGrossRevenue).toBe(0);
    expect(zeroResults.projectedRevenuePerRecipient).toBe(0);
    expect(zeroResults.estimatedD7UpliftPct).toBe(0);
  });

  it('correctly maps whale cohorts to high ARPU and strong retention', () => {
    const assumptions = mapCohortToLtvAssumptions('Whales & High VIPs ($100+)', 2450);
    expect(assumptions.dailyArpu).toBe(0.85);
    expect(assumptions.d30Retention).toBe(16);
    expect(assumptions.cohortReach).toBe(2450);
  });

  it('correctly maps lapsed cohorts to reduced retention decay and lower ARPU', () => {
    const assumptions = mapCohortToLtvAssumptions('Lapsed Players (7+ Days)', 6890);
    expect(assumptions.dailyArpu).toBe(0.05);
    expect(assumptions.d7Retention).toBe(6);
    expect(assumptions.cohortReach).toBe(6890);
  });
});
