import { OfferInputs, OfferOutputs } from '../types';

export const calculateOffer = (inputs: OfferInputs): OfferOutputs => {
  const { primaryItemPrice, bonusItemsValue, hardCurrencyBonusValue, offerPackagePrice } = inputs;

  const totalAnchorValue = primaryItemPrice + bonusItemsValue + hardCurrencyBonusValue;
  const packagePrice = Math.max(0.01, offerPackagePrice);

  const savingsAmount = Math.max(0, totalAnchorValue - packagePrice);
  const effectiveDiscountPercent = totalAnchorValue > 0 ? (savingsAmount / totalAnchorValue) * 100 : 0;
  const valueMultiplier = totalAnchorValue > 0 ? totalAnchorValue / packagePrice : 1.0;

  let positioningRating: 'Steep Discount' | 'Great Value (3x+)' | 'Fair Offer' | 'Overpriced' = 'Fair Offer';
  if (valueMultiplier >= 4.0) {
    positioningRating = 'Steep Discount';
  } else if (valueMultiplier >= 2.5) {
    positioningRating = 'Great Value (3x+)';
  } else if (valueMultiplier >= 1.2) {
    positioningRating = 'Fair Offer';
  } else {
    positioningRating = 'Overpriced';
  }

  return {
    totalAnchorValue: Number(totalAnchorValue.toFixed(2)),
    effectiveDiscountPercent: Number(effectiveDiscountPercent.toFixed(1)),
    valueMultiplier: Number(valueMultiplier.toFixed(2)),
    savingsAmount: Number(savingsAmount.toFixed(2)),
    positioningRating,
  };
};
