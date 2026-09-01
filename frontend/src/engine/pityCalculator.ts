import { PityInputs, PityOutputs } from '../types';

export const calculatePity = (inputs: PityInputs): PityOutputs => {
  const { baseRatePercent, softPityPull, hardPityPull } = inputs;
  const p0 = baseRatePercent / 100;
  
  let expectedPulls = 0;
  let probAccumulated = 0;
  
  for (let pull = 1; pull <= hardPityPull; pull++) {
    let currentRate = p0;
    if (pull >= hardPityPull) {
      currentRate = 1.0;
    } else if (pull >= softPityPull) {
      const increment = (1.0 - p0) / Math.max(1, hardPityPull - softPityPull);
      currentRate = p0 + (pull - softPityPull + 1) * increment;
    }
    const probThisPull = (1 - probAccumulated) * currentRate;
    expectedPulls += pull * probThisPull;
    probAccumulated += probThisPull;
  }

  return {
    expectedPullsWithPity: Number(expectedPulls.toFixed(1)),
    hardPityCap: hardPityPull,
    effectiveRate: Number(((1 / Math.max(1, expectedPulls)) * 100).toFixed(2)),
  };
};
