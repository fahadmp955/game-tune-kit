import { AttDilutionInputs, AttDilutionOutputs } from '../types';

export const calculateAttDilution = (inputs: AttDilutionInputs): AttDilutionOutputs => {
  const { attOptInRatePercent, unattributedUaSpendPercent } = inputs;
  const signalDilutionPercent = 100 - attOptInRatePercent;
  const estimatedUaEfficiencyLossPercent = Number(((signalDilutionPercent * 0.4) + (unattributedUaSpendPercent * 0.3)).toFixed(1));

  return { signalDilutionPercent, estimatedUaEfficiencyLossPercent };
};
