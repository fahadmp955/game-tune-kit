import { BattlePassInputs, BattlePassOutputs } from '../types';

export const calculateBattlePass = (inputs: BattlePassInputs): BattlePassOutputs => {
  const { totalTiers, xpPerTier, dailyFreeXp } = inputs;
  const totalXpRequired = totalTiers * xpPerTier;
  const validDailyXp = Math.max(1, dailyFreeXp);
  const daysRequired = Math.ceil(totalXpRequired / validDailyXp);

  return { totalTiers, totalXpRequired, daysRequired };
};
