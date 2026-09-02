import { describe, it, expect } from 'vitest';
import { calculateLtv } from '../ltvCalculator';

describe('Cohort LTV Calculator Engine', () => {
  it('calculates estimated LTV and power-law retention curve accurately', () => {
    const result = calculateLtv({
      d1Retention: 40,
      d7Retention: 18,
      d30Retention: 8,
      dailyArpu: 0.25,
      horizonDays: 180,
    });

    expect(result.estimatedLtv).toBeGreaterThan(0);
    expect(result.decayCoeffB).toBeGreaterThan(0);
    expect(result.chartData.length).toBe(180);
    expect(result.healthRating).toBe('Excellent');
  });
});
