import { AdYieldOptimizerInputs, AdYieldOptimizerOutputs } from '../types';

export const calculateAdYieldOptimizer = (inputs: AdYieldOptimizerInputs): AdYieldOptimizerOutputs => {
  const { currentEcpm, optimizedEcpm, dailyImpressions } = inputs;
  const currentDailyYield = Number(((dailyImpressions / 1000) * currentEcpm).toFixed(2));
  const optimizedDailyYield = Number(((dailyImpressions / 1000) * optimizedEcpm).toFixed(2));
  const dailyUpliftUsd = Number((optimizedDailyYield - currentDailyYield).toFixed(2));

  return { currentDailyYield, optimizedDailyYield, dailyUpliftUsd };
};
