import { describe, it, expect } from 'vitest';
import { calculateRoas } from '../roasCalculator';
import { calculateStickiness } from '../stickinessCalculator';
import { calculateLoot } from '../lootCalculator';
import { calculateOffer } from '../offerCalculator';
import { calculateAbTest } from '../abTestCalculator';
import { calculateCpi } from '../cpiCalculator';

describe('GameTuneKit Calculation Engines Suite', () => {
  it('calculates ROAS payback milestones accurately', () => {
    const res = calculateRoas({
      adSpend: 5000,
      paidInstalls: 2500,
      d7Revenue: 1500,
      d30Revenue: 3800,
      d90Revenue: 5200,
      d180Revenue: 6500,
      organicMultiplier: 1.2,
    });
    expect(res.d30Roas).toBeGreaterThan(0);
    expect(res.cpi).toBe(2.0);
    expect(res.breakEvenCpiCeiling).toBeGreaterThan(0);
  });

  it('calculates DAU/MAU stickiness correctly', () => {
    const res = calculateStickiness({
      dau: 25000,
      wau: 75000,
      mau: 100000,
      d1Churn: 60,
    });
    expect(res.dauMauRatio).toBe(25);
    expect(res.engagementTier).toBe('Hyperactive (World Class)');
  });

  it('calculates loot box binomial drop probabilities', () => {
    const res = calculateLoot({
      dropRatePercent: 1.0,
      targetDrops: 1,
      pullCost: 1.5,
      confidenceThreshold: 90,
    });
    expect(res.attemptsForConfidence).toBeGreaterThan(0);
    expect(res.cdfData.length).toBeGreaterThan(0);
  });

  it('evaluates offer bundle anchor discounts', () => {
    const res = calculateOffer({
      primaryItemPrice: 10,
      bonusItemsValue: 15,
      hardCurrencyBonusValue: 10,
      offerPackagePrice: 9.99,
    });
    expect(res.valueMultiplier).toBeGreaterThan(3.0);
    expect(res.effectiveDiscountPercent).toBeGreaterThan(50);
  });

  it('calculates A/B test required sample size', () => {
    const res = calculateAbTest({
      baselineConversionPercent: 5.0,
      mdePercent: 10.0,
      significanceAlpha: 5,
      powerBeta: 80,
      dailyTrafficPerVariant: 2000,
    });
    expect(res.sampleSizePerVariant).toBeGreaterThan(1000);
    expect(res.estimatedRuntimeDays).toBeGreaterThan(0);
  });

  it('calculates break-even CPI bid caps', () => {
    const res = calculateCpi({
      targetD30Ltv: 3.5,
      targetMarginPercent: 20,
      organicKFactor: 1.2,
    });
    expect(res.maxSustainableCpi).toBeGreaterThan(0);
    expect(res.bidRecommendationTier).toBeDefined();
  });
});
