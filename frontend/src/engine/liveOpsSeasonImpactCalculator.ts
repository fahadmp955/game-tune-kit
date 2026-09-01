import { LiveOpsSeasonImpactInputs, LiveOpsSeasonImpactOutputs } from '../types';

export const calculateLiveOpsSeasonImpact = (inputs: LiveOpsSeasonImpactInputs): LiveOpsSeasonImpactOutputs => {
  const { baselineMonthlyRevenue, seasonUpliftPercent, seasonDurationWeeks } = inputs;
  const weeklyBaseline = baselineMonthlyRevenue / 4;
  const seasonWeeklyRevenue = weeklyBaseline * (1 + seasonUpliftPercent / 100);
  const incrementalSeasonRevenueUsd = Number(((seasonWeeklyRevenue - weeklyBaseline) * seasonDurationWeeks).toFixed(2));

  return { incrementalSeasonRevenueUsd, totalSeasonRevenueUsd: Number((seasonWeeklyRevenue * seasonDurationWeeks).toFixed(2)) };
};
