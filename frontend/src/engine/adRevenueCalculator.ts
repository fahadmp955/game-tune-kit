import { AdRevenueInputs, AdRevenueOutputs } from '../types';

export const calculateAdRevenue = (inputs: AdRevenueInputs): AdRevenueOutputs => {
  const { dau, impressionsPerUser, fillRatePercent, ecpmUsd } = inputs;
  const totalImpressionsRequested = dau * impressionsPerUser;
  const filledImpressions = totalImpressionsRequested * (fillRatePercent / 100);
  const dailyAdRevenue = Number(((filledImpressions / 1000) * ecpmUsd).toFixed(2));

  return { dailyAdRevenue, monthlyAdRevenue: Number((dailyAdRevenue * 30).toFixed(2)) };
};
