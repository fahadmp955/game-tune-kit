import React, { useState, useMemo } from 'react';
import { AdVsIapCannibalisationInputs } from '../../types';
import { calculateAdVsIapCannibalisation } from '../../engine/adVsIapCannibalisationCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

export const AdVsIapCannibalisationCalculatorView: React.FC<{ initialInputs?: Partial<AdVsIapCannibalisationInputs>; onInputsChange: (inputs: AdVsIapCannibalisationInputs) => void }> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<AdVsIapCannibalisationInputs>({ adFrequencyPerSession: initialInputs?.adFrequencyPerSession ?? 4.0, baselineIapConversionRate: initialInputs?.baselineIapConversionRate ?? 3.5 });
  const updateInput = <K extends keyof AdVsIapCannibalisationInputs>(key: K, val: AdVsIapCannibalisationInputs[K]) => { const u = { ...inputs, [key]: val }; setInputs(u); onInputsChange(u); };
  const r = useMemo(() => calculateAdVsIapCannibalisation(inputs), [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">Ad Density & IAP Baseline</h3>
        <SliderInput label="Ad Frequency / Session" value={inputs.adFrequencyPerSession} min={1.0} max={15.0} step={0.5} onChange={(v) => updateInput('adFrequencyPerSession', v)} />
        <SliderInput label="Baseline IAP Conversion (%)" value={inputs.baselineIapConversionRate} min={0.5} max={15.0} step={0.5} unit="%" onChange={(v) => updateInput('baselineIapConversionRate', v)} />
      </div>
      <div className="lg:col-span-7">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <KpiCard label="IAP Cannibalisation Impact" value={`-${r.cannibalisationImpactPercent}%`} subtext="IAP conversion drop" accentColor="text-indigo-600 dark:text-indigo-400" badgeText="Ad Friction" badgeVariant="warning" />
          <KpiCard label="Net IAP Conversion Rate" value={`${r.netIapConversionRate}%`} subtext={`Down from ${inputs.baselineIapConversionRate}%`} accentColor="text-cyan-600 dark:text-cyan-400" />
        </div>
      </div>
    </div>
  );
};
