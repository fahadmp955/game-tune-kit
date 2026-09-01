import React, { useState, useMemo } from 'react';
import { AdRevenueInputs } from '../../types';
import { calculateAdRevenue } from '../../engine/adRevenueCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

export const AdRevenueCalculatorView: React.FC<{ initialInputs?: Partial<AdRevenueInputs>; onInputsChange: (inputs: AdRevenueInputs) => void }> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<AdRevenueInputs>({ dau: initialInputs?.dau ?? 20000, impressionsPerUser: initialInputs?.impressionsPerUser ?? 3.5, fillRatePercent: initialInputs?.fillRatePercent ?? 95, ecpmUsd: initialInputs?.ecpmUsd ?? 12.0 });
  const updateInput = <K extends keyof AdRevenueInputs>(key: K, val: AdRevenueInputs[K]) => { const u = { ...inputs, [key]: val }; setInputs(u); onInputsChange(u); };
  const r = useMemo(() => calculateAdRevenue(inputs), [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">Ad Monetisation Inputs</h3>
        <SliderInput label="Daily Active Users (DAU)" value={inputs.dau} min={1000} max={500000} step={1000} onChange={(v) => updateInput('dau', v)} />
        <SliderInput label="Impressions / User / Day" value={inputs.impressionsPerUser} min={0.5} max={20.0} step={0.5} onChange={(v) => updateInput('impressionsPerUser', v)} />
        <SliderInput label="Fill Rate (%)" value={inputs.fillRatePercent} min={50} max={100} step={1} unit="%" onChange={(v) => updateInput('fillRatePercent', v)} />
        <SliderInput label="Blended eCPM ($)" value={inputs.ecpmUsd} min={1.0} max={50.0} step={0.5} unit="$" onChange={(v) => updateInput('ecpmUsd', v)} />
      </div>
      <div className="lg:col-span-7">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <KpiCard label="Daily Ad Revenue" value={`$${r.dailyAdRevenue}`} subtext="Estimated daily ad yield" accentColor="text-indigo-600 dark:text-indigo-400" badgeText="Ad Monetisation" badgeVariant="success" />
          <KpiCard label="Projected Monthly Ad Revenue" value={`$${r.monthlyAdRevenue.toLocaleString()}`} subtext="30-day ad yield" accentColor="text-emerald-600 dark:text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
