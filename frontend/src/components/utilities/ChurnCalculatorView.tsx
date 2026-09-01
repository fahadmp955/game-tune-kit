import React, { useState, useMemo } from 'react';
import { ChurnInputs } from '../../types';
import { calculateChurn } from '../../engine/churnCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

export const ChurnCalculatorView: React.FC<{ initialInputs?: Partial<ChurnInputs>; onInputsChange: (inputs: ChurnInputs) => void }> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<ChurnInputs>({ d1RetentionPercent: initialInputs?.d1RetentionPercent ?? 40, d7RetentionPercent: initialInputs?.d7RetentionPercent ?? 18, d30RetentionPercent: initialInputs?.d30RetentionPercent ?? 8 });
  const updateInput = <K extends keyof ChurnInputs>(key: K, val: ChurnInputs[K]) => { const u = { ...inputs, [key]: val }; setInputs(u); onInputsChange(u); };
  const r = useMemo(() => calculateChurn(inputs), [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">Retention Inputs (%)</h3>
        <SliderInput label="D1 Retention (%)" value={inputs.d1RetentionPercent} min={5} max={80} step={1} unit="%" onChange={(v) => updateInput('d1RetentionPercent', v)} />
        <SliderInput label="D7 Retention (%)" value={inputs.d7RetentionPercent} min={1} max={50} step={1} unit="%" onChange={(v) => updateInput('d7RetentionPercent', v)} />
        <SliderInput label="D30 Retention (%)" value={inputs.d30RetentionPercent} min={0.5} max={30} step={0.5} unit="%" onChange={(v) => updateInput('d30RetentionPercent', v)} />
      </div>
      <div className="lg:col-span-7">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <KpiCard label="D1 Churn Rate" value={`${r.d1Churn}%`} subtext="Players lost by D1" accentColor="text-indigo-600 dark:text-indigo-400" />
          <KpiCard label="D7 Churn Rate" value={`${r.d7Churn}%`} subtext="Players lost by D7" accentColor="text-cyan-600 dark:text-cyan-400" />
          <KpiCard label="D30 Churn Rate" value={`${r.d30Churn}%`} subtext="Players lost by D30" accentColor="text-emerald-600 dark:text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
