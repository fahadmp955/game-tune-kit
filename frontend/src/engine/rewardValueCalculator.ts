import { RewardValueInputs, RewardValueOutputs } from '../types';

export const calculateRewardValue = (inputs: RewardValueInputs): RewardValueOutputs => {
  const { rewardItemGemsValue, rewardCount } = inputs;
  const totalEconomyValue = Number((rewardItemGemsValue * rewardCount).toFixed(2));
  return { totalEconomyValue };
};
