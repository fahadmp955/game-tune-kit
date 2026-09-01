import React, { useState, useMemo } from 'react';
import { AdYieldOptimizerInputs } from '../../types';
import { calculateAdYieldOptimizer } from '../../engine/adYieldOptimizerCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

export const AdYieldOptimizerCalculatorView: React.FC<{ initialInputs?: Partial<AdYieldOptimizerInputs>; onInputsChange: (inputs: AdYieldOptimizerInputs) => void }> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<AdYieldOptimizerInputs>({ currentEcpm: initialInputs?.currentEcpm ?? 12.0, optimizedEcpm: initialInputs?.optimizedEcpm ?? 16.5, dailyImpressions: initialInputs?.dailyImpressions ?? 150000 });
  const updateInput = <K extends keyof AdYieldOptimizerInputs>(key: K, val: AdYieldOptimizerInputs[K]) => { const u = { ...inputs, [key]: val }; setInputs(u); onInputsChange(u); };
  const r = useMemo(() => calculateAdYieldOptimizer(inputs), [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">eCPM Optimization Inputs</h3>
        <SliderInput label="Baseline eCPM ($)" value={inputs.currentEcpm} min={1.0} max={50.0} step={0.5} unit="$" onChange={(v) => updateInput('currentEcpm', v)} />
        <SliderInput label="Optimized eCPM Target ($)" value={inputs.optimizedEcpm} min={1.0} max={60.0} step={0.5} unit="$" onChange={(v) => updateInput('optimizedEcpm', v)} />
        <SliderInput label="Daily Ad Impressions" value={inputs.dailyImpressions} min={10000} max={2000000} step={10000} onChange={(v) => updateInput('dailyImpressions', v)} />
      </div>
      <div className="lg:col-span-7">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <KpiCard label="Daily Revenue Uplift" value={`+$${r.dailyUpliftUsd}`} subtext="Additional daily ad revenue" accentColor="text-indigo-600 dark:text-indigo-400" badgeText="Ad Yield" badgeVariant="success" />
          <KpiCard label="Current Daily Yield" value={`$${r.currentDailyYield}`} subtext="Baseline ad revenue" accentColor="text-cyan-600 dark:text-cyan-400" />
          <KpiCard label="Optimized Daily Yield" value={`$${r.optimizedDailyYield}`} subtext="Target ad revenue" accentColor="text-emerald-600 dark:text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
