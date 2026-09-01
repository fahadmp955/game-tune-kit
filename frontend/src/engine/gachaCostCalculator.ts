import { GachaCostInputs, GachaCostOutputs } from '../types';

export const calculateGachaCost = (inputs: GachaCostInputs): GachaCostOutputs => {
  const { pullsRequired, gemCostPerPull, usdCostPer1000Gems } = inputs;
  const totalGemsNeeded = pullsRequired * gemCostPerPull;
  const totalUsdCost = Number(((totalGemsNeeded / 1000) * usdCostPer1000Gems).toFixed(2));

  return { totalGemsNeeded, totalUsdCost };
};
