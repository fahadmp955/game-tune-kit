import { WhaleSpendCeilingInputs, WhaleSpendCeilingOutputs } from '../types';

export const calculateWhaleSpendCeiling = (inputs: WhaleSpendCeilingInputs): WhaleSpendCeilingOutputs => {
  const { progressionMaxSpend, gachaCollectionMaxSpend, monthlyLiveOpsCap } = inputs;
  const annualLiveOpsSpend = monthlyLiveOpsCap * 12;
  const totalSpendCeiling = progressionMaxSpend + gachaCollectionMaxSpend + annualLiveOpsSpend;

  let depthRating: 'Scale Ready' | 'Moderate Depth' | 'Critically Capped' = 'Moderate Depth';
  if (totalSpendCeiling >= 10000) depthRating = 'Scale Ready';
  else if (totalSpendCeiling < 2500) depthRating = 'Critically Capped';

  return { totalSpendCeiling, annualLiveOpsSpend, depthRating };
};
