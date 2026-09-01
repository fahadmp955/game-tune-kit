import { LootInputs, LootOutputs } from '../types';

export const calculateLoot = (inputs: LootInputs): LootOutputs => {
  const { dropRatePercent, targetDrops, pullCost, confidenceThreshold } = inputs;

  const p = Math.max(0.0001, Math.min(0.9999, dropRatePercent / 100));
  const conf = Math.max(0.01, Math.min(0.99, confidenceThreshold / 100));

  // Attempts needed for confidence C: P(at least 1 drop) = 1 - (1 - p)^n >= C => n = ln(1 - C) / ln(1 - p)
  const attemptsForConfidence = Math.ceil(Math.log(1 - conf) / Math.log(1 - p)) * targetDrops;

  // Expected average pulls for target drops: Target / p
  const expectedPullsAverage = Math.round(targetDrops / p);
  const expectedCostAverage = Number((expectedPullsAverage * pullCost).toFixed(2));

  // Generate Cumulative Distribution Function (CDF) up to 3x average pulls
  const maxPulls = Math.min(1000, Math.max(50, expectedPullsAverage * 2.5));
  const step = Math.max(1, Math.floor(maxPulls / 40));

  const cdfData = [];
  for (let pulls = step; pulls <= maxPulls; pulls += step) {
    const probAtLeastOne = 1 - Math.pow(1 - p, pulls);
    cdfData.push({
      pulls,
      probability: Number((probAtLeastOne * 100).toFixed(1)),
    });
  }

  return {
    attemptsForConfidence,
    expectedPullsAverage,
    expectedCostAverage,
    cdfData,
  };
};
