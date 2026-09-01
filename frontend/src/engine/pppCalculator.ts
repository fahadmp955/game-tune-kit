import { PppInputs, PppOutputs } from '../types';

export const calculatePpp = (inputs: PppInputs): PppOutputs => {
  const { baseUsdPrice, targetCountryPppMultiplier } = inputs;

  const rawRegionalPrice = baseUsdPrice * targetCountryPppMultiplier;
  
  // Apply standard App Store ending tier rounding (.99)
  const suggestedTierPrice = Number((Math.floor(rawRegionalPrice) + 0.99).toFixed(2));
  const effectiveDiscountVsUsd = Number(((1 - targetCountryPppMultiplier) * 100).toFixed(1));

  return {
    suggestedTierPrice,
    rawRegionalPrice: Number(rawRegionalPrice.toFixed(2)),
    effectiveDiscountVsUsd,
    pricingTierCategory: targetCountryPppMultiplier <= 0.4 ? 'Emerging Market (High Discount)' : targetCountryPppMultiplier <= 0.75 ? 'Mid-Tier Purchasing Power' : 'Tier 1 Standard Price',
  };
};
