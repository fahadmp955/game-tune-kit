import React, { useState, useMemo } from 'react';
import { EnergySystemInputs } from '../../types';
import { calculateEnergySystem } from '../../engine/energySystemCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

export const EnergySystemCalculatorView: React.FC<{ initialInputs?: Partial<EnergySystemInputs>; onInputsChange: (inputs: EnergySystemInputs) => void }> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<EnergySystemInputs>({ maxEnergyCap: initialInputs?.maxEnergyCap ?? 120, regenMinutesPerUnit: initialInputs?.regenMinutesPerUnit ?? 5, energyPerSession: initialInputs?.energyPerSession ?? 10 });
  const updateInput = <K extends keyof EnergySystemInputs>(key: K, val: EnergySystemInputs[K]) => { const u = { ...inputs, [key]: val }; setInputs(u); onInputsChange(u); };
  const r = useMemo(() => calculateEnergySystem(inputs), [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">Energy Timer Parameters</h3>
        <SliderInput label="Max Energy Cap" value={inputs.maxEnergyCap} min={20} max={300} step={10} onChange={(v) => updateInput('maxEnergyCap', v)} />
        <SliderInput label="Regen Speed (Minutes / 1 Unit)" value={inputs.regenMinutesPerUnit} min={1} max={30} step={1} onChange={(v) => updateInput('regenMinutesPerUnit', v)} />
        <SliderInput label="Energy Cost per Play Session" value={inputs.energyPerSession} min={1} max={50} step={1} onChange={(v) => updateInput('energyPerSession', v)} />
      </div>
      <div className="lg:col-span-7">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <KpiCard label="Full Regen Time" value={`${r.fullRegenHours} hours`} subtext={`Total ${r.totalMinutesToFullRegen} minutes`} accentColor="text-indigo-600 dark:text-indigo-400" />
          <KpiCard label="Max Sessions / Full Cap" value={`${r.maxSessionsPerFullCap} sessions`} subtext="Play sessions before refill" accentColor="text-emerald-600 dark:text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
