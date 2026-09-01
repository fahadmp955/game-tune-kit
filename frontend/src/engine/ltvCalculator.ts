import { LtvInputs, LtvOutputs, LtvDataPoint } from '../types';

/**
 * Fits observed retention checkpoints (D1, D7, D30) to Power-Law decay curve: R(t) = a * t^(-b)
 * Calculates cumulative LTV over specified horizon: LTV(T) = Cumulative Retention(T) * Daily ARPU
 */
export const calculateLtv = (inputs: LtvInputs): LtvOutputs => {
  const { d1Retention, d7Retention, d30Retention, dailyArpu, horizonDays } = inputs;

  // Convert percentages to fractions (0 to 1)
  const r1 = Math.max(0.001, d1Retention / 100);
  const r7 = Math.max(0.0005, d7Retention / 100);
  const r30 = Math.max(0.0001, d30Retention / 100);

  // Points for log-log regression: (ln(t), ln(R(t)))
  const points = [
    { x: Math.log(1), y: Math.log(r1) },
    { x: Math.log(7), y: Math.log(r7) },
    { x: Math.log(30), y: Math.log(r30) },
  ];

  // Simple linear regression on log-transformed data: y = ln(a) - b * x
  const n = points.length;
  const sumX = points.reduce((acc, p) => acc + p.x, 0);
  const sumY = points.reduce((acc, p) => acc + p.y, 0);
  const sumXY = points.reduce((acc, p) => acc + p.x * p.y, 0);
  const sumXX = points.reduce((acc, p) => acc + p.x * p.x, 0);

  const denom = n * sumXX - sumX * sumX;
  const slope = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : -0.5;
  const intercept = (sumY - slope * sumX) / n;

  // b is -slope (decay coefficient), a is exp(intercept)
  const decayCoeffB = Math.max(0.01, -slope);
  const coeffA = Math.exp(intercept);

  // Compute daily retention array and cumulative retention sum
  const maxDay = Math.max(30, horizonDays);
  const chartData: LtvDataPoint[] = [];

  let cumulativeRetentionSum = 0;

  for (let day = 1; day <= maxDay; day++) {
    // R(t) = min(1.0, a * t^(-b))
    let ret = coeffA * Math.pow(day, -decayCoeffB);
    if (day === 1) ret = Math.min(1.0, Math.max(ret, r1));
    ret = Math.min(1.0, Math.max(0.0001, ret));

    cumulativeRetentionSum += ret;
    const cumulativeLtv = cumulativeRetentionSum * dailyArpu;

    chartData.push({
      day,
      retention: Number((ret * 100).toFixed(2)),
      cumulativeLtv: Number(cumulativeLtv.toFixed(3)),
    });
  }

  const horizonDataPoint = chartData.find((p) => p.day === horizonDays) || chartData[chartData.length - 1];
  const estimatedLtv = horizonDataPoint ? horizonDataPoint.cumulativeLtv : 0;
  const activeLifespanDays = Number(cumulativeRetentionSum.toFixed(1));

  // D365 survival
  const d365Ret = Math.min(1.0, coeffA * Math.pow(365, -decayCoeffB));
  const d365Survival = Number((d365Ret * 100).toFixed(2));

  // Health Rating
  let healthRating: 'Excellent' | 'Healthy' | 'Needs Work' | 'Critical' = 'Healthy';
  if (d1Retention >= 40 && d7Retention >= 18) {
    healthRating = 'Excellent';
  } else if (d1Retention >= 30 && d7Retention >= 12) {
    healthRating = 'Healthy';
  } else if (d1Retention >= 20) {
    healthRating = 'Needs Work';
  } else {
    healthRating = 'Critical';
  }

  return {
    decayCoeffB: Number(decayCoeffB.toFixed(3)),
    coeffA: Number(coeffA.toFixed(3)),
    estimatedLtv: Number(estimatedLtv.toFixed(2)),
    activeLifespanDays,
    d365Survival,
    chartData,
    healthRating,
  };
};
