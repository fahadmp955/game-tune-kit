import { EnergySystemInputs, EnergySystemOutputs } from '../types';

export const calculateEnergySystem = (inputs: EnergySystemInputs): EnergySystemOutputs => {
  const { maxEnergyCap, regenMinutesPerUnit, energyPerSession } = inputs;
  const totalMinutesToFullRegen = maxEnergyCap * regenMinutesPerUnit;
  const fullRegenHours = Number((totalMinutesToFullRegen / 60).toFixed(1));
  const validCost = Math.max(1, energyPerSession);
  const maxSessionsPerFullCap = Math.floor(maxEnergyCap / validCost);

  return { totalMinutesToFullRegen, fullRegenHours, maxSessionsPerFullCap };
};
