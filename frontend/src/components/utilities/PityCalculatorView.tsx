import React, { useState, useMemo } from 'react';
import { PityInputs } from '../../types';
import { calculatePity } from '../../engine/pityCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

export const PityCalculatorView: React.FC<{ initialInputs?: Partial<PityInputs>; onInputsChange: (inputs: PityInputs) => void }> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<PityInputs>({ baseRatePercent: initialInputs?.baseRatePercent ?? 0.6, softPityPull: initialInputs?.softPityPull ?? 75, hardPityPull: initialInputs?.hardPityPull ?? 90 });
  const updateInput = <K extends keyof PityInputs>(key: K, val: PityInputs[K]) => { const u = { ...inputs, [key]: val }; setInputs(u); onInputsChange(u); };
  const r = useMemo(() => calculatePity(inputs), [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">Pity Rules</h3>
        <SliderInput label="Base Rate (%)" value={inputs.baseRatePercent} min={0.1} max={10.0} step={0.1} unit="%" onChange={(v) => updateInput('baseRatePercent', v)} />
        <SliderInput label="Soft Pity Pull Threshold" value={inputs.softPityPull} min={10} max={100} step={1} onChange={(v) => updateInput('softPityPull', v)} />
        <SliderInput label="Hard Pity Guaranteed Pull" value={inputs.hardPityPull} min={20} max={120} step={1} onChange={(v) => updateInput('hardPityPull', v)} />
      </div>
      <div className="lg:col-span-7">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <KpiCard label="Expected Pulls (With Pity)" value={`${r.expectedPullsWithPity} pulls`} subtext="Average pulls needed" accentColor="text-indigo-600 dark:text-indigo-400" badgeText="Guaranteed Cap" badgeVariant="success" />
          <KpiCard label="Hard Pity Cap" value={`${r.hardPityCap} pulls`} subtext="Guaranteed item drop" accentColor="text-cyan-600 dark:text-cyan-400" />
          <KpiCard label="Blended Effective Rate" value={`${r.effectiveRate}%`} subtext="Effective drop rate" accentColor="text-emerald-600 dark:text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
