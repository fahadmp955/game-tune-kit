import { MediationLatencyInputs, MediationLatencyOutputs } from '../types';

export const calculateMediationLatency = (inputs: MediationLatencyInputs): MediationLatencyOutputs => {
  const { waterfallLatencyMs, dropOffRatePer100ms, dailyAdRequests, ecpm } = inputs;
  const latencyOverhead100ms = waterfallLatencyMs / 100;
  const totalDropOffPercent = Math.min(60, latencyOverhead100ms * dropOffRatePer100ms);
  const lostImpressions = Math.round(dailyAdRequests * (totalDropOffPercent / 100));
  const dailyYieldLeakageUsd = Number(((lostImpressions / 1000) * ecpm).toFixed(2));

  return { totalDropOffPercent: Number(totalDropOffPercent.toFixed(1)), lostImpressions, dailyYieldLeakageUsd };
};
