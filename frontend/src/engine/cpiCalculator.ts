import { CpiInputs, CpiOutputs } from '../types';

export const calculateCpi = (inputs: CpiInputs): CpiOutputs => {
  const { targetD30Ltv, targetMarginPercent, organicKFactor } = inputs;

  const totalEffectiveLtv = targetD30Ltv * Math.max(1.0, organicKFactor);
  const marginFraction = Math.max(0, Math.min(0.9, targetMarginPercent / 100));
  const maxSustainableCpi = totalEffectiveLtv * (1 - marginFraction);
  const profitMarginPerInstall = totalEffectiveLtv - maxSustainableCpi;

  return {
    maxSustainableCpi: Number(maxSustainableCpi.toFixed(2)),
    totalEffectiveLtv: Number(totalEffectiveLtv.toFixed(2)),
    profitMarginPerInstall: Number(profitMarginPerInstall.toFixed(2)),
    bidRecommendationTier: maxSustainableCpi >= 3.0 ? 'Aggressive Scaling' : maxSustainableCpi >= 1.5 ? 'Moderate Bidding' : 'Strict Efficiency',
  };
};
