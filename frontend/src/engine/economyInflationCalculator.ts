import { EconomyInflationInputs, EconomyInflationOutputs } from '../types';

export const calculateEconomyInflation = (inputs: EconomyInflationInputs): EconomyInflationOutputs => {
  const { dailyCurrencyGenerated, dailyCurrencyBurned, currentCirculatingSupply } = inputs;

  const netDailyDelta = dailyCurrencyGenerated - dailyCurrencyBurned;
  const netDailyInflationRate = currentCirculatingSupply > 0 ? (netDailyDelta / currentCirculatingSupply) * 100 : 0;
  const projected30DaySupply = Math.max(0, currentCirculatingSupply + netDailyDelta * 30);

  let stateRating: 'Severe Inflation' | 'Mild Inflation' | 'Balanced Economy' | 'Deflationary' = 'Balanced Economy';
  if (netDailyDelta > 0 && netDailyInflationRate > 5.0) stateRating = 'Severe Inflation';
  else if (netDailyDelta > 0) stateRating = 'Mild Inflation';
  else if (netDailyDelta < 0) stateRating = 'Deflationary';

  return {
    netDailyDelta,
    netDailyInflationRate: Number(netDailyInflationRate.toFixed(2)),
    projected30DaySupply,
    stateRating,
  };
};
