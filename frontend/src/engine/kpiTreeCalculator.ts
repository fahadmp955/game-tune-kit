import { KpiTreeInputs, KpiTreeOutputs } from '../types';

export const calculateKpiTree = (inputs: KpiTreeInputs): KpiTreeOutputs => {
  const { dau, arpdau, retentionImprovementPercent } = inputs;
  const currentDailyRevenue = dau * arpdau;
  const projectedDau = dau * (1 + retentionImprovementPercent / 100);
  const projectedDailyRevenue = Number((projectedDau * arpdau).toFixed(2));
  const revenueUpliftUsd = Number((projectedDailyRevenue - currentDailyRevenue).toFixed(2));

  return { currentDailyRevenue: Number(currentDailyRevenue.toFixed(2)), projectedDailyRevenue, revenueUpliftUsd };
};
