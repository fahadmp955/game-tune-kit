import React, { useState, useMemo } from 'react';
import { RetentionBenchmarkInputs } from '../../types';
import { calculateRetentionBenchmark } from '../../engine/retentionBenchmarkCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

export const RetentionBenchmarkCalculatorView: React.FC<{ initialInputs?: Partial<RetentionBenchmarkInputs>; onInputsChange: (inputs: RetentionBenchmarkInputs) => void }> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<RetentionBenchmarkInputs>({ observedD1: initialInputs?.observedD1 ?? 36, observedD7: initialInputs?.observedD7 ?? 14, genreD1Benchmark: initialInputs?.genreD1Benchmark ?? 35, genreD7Benchmark: initialInputs?.genreD7Benchmark ?? 12 });
  const updateInput = <K extends keyof RetentionBenchmarkInputs>(key: K, val: RetentionBenchmarkInputs[K]) => { const u = { ...inputs, [key]: val }; setInputs(u); onInputsChange(u); };
  const r = useMemo(() => calculateRetentionBenchmark(inputs), [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">Genre Benchmarks</h3>
        <SliderInput label="Observed D1 Retention (%)" value={inputs.observedD1} min={10} max={70} step={1} unit="%" onChange={(v) => updateInput('observedD1', v)} />
        <SliderInput label="Observed D7 Retention (%)" value={inputs.observedD7} min={2} max={40} step={1} unit="%" onChange={(v) => updateInput('observedD7', v)} />
        <SliderInput label="Genre P50 D1 Benchmark (%)" value={inputs.genreD1Benchmark} min={15} max={50} step={1} unit="%" onChange={(v) => updateInput('genreD1Benchmark', v)} />
        <SliderInput label="Genre P50 D7 Benchmark (%)" value={inputs.genreD7Benchmark} min={5} max={25} step={1} unit="%" onChange={(v) => updateInput('genreD7Benchmark', v)} />
      </div>
      <div className="lg:col-span-7">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <KpiCard label="D1 Benchmark Gap" value={`${r.d1Gap > 0 ? '+' : ''}${r.d1Gap}%`} subtext="Difference vs Genre P50" accentColor="text-indigo-600 dark:text-indigo-400" badgeText={r.performanceTier} badgeVariant={r.d1Gap >= 0 ? 'success' : 'warning'} />
          <KpiCard label="D7 Benchmark Gap" value={`${r.d7Gap > 0 ? '+' : ''}${r.d7Gap}%`} subtext="Difference vs Genre P50" accentColor="text-cyan-600 dark:text-cyan-400" />
        </div>
      </div>
    </div>
  );
};
