import React, { useState, useMemo } from 'react';
import { SourceSinkInputs } from '../../types';
import { calculateSourceSink } from '../../engine/sourceSinkCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

export const SourceSinkCalculatorView: React.FC<{ initialInputs?: Partial<SourceSinkInputs>; onInputsChange: (inputs: SourceSinkInputs) => void }> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<SourceSinkInputs>({ dailySources: initialInputs?.dailySources ?? 250000, dailySinks: initialInputs?.dailySinks ?? 200000 });
  const updateInput = <K extends keyof SourceSinkInputs>(key: K, val: SourceSinkInputs[K]) => { const u = { ...inputs, [key]: val }; setInputs(u); onInputsChange(u); };
  const r = useMemo(() => calculateSourceSink(inputs), [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">Daily Flow Parameters</h3>
        <SliderInput label="Daily Economy Sources (Created)" value={inputs.dailySources} min={10000} max={2000000} step={10000} onChange={(v) => updateInput('dailySources', v)} />
        <SliderInput label="Daily Economy Sinks (Burned)" value={inputs.dailySinks} min={10000} max={2000000} step={10000} onChange={(v) => updateInput('dailySinks', v)} />
      </div>
      <div className="lg:col-span-7">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <KpiCard label="Net Daily Balance" value={`${r.netBalance > 0 ? '+' : ''}${r.netBalance.toLocaleString()}`} subtext="Sources minus Sinks" accentColor="text-indigo-600 dark:text-indigo-400" badgeText={r.balanceState} badgeVariant={r.netBalance >= 0 ? 'success' : 'warning'} />
          <KpiCard label="Source / Sink Ratio" value={`${r.ratio}x`} subtext="Source creation velocity" accentColor="text-cyan-600 dark:text-cyan-400" />
        </div>
      </div>
    </div>
  );
};
