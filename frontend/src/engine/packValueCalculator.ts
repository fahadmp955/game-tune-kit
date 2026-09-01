import { PackValueInputs, PackValueOutputs } from '../types';

export const calculatePackValue = (inputs: PackValueInputs): PackValueOutputs => {
  const { packUsdPrice, baseGemsAmount, bonusGemsPercent } = inputs;

  const totalGems = Math.round(baseGemsAmount * (1 + bonusGemsPercent / 100));
  const effectiveGemsPerDollar = packUsdPrice > 0 ? Number((totalGems / packUsdPrice).toFixed(1)) : 0;
  const costPerGemUsd = totalGems > 0 ? Number((packUsdPrice / totalGems).toFixed(4)) : 0;

  return {
    totalGems,
    effectiveGemsPerDollar,
    costPerGemUsd,
    valueEfficiencyRating: bonusGemsPercent >= 50 ? 'Mega Bonus' : bonusGemsPercent >= 20 ? 'Good Value' : 'Standard Pack',
  };
};
