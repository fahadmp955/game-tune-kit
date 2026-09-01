import React, { useState, useMemo } from 'react';
import { XpCurveInputs } from '../../types';
import { calculateXpCurve } from '../../engine/xpCurveCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

export const XpCurveCalculatorView: React.FC<{ initialInputs?: Partial<XpCurveInputs>; onInputsChange: (inputs: XpCurveInputs) => void }> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<XpCurveInputs>({ maxLevel: initialInputs?.maxLevel ?? 50, baseLevelXp: initialInputs?.baseLevelXp ?? 100, exponentMultiplier: initialInputs?.exponentMultiplier ?? 1.5 });
  const updateInput = <K extends keyof XpCurveInputs>(key: K, val: XpCurveInputs[K]) => { const u = { ...inputs, [key]: val }; setInputs(u); onInputsChange(u); };
  const r = useMemo(() => calculateXpCurve(inputs), [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">Leveling Curve Inputs</h3>
        <SliderInput label="Max Level Cap" value={inputs.maxLevel} min={10} max={100} step={5} onChange={(v) => updateInput('maxLevel', v)} />
        <SliderInput label="Base Level 1 XP" value={inputs.baseLevelXp} min={10} max={1000} step={10} onChange={(v) => updateInput('baseLevelXp', v)} />
        <SliderInput label="Exponent Multiplier" value={inputs.exponentMultiplier} min={1.0} max={2.5} step={0.1} onChange={(v) => updateInput('exponentMultiplier', v)} />
      </div>
      <div className="lg:col-span-7">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <KpiCard label="Max Level Cap" value={r.maxLevel} subtext="Progression cap" accentColor="text-indigo-600 dark:text-indigo-400" />
          <KpiCard label="Total Cumulative XP" value={r.totalCumulativeXp.toLocaleString()} subtext="XP to max level" accentColor="text-emerald-600 dark:text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
