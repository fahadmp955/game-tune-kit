import React, { useState, useMemo } from 'react';
import { KFactorInputs } from '../../types';
import { calculateKFactor } from '../../engine/kFactorCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

export const KFactorCalculatorView: React.FC<{ initialInputs?: Partial<KFactorInputs>; onInputsChange: (inputs: KFactorInputs) => void }> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<KFactorInputs>({ paidInstalls: initialInputs?.paidInstalls ?? 10000, organicSpillageInstalls: initialInputs?.organicSpillageInstalls ?? 3500 });
  const updateInput = <K extends keyof KFactorInputs>(key: K, val: KFactorInputs[K]) => { const u = { ...inputs, [key]: val }; setInputs(u); onInputsChange(u); };
  const r = useMemo(() => calculateKFactor(inputs), [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">Acquisition Spillage</h3>
        <SliderInput label="Paid User Installs" value={inputs.paidInstalls} min={1000} max={100000} step={1000} onChange={(v) => updateInput('paidInstalls', v)} />
        <SliderInput label="Organic Spillage Installs" value={inputs.organicSpillageInstalls} min={100} max={50000} step={500} onChange={(v) => updateInput('organicSpillageInstalls', v)} />
      </div>
      <div className="lg:col-span-7">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <KpiCard label="K-Factor Multiplier" value={`${r.kFactor}x`} subtext="Organic viral multiplier" accentColor="text-indigo-600 dark:text-indigo-400" badgeText={r.kFactor >= 0.5 ? 'High Organic Spillage' : 'Low Virality'} badgeVariant="success" />
          <KpiCard label="Total Effective Installs" value={r.totalEffectiveInstalls.toLocaleString()} subtext="Paid + Organic combined" accentColor="text-cyan-600 dark:text-cyan-400" />
          <KpiCard label="Effective CPI Discount" value={`${r.effectiveCpiDiscountPercent}%`} subtext="Blended CPI savings" accentColor="text-emerald-600 dark:text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
