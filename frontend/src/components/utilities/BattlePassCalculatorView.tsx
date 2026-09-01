import React, { useState, useMemo } from 'react';
import { BattlePassInputs } from '../../types';
import { calculateBattlePass } from '../../engine/battlePassCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

export const BattlePassCalculatorView: React.FC<{ initialInputs?: Partial<BattlePassInputs>; onInputsChange: (inputs: BattlePassInputs) => void }> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<BattlePassInputs>({ totalTiers: initialInputs?.totalTiers ?? 50, xpPerTier: initialInputs?.xpPerTier ?? 1000, dailyFreeXp: initialInputs?.dailyFreeXp ?? 1500 });
  const updateInput = <K extends keyof BattlePassInputs>(key: K, val: BattlePassInputs[K]) => { const u = { ...inputs, [key]: val }; setInputs(u); onInputsChange(u); };
  const r = useMemo(() => calculateBattlePass(inputs), [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">Battle Pass Structure</h3>
        <SliderInput label="Total Pass Tiers" value={inputs.totalTiers} min={10} max={100} step={5} onChange={(v) => updateInput('totalTiers', v)} />
        <SliderInput label="XP Required per Tier" value={inputs.xpPerTier} min={100} max={5000} step={100} onChange={(v) => updateInput('xpPerTier', v)} />
        <SliderInput label="Average Daily Free XP" value={inputs.dailyFreeXp} min={100} max={5000} step={100} onChange={(v) => updateInput('dailyFreeXp', v)} />
      </div>
      <div className="lg:col-span-7">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <KpiCard label="Days Needed to Complete" value={`${r.daysRequired} days`} subtext="Active daily gameplay" accentColor="text-indigo-600 dark:text-indigo-400" badgeText="Season Pace" badgeVariant="success" />
          <KpiCard label="Total Pass XP" value={r.totalXpRequired.toLocaleString()} subtext="Cumulative XP cap" accentColor="text-cyan-600 dark:text-cyan-400" />
        </div>
      </div>
    </div>
  );
};
