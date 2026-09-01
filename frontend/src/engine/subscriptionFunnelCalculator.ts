import { SubscriptionFunnelInputs, SubscriptionFunnelOutputs } from '../types';

export const calculateSubscriptionFunnel = (inputs: SubscriptionFunnelInputs): SubscriptionFunnelOutputs => {
  const { monthlySubscriptionPrice, trialToPaidConversionPercent, monthlyChurnPercent } = inputs;
  const validChurn = Math.max(0.01, monthlyChurnPercent / 100);
  const subscriberActiveMonths = Number((1 / validChurn).toFixed(1));
  const subscriberLtv = Number((subscriberActiveMonths * monthlySubscriptionPrice * (trialToPaidConversionPercent / 100)).toFixed(2));

  return { subscriberLtv, subscriberActiveMonths };
};
