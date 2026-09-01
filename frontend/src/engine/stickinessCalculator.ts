import { StickinessInputs, StickinessOutputs } from '../types';

export const calculateStickiness = (inputs: StickinessInputs): StickinessOutputs => {
  const { dau, wau, mau, d1Churn } = inputs;

  const validMau = Math.max(1, mau);
  const validWau = Math.max(1, wau);

  const dauMauRatio = Number(((dau / validMau) * 100).toFixed(1));
  const wauMauRatio = Number(((wau / validMau) * 100).toFixed(1));
  const dauWauRatio = Number(((dau / validWau) * 100).toFixed(1));

  let engagementTier: 'Hyperactive (World Class)' | 'Strong Engagement' | 'Moderate' | 'Low Stickiness' = 'Moderate';
  if (dauMauRatio >= 25) {
    engagementTier = 'Hyperactive (World Class)';
  } else if (dauMauRatio >= 18) {
    engagementTier = 'Strong Engagement';
  } else if (dauMauRatio >= 10) {
    engagementTier = 'Moderate';
  } else {
    engagementTier = 'Low Stickiness';
  }

  // Monthly active churn approximation
  const dailyRetentionRate = Math.max(0.01, 1 - d1Churn / 100);
  const monthlyActiveChurn = Number(((1 - Math.pow(dailyRetentionRate, 30)) * 100).toFixed(1));

  // Generate 30-day retention curve
  const retentionCurve = [];
  let remainingUsers = dau;
  for (let day = 1; day <= 30; day++) {
    retentionCurve.push({
      day,
      activeUsers: Math.round(remainingUsers),
    });
    remainingUsers = remainingUsers * Math.pow(dailyRetentionRate, 0.5);
  }

  return {
    dauMauRatio,
    wauMauRatio,
    dauWauRatio,
    engagementTier,
    monthlyActiveChurn,
    retentionCurve,
  };
};
