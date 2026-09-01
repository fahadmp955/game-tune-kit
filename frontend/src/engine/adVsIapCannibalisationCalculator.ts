import { AdVsIapCannibalisationInputs, AdVsIapCannibalisationOutputs } from '../types';

export const calculateAdVsIapCannibalisation = (inputs: AdVsIapCannibalisationInputs): AdVsIapCannibalisationOutputs => {
  const { adFrequencyPerSession, baselineIapConversionRate } = inputs;
  const cannibalisationImpactPercent = Math.min(50, adFrequencyPerSession * 2.5);
  const netIapConversionRate = Number((baselineIapConversionRate * (1 - cannibalisationImpactPercent / 100)).toFixed(2));

  return { cannibalisationImpactPercent: Number(cannibalisationImpactPercent.toFixed(1)), netIapConversionRate };
};
