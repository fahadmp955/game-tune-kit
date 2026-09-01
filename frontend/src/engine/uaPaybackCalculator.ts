import { UaPaybackInputs, UaPaybackOutputs } from '../types';

export const calculateUaPayback = (inputs: UaPaybackInputs): UaPaybackOutputs => {
  const { totalAdSpend, d1Revenue, d7Revenue, d30Revenue } = inputs;

  const d1PaybackPercent = totalAdSpend > 0 ? (d1Revenue / totalAdSpend) * 100 : 0;
  const d7PaybackPercent = totalAdSpend > 0 ? (d7Revenue / totalAdSpend) * 100 : 0;
  const d30PaybackPercent = totalAdSpend > 0 ? (d30Revenue / totalAdSpend) * 100 : 0;

  // Linear velocity estimation for days to 100% payback
  const dailyVelocityD30 = d30Revenue / 30;
  const estimatedDaysToPayback = dailyVelocityD30 > 0 ? Math.ceil(totalAdSpend / dailyVelocityD30) : 999;

  return {
    d1PaybackPercent: Number(d1PaybackPercent.toFixed(1)),
    d7PaybackPercent: Number(d7PaybackPercent.toFixed(1)),
    d30PaybackPercent: Number(d30PaybackPercent.toFixed(1)),
    estimatedDaysToPayback,
    paybackPace: d30PaybackPercent >= 100 ? 'Complete' : d30PaybackPercent >= 60 ? 'On Track' : 'Lagging',
  };
};
