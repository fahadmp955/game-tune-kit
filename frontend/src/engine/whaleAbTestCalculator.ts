import { WhaleAbTestInputs, WhaleAbTestOutputs } from '../types';

export const calculateWhaleAbTest = (inputs: WhaleAbTestInputs): WhaleAbTestOutputs => {
  const { sampleSizePerVariant, whaleOutlierCount } = inputs;
  const outlierFrequencyPercent = Number(((whaleOutlierCount / Math.max(1, sampleSizePerVariant)) * 100).toFixed(2));
  const skewImpactRating = outlierFrequencyPercent >= 1.0 ? 'High Whale Skew (Requires Trimmed Mean)' : 'Low Outlier Skew';

  return { outlierFrequencyPercent, skewImpactRating };
};
