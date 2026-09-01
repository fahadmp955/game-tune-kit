import React, { useState, useMemo } from 'react';
import { UaPaybackInputs } from '../../types';
import { calculateUaPayback } from '../../engine/uaPaybackCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

interface UaPaybackCalculatorViewProps {
  initialInputs?: Partial<UaPaybackInputs>;
  onInputsChange: (inputs: UaPaybackInputs) => void;
}

export const UaPaybackCalculatorView: React.FC<UaPaybackCalculatorViewProps> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<UaPaybackInputs>({
    totalAdSpend: initialInputs?.totalAdSpend ?? 10000,
    d1Revenue: initialInputs?.d1Revenue ?? 800,
    d7Revenue: initialInputs?.d7Revenue ?? 3500,
    d30Revenue: initialInputs?.d30Revenue ?? 7500,
  });

  const updateInput = <K extends keyof UaPaybackInputs>(key: K, val: UaPaybackInputs[K]) => {
    const updated = { ...inputs, [key]: val };
    setInputs(updated);
    onInputsChange(updated);
  };

  const results = useMemo(() => calculateUaPayback(inputs), [inputs]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-5 sm:p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">
            UA Payback Parameters
          </h3>
          <SliderInput label="Total Ad Spend ($)" value={inputs.totalAdSpend} min={500} max={100000} step={500} unit="$" onChange={(val) => updateInput('totalAdSpend', val)} />
          <SliderInput label="Day 1 Revenue ($)" value={inputs.d1Revenue} min={0} max={20000} step={100} unit="$" onChange={(val) => updateInput('d1Revenue', val)} />
          <SliderInput label="Day 7 Revenue ($)" value={inputs.d7Revenue} min={0} max={50000} step={100} unit="$" onChange={(val) => updateInput('d7Revenue', val)} />
          <SliderInput label="Day 30 Revenue ($)" value={inputs.d30Revenue} min={0} max={100000} step={100} unit="$" onChange={(val) => updateInput('d30Revenue', val)} />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <KpiCard label="D30 Payback %" value={`${results.d30PaybackPercent}%`} subtext="30-day ROI progress" accentColor="text-indigo-600 dark:text-indigo-400" badgeText={results.paybackPace} badgeVariant={results.d30PaybackPercent >= 100 ? 'success' : 'warning'} />
            <KpiCard label="Est. Days to Payback" value={`${results.estimatedDaysToPayback} days`} subtext="Time to 100% breakeven" accentColor="text-cyan-600 dark:text-cyan-400" />
            <KpiCard label="D7 Payback %" value={`${results.d7PaybackPercent}%`} subtext="Early traction indicator" accentColor="text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
