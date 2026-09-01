import React, { useState, useMemo } from 'react';
import { LiveOpsSeasonImpactInputs } from '../../types';
import { calculateLiveOpsSeasonImpact } from '../../engine/liveOpsSeasonImpactCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

export const LiveOpsSeasonImpactCalculatorView: React.FC<{ initialInputs?: Partial<LiveOpsSeasonImpactInputs>; onInputsChange: (inputs: LiveOpsSeasonImpactInputs) => void }> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<LiveOpsSeasonImpactInputs>({ baselineMonthlyRevenue: initialInputs?.baselineMonthlyRevenue ?? 120000, seasonUpliftPercent: initialInputs?.seasonUpliftPercent ?? 35, seasonDurationWeeks: initialInputs?.seasonDurationWeeks ?? 4 });
  const updateInput = <K extends keyof LiveOpsSeasonImpactInputs>(key: K, val: LiveOpsSeasonImpactInputs[K]) => { const u = { ...inputs, [key]: val }; setInputs(u); onInputsChange(u); };
  const r = useMemo(() => calculateLiveOpsSeasonImpact(inputs), [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">Season Campaign Inputs</h3>
        <SliderInput label="Baseline Monthly Revenue ($)" value={inputs.baselineMonthlyRevenue} min={10000} max={1000000} step={10000} unit="$" onChange={(v) => updateInput('baselineMonthlyRevenue', v)} />
        <SliderInput label="Season Revenue Uplift (%)" value={inputs.seasonUpliftPercent} min={5} max={150} step={5} unit="%" onChange={(v) => updateInput('seasonUpliftPercent', v)} />
        <SliderInput label="Season Duration (Weeks)" value={inputs.seasonDurationWeeks} min={1} max={12} step={1} onChange={(v) => updateInput('seasonDurationWeeks', v)} />
      </div>
      <div className="lg:col-span-7">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <KpiCard label="Incremental Season Revenue" value={`+$${r.incrementalSeasonRevenueUsd.toLocaleString()}`} subtext="Net uplift above baseline" accentColor="text-indigo-600 dark:text-indigo-400" badgeText="Season Campaign" badgeVariant="success" />
          <KpiCard label="Total Season Revenue" value={`$${r.totalSeasonRevenueUsd.toLocaleString()}`} subtext={`Across ${inputs.seasonDurationWeeks} weeks`} accentColor="text-cyan-600 dark:text-cyan-400" />
        </div>
      </div>
    </div>
  );
};
