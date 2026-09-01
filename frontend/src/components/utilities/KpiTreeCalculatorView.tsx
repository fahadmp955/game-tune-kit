import React, { useState, useMemo } from 'react';
import { KpiTreeInputs } from '../../types';
import { calculateKpiTree } from '../../engine/kpiTreeCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

export const KpiTreeCalculatorView: React.FC<{ initialInputs?: Partial<KpiTreeInputs>; onInputsChange: (inputs: KpiTreeInputs) => void }> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<KpiTreeInputs>({ dau: initialInputs?.dau ?? 40000, arpdau: initialInputs?.arpdau ?? 0.15, retentionImprovementPercent: initialInputs?.retentionImprovementPercent ?? 10 });
  const updateInput = <K extends keyof KpiTreeInputs>(key: K, val: KpiTreeInputs[K]) => { const u = { ...inputs, [key]: val }; setInputs(u); onInputsChange(u); };
  const r = useMemo(() => calculateKpiTree(inputs), [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">KPI Leverage Inputs</h3>
        <SliderInput label="Daily Active Users (DAU)" value={inputs.dau} min={1000} max={500000} step={1000} onChange={(v) => updateInput('dau', v)} />
        <SliderInput label="ARPDAU ($)" value={inputs.arpdau} min={0.01} max={5.0} step={0.01} unit="$" onChange={(v) => updateInput('arpdau', v)} />
        <SliderInput label="Retention Uplift Target (%)" value={inputs.retentionImprovementPercent} min={1} max={50} step={1} unit="%" onChange={(v) => updateInput('retentionImprovementPercent', v)} />
      </div>
      <div className="lg:col-span-7">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <KpiCard label="Projected Daily Revenue" value={`$${r.projectedDailyRevenue}`} subtext={`+$${r.revenueUpliftUsd} daily uplift`} accentColor="text-indigo-600 dark:text-indigo-400" badgeText="Retention Leverage" badgeVariant="success" />
          <KpiCard label="Current Daily Revenue" value={`$${r.currentDailyRevenue}`} subtext="Baseline revenue" accentColor="text-cyan-600 dark:text-cyan-400" />
        </div>
      </div>
    </div>
  );
};
