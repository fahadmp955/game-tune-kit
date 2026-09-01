import { RoasInputs, RoasOutputs } from '../types';

export const calculateRoas = (inputs: RoasInputs): RoasOutputs => {
  const { adSpend, paidInstalls, d7Revenue, d30Revenue, d90Revenue, d180Revenue, organicMultiplier } = inputs;

  const totalEffectiveInstalls = paidInstalls * Math.max(1.0, organicMultiplier);
  const cpi = paidInstalls > 0 ? adSpend / paidInstalls : 0;

  const d7Roas = adSpend > 0 ? (d7Revenue / adSpend) * 100 : 0;
  const d30Roas = adSpend > 0 ? (d30Revenue / adSpend) * 100 : 0;
  const d90Roas = adSpend > 0 ? (d90Revenue / adSpend) * 100 : 0;
  const d180Roas = adSpend > 0 ? (d180Revenue / adSpend) * 100 : 0;

  const d30Arpu = totalEffectiveInstalls > 0 ? d30Revenue / totalEffectiveInstalls : 0;

  // Determine break-even horizon
  let breakEvenHorizon = 'Beyond D180';
  if (d7Roas >= 100) breakEvenHorizon = 'Day 7 (Immediate)';
  else if (d30Roas >= 100) breakEvenHorizon = 'Day 30';
  else if (d90Roas >= 100) breakEvenHorizon = 'Day 90';
  else if (d180Roas >= 100) breakEvenHorizon = 'Day 180';

  // Break-even CPI Ceiling (maximum sustainable CPI for 100% D30 ROAS)
  const breakEvenCpiCeiling = paidInstalls > 0 ? (d30Revenue * Math.max(1.0, organicMultiplier)) / paidInstalls : 0;

  const chartData = [
    { day: 'D7', roas: Number(d7Roas.toFixed(1)), revenue: d7Revenue, spend: adSpend },
    { day: 'D30', roas: Number(d30Roas.toFixed(1)), revenue: d30Revenue, spend: adSpend },
    { day: 'D90', roas: Number(d90Roas.toFixed(1)), revenue: d90Revenue, spend: adSpend },
    { day: 'D180', roas: Number(d180Roas.toFixed(1)), revenue: d180Revenue, spend: adSpend },
  ];

  return {
    cpi: Number(cpi.toFixed(2)),
    d7Roas: Number(d7Roas.toFixed(1)),
    d30Roas: Number(d30Roas.toFixed(1)),
    d90Roas: Number(d90Roas.toFixed(1)),
    d180Roas: Number(d180Roas.toFixed(1)),
    d30Arpu: Number(d30Arpu.toFixed(2)),
    breakEvenHorizon,
    breakEvenCpiCeiling: Number(breakEvenCpiCeiling.toFixed(2)),
    chartData,
  };
};
