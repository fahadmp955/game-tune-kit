import { XpCurveInputs, XpCurveOutputs } from '../types';

export const calculateXpCurve = (inputs: XpCurveInputs): XpCurveOutputs => {
  const { maxLevel, baseLevelXp, exponentMultiplier } = inputs;
  let totalCumulativeXp = 0;
  const curveData = [];

  for (let lvl = 1; lvl <= maxLevel; lvl++) {
    const xpForNextLevel = Math.round(baseLevelXp * Math.pow(lvl, exponentMultiplier));
    totalCumulativeXp += xpForNextLevel;
    curveData.push({ level: lvl, xpRequired: xpForNextLevel, cumulativeXp: totalCumulativeXp });
  }

  return { maxLevel, totalCumulativeXp, curveData };
};
