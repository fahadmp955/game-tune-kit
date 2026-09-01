import { AbTestInputs, AbTestOutputs } from '../types';

export const calculateAbTest = (inputs: AbTestInputs): AbTestOutputs => {
  const { baselineConversionPercent, mdePercent, significanceAlpha, powerBeta, dailyTrafficPerVariant } = inputs;

  const p = Math.max(0.001, Math.min(0.999, baselineConversionPercent / 100));
  const relMde = Math.max(0.01, mdePercent / 100);
  const absoluteMde = p * relMde;

  // Z-scores for significance (alpha=5% => Z_alpha/2 = 1.96) and power (beta=80% => Z_beta = 0.84)
  const zAlpha = significanceAlpha === 1 ? 2.576 : significanceAlpha === 10 ? 1.645 : 1.96;
  const zBeta = powerBeta === 90 ? 1.282 : powerBeta === 95 ? 1.645 : 0.842; // default 80%

  const variance = 2 * p * (1 - p);
  const sampleSizePerVariant = Math.ceil((Math.pow(zAlpha + zBeta, 2) * variance) / Math.pow(absoluteMde, 2));

  const totalRequiredUsers = sampleSizePerVariant * 2;
  const traffic = Math.max(1, dailyTrafficPerVariant);
  const estimatedRuntimeDays = Math.ceil(sampleSizePerVariant / traffic);

  let feasibilityRating: 'Feasible Fast (< 7 days)' | 'Standard Run (7-14 days)' | 'High Traffic Needed (> 30 days)' = 'Standard Run (7-14 days)';
  if (estimatedRuntimeDays <= 7) {
    feasibilityRating = 'Feasible Fast (< 7 days)';
  } else if (estimatedRuntimeDays <= 21) {
    feasibilityRating = 'Standard Run (7-14 days)';
  } else {
    feasibilityRating = 'High Traffic Needed (> 30 days)';
  }

  return {
    sampleSizePerVariant,
    totalRequiredUsers,
    estimatedRuntimeDays,
    absoluteMde: Number((absoluteMde * 100).toFixed(2)),
    feasibilityRating,
  };
};
