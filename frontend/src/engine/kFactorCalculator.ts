import { KFactorInputs, KFactorOutputs } from '../types';

export const calculateKFactor = (inputs: KFactorInputs): KFactorOutputs => {
  const { paidInstalls, organicSpillageInstalls } = inputs;
  const validPaid = Math.max(1, paidInstalls);
  const kFactor = Number((organicSpillageInstalls / validPaid).toFixed(2));
  const totalEffectiveInstalls = paidInstalls + organicSpillageInstalls;
  const effectiveCpiDiscountPercent = Number(((1 - 1 / (1 + kFactor)) * 100).toFixed(1));

  return { kFactor, totalEffectiveInstalls, effectiveCpiDiscountPercent };
};
