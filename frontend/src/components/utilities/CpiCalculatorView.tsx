import React, { useState, useMemo } from 'react';
import { CpiInputs } from '../../types';
import { calculateCpi } from '../../engine/cpiCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

interface CpiCalculatorViewProps {
  initialInputs?: Partial<CpiInputs>;
  onInputsChange: (inputs: CpiInputs) => void;
}

export const CpiCalculatorView: React.FC<CpiCalculatorViewProps> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<CpiInputs>({
    targetD30Ltv: initialInputs?.targetD30Ltv ?? 2.50,
    targetMarginPercent: initialInputs?.targetMarginPercent ?? 20,
    organicKFactor: initialInputs?.organicKFactor ?? 1.25,
  });

  const updateInput = <K extends keyof CpiInputs>(key: K, val: CpiInputs[K]) => {
    const updated = { ...inputs, [key]: val };
    setInputs(updated);
    onInputsChange(updated);
  };

  const results = useMemo(() => calculateCpi(inputs), [inputs]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-5 sm:p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">
            Bid Cap & Margin Inputs
          </h3>
          <SliderInput label="Target D30 LTV ($)" value={inputs.targetD30Ltv} min={0.1} max={25.0} step={0.1} unit="$" onChange={(val) => updateInput('targetD30Ltv', val)} />
          <SliderInput label="Target Profit Margin (%)" value={inputs.targetMarginPercent} min={0} max={60} step={1} unit="%" onChange={(val) => updateInput('targetMarginPercent', val)} />
          <SliderInput label="Organic Multiplier (K-Factor)" value={inputs.organicKFactor} min={1.0} max={2.5} step={0.05} unit="x" onChange={(val) => updateInput('organicKFactor', val)} />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <KpiCard label="Max Sustainable CPI" value={`$${results.maxSustainableCpi}`} subtext="Target bid ceiling" accentColor="text-indigo-600 dark:text-indigo-400" badgeText={results.bidRecommendationTier} badgeVariant="success" />
            <KpiCard label="Total Effective LTV" value={`$${results.totalEffectiveLtv}`} subtext="Paid + Organic combined" accentColor="text-cyan-600 dark:text-cyan-400" />
            <KpiCard label="Profit Margin / Install" value={`$${results.profitMarginPerInstall}`} subtext={`Target ${inputs.targetMarginPercent}% profit`} accentColor="text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
