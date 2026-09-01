import { SoftLaunchScorecardInputs, SoftLaunchScorecardOutputs } from '../types';

export const calculateSoftLaunchScorecard = (inputs: SoftLaunchScorecardInputs): SoftLaunchScorecardOutputs => {
  const { d1Retention, d7Retention, d30Arpu, cpi } = inputs;
  
  let score = 0;
  if (d1Retention >= 40) score += 30; else if (d1Retention >= 30) score += 20; else score += 10;
  if (d7Retention >= 15) score += 30; else if (d7Retention >= 10) score += 20; else score += 10;
  if (d30Arpu >= cpi) score += 40; else if (d30Arpu >= cpi * 0.7) score += 25; else score += 10;

  let readinessRating: 'Global Launch Ready' | 'Promising — Needs Tuning' | 'Soft Launch Extended' = 'Promising — Needs Tuning';
  if (score >= 85) readinessRating = 'Global Launch Ready';
  else if (score < 50) readinessRating = 'Soft Launch Extended';

  return { overallScore: score, readinessRating };
};
