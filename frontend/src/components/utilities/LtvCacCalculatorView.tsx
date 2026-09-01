import React, { useState, useMemo } from 'react';
import { LtvCacInputs } from '../../types';
import { calculateLtvCac } from '../../engine/ltvCacCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

interface LtvCacCalculatorViewProps {
  initialInputs?: Partial<LtvCacInputs>;
  onInputsChange: (inputs: LtvCacInputs) => void;
}

export const LtvCacCalculatorView: React.FC<LtvCacCalculatorViewProps> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<LtvCacInputs>({
    ltvValue: initialInputs?.ltvValue ?? 4.50,
    cacValue: initialInputs?.cacValue ?? 1.50,
    monthlyBurnRate: initialInputs?.monthlyBurnRate ?? 25000,
    cashReserve: initialInputs?.cashReserve ?? 150000,
  });

  const updateInput = <K extends keyof LtvCacInputs>(key: K, val: LtvCacInputs[K]) => {
    const updated = { ...inputs, [key]: val };
    setInputs(updated);
    onInputsChange(updated);
  };

  const results = useMemo(() => calculateLtvCac(inputs), [inputs]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-5 sm:p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">
            Unit Economics & Cash Reserves
          </h3>
          <SliderInput label="Player LTV ($)" value={inputs.ltvValue} min={0.5} max={50.0} step={0.5} unit="$" onChange={(val) => updateInput('ltvValue', val)} />
          <SliderInput label="Customer Acquisition Cost (CAC $)" value={inputs.cacValue} min={0.2} max={25.0} step={0.2} unit="$" onChange={(val) => updateInput('cacValue', val)} />
          <SliderInput label="Monthly Studio Burn ($)" value={inputs.monthlyBurnRate} min={5000} max={200000} step={5000} unit="$" onChange={(val) => updateInput('monthlyBurnRate', val)} />
          <SliderInput label="Cash Reserve Balance ($)" value={inputs.cashReserve} min={10000} max={1000000} step={10000} unit="$" onChange={(val) => updateInput('cashReserve', val)} />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <KpiCard label="LTV / CAC Ratio" value={`${results.ltvCacRatio}x`} subtext="Target: 3.0x+" accentColor="text-indigo-600 dark:text-indigo-400" badgeText={results.healthStatus} badgeVariant={results.ltvCacRatio >= 3.0 ? 'success' : 'warning'} />
            <KpiCard label="Net Profit / User" value={`$${results.netProfitPerUser}`} subtext="Unit profit margin" accentColor="text-emerald-600 dark:text-emerald-400" />
            <KpiCard label="Studio Cash Runway" value={`${results.runwayMonths} months`} subtext="Time to zero cash" accentColor="text-cyan-600 dark:text-cyan-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
