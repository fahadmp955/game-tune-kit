import { SourceSinkInputs, SourceSinkOutputs } from '../types';

export const calculateSourceSink = (inputs: SourceSinkInputs): SourceSinkOutputs => {
  const { dailySources, dailySinks } = inputs;
  const netBalance = dailySources - dailySinks;
  const ratio = dailySinks > 0 ? Number((dailySources / dailySinks).toFixed(2)) : 0;
  const balanceState = netBalance > 0 ? 'Surplus (Accumulating)' : netBalance < 0 ? 'Deficit (Draining)' : 'Perfect Equilibrium';

  return { netBalance, ratio, balanceState };
};
