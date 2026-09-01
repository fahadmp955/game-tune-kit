import React, { useState, useMemo } from 'react';
import { PackValueInputs } from '../../types';
import { calculatePackValue } from '../../engine/packValueCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

interface PackValueCalculatorViewProps {
  initialInputs?: Partial<PackValueInputs>;
  onInputsChange: (inputs: PackValueInputs) => void;
}

export const PackValueCalculatorView: React.FC<PackValueCalculatorViewProps> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<PackValueInputs>({
    packUsdPrice: initialInputs?.packUsdPrice ?? 19.99,
    baseGemsAmount: initialInputs?.baseGemsAmount ?? 1000,
    bonusGemsPercent: initialInputs?.bonusGemsPercent ?? 25,
  });

  const updateInput = <K extends keyof PackValueInputs>(key: K, val: PackValueInputs[K]) => {
    const updated = { ...inputs, [key]: val };
    setInputs(updated);
    onInputsChange(updated);
  };

  const results = useMemo(() => calculatePackValue(inputs), [inputs]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-5 sm:p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">
            IAP Pack Currency Parameters
          </h3>
          <SliderInput label="Pack Retail Price ($)" value={inputs.packUsdPrice} min={0.99} max={99.99} step={1.0} unit="$" onChange={(val) => updateInput('packUsdPrice', val)} />
          <SliderInput label="Base Currency Quantity" value={inputs.baseGemsAmount} min={100} max={10000} step={100} onChange={(val) => updateInput('baseGemsAmount', val)} />
          <SliderInput label="Bonus Currency (%)" value={inputs.bonusGemsPercent} min={0} max={100} step={5} unit="%" onChange={(val) => updateInput('bonusGemsPercent', val)} />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <KpiCard label="Total Currency Received" value={results.totalGems.toLocaleString()} subtext={`Base + ${inputs.bonusGemsPercent}% bonus`} accentColor="text-indigo-600 dark:text-indigo-400" badgeText={results.valueEfficiencyRating} badgeVariant="success" />
            <KpiCard label="Currency / Dollar" value={results.effectiveGemsPerDollar} subtext="Currency yield per $1" accentColor="text-cyan-600 dark:text-cyan-400" />
            <KpiCard label="Cost / Currency Unit" value={`$${results.costPerGemUsd}`} subtext="Unit price in USD" accentColor="text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
