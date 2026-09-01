import { LiveOpsCadenceInputs, LiveOpsCadenceOutputs } from '../types';

export const calculateLiveOpsCadence = (inputs: LiveOpsCadenceInputs): LiveOpsCadenceOutputs => {
  const { eventDurationDays, monthlyEventsTarget } = inputs;
  const activeDaysPerMonth = Math.min(30, monthlyEventsTarget * eventDurationDays);
  const totalCooldownDaysMonth = 30 - activeDaysPerMonth;

  return { activeDaysPerMonth, totalCooldownDaysMonth, fatigueRisk: activeDaysPerMonth >= 25 ? 'High Fatigue Risk' : 'Healthy Cadence' };
};
