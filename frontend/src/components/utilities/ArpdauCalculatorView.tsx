import React, { useState, useMemo } from 'react';
import { ArpdauInputs } from '../../types';
import { calculateArpdau } from '../../engine/arpdauCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

interface ArpdauCalculatorViewProps {
  initialInputs?: Partial<ArpdauInputs>;
  onInputsChange: (inputs: ArpdauInputs) => void;
}

export const ArpdauCalculatorView: React.FC<ArpdauCalculatorViewProps> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<ArpdauInputs>({
    dau: initialInputs?.dau ?? 50000,
    dailyRevenue: initialInputs?.dailyRevenue ?? 8500,
    payingUsers: initialInputs?.payingUsers ?? 1250,
  });

  const updateInput = <K extends keyof ArpdauInputs>(key: K, val: ArpdauInputs[K]) => {
    const updated = { ...inputs, [key]: val };
    setInputs(updated);
    onInputsChange(updated);
  };

  const results = useMemo(() => calculateArpdau(inputs), [inputs]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-5 sm:p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">
            Monetisation Metrics
          </h3>
          <SliderInput label="Daily Active Users (DAU)" value={inputs.dau} min={1000} max={1000000} step={1000} onChange={(val) => updateInput('dau', val)} />
          <SliderInput label="Daily Total Revenue ($)" value={inputs.dailyRevenue} min={100} max={200000} step={500} unit="$" onChange={(val) => updateInput('dailyRevenue', val)} />
          <SliderInput label="Daily Paying Users" value={inputs.payingUsers} min={10} max={50000} step={50} onChange={(val) => updateInput('payingUsers', val)} />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <KpiCard label="ARPDAU ($)" value={`$${results.arpdau}`} subtext="Average Rev / DAU" accentColor="text-indigo-600 dark:text-indigo-400" badgeText={results.monetisationHealth} badgeVariant="success" />
            <KpiCard label="ARPPU ($)" value={`$${results.arppu}`} subtext="Average Rev / Payer" accentColor="text-cyan-600 dark:text-cyan-400" />
            <KpiCard label="Payer Conversion Rate" value={`${results.payerConversionRate}%`} subtext="Payers / DAU %" accentColor="text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
