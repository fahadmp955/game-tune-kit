import { LtvCacInputs, LtvCacOutputs } from '../types';

export const calculateLtvCac = (inputs: LtvCacInputs): LtvCacOutputs => {
  const { ltvValue, cacValue, monthlyBurnRate, cashReserve } = inputs;

  const validCac = Math.max(0.01, cacValue);
  const ltvCacRatio = Number((ltvValue / validCac).toFixed(2));
  const netProfitPerUser = Number((ltvValue - validCac).toFixed(2));

  const validBurn = Math.max(1, monthlyBurnRate);
  const runwayMonths = Number((cashReserve / validBurn).toFixed(1));

  let healthStatus: 'Healthy (3x+)' | 'Viable (1.5x-3x)' | 'Unsustainable (< 1.5x)' = 'Viable (1.5x-3x)';
  if (ltvCacRatio >= 3.0) healthStatus = 'Healthy (3x+)';
  else if (ltvCacRatio < 1.5) healthStatus = 'Unsustainable (< 1.5x)';

  return {
    ltvCacRatio,
    netProfitPerUser,
    runwayMonths,
    healthStatus,
  };
};
