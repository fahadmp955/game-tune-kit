import React, { useState, useMemo } from 'react';
import { PppInputs } from '../../types';
import { calculatePpp } from '../../engine/pppCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

interface PppCalculatorViewProps {
  initialInputs?: Partial<PppInputs>;
  onInputsChange: (inputs: PppInputs) => void;
}

export const PppCalculatorView: React.FC<PppCalculatorViewProps> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<PppInputs>({
    baseUsdPrice: initialInputs?.baseUsdPrice ?? 9.99,
    targetCountryPppMultiplier: initialInputs?.targetCountryPppMultiplier ?? 0.45,
  });

  const updateInput = <K extends keyof PppInputs>(key: K, val: PppInputs[K]) => {
    const updated = { ...inputs, [key]: val };
    setInputs(updated);
    onInputsChange(updated);
  };

  const results = useMemo(() => calculatePpp(inputs), [inputs]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-5 sm:p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">
            Regional Purchasing Power Pricing
          </h3>
          <SliderInput label="Base US Price ($)" value={inputs.baseUsdPrice} min={0.99} max={99.99} step={1.0} unit="$" onChange={(val) => updateInput('baseUsdPrice', val)} />
          <SliderInput label="Target Country PPP Multiplier" value={inputs.targetCountryPppMultiplier} min={0.1} max={1.5} step={0.05} unit="x" onChange={(val) => updateInput('targetCountryPppMultiplier', val)} />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <KpiCard label="Suggested Store Tier Price" value={`$${results.suggestedTierPrice}`} subtext="App store rounded price" accentColor="text-indigo-600 dark:text-indigo-400" badgeText={results.pricingTierCategory} badgeVariant="success" />
            <KpiCard label="Raw PPP Price" value={`$${results.rawRegionalPrice}`} subtext="Unrounded parity price" accentColor="text-cyan-600 dark:text-cyan-400" />
            <KpiCard label="PPP Discount vs US" value={`${results.effectiveDiscountVsUsd}%`} subtext="Relative purchasing discount" accentColor="text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
