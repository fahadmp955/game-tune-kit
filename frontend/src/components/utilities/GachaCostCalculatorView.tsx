import React, { useState, useMemo } from 'react';
import { GachaCostInputs } from '../../types';
import { calculateGachaCost } from '../../engine/gachaCostCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

export const GachaCostCalculatorView: React.FC<{ initialInputs?: Partial<GachaCostInputs>; onInputsChange: (inputs: GachaCostInputs) => void }> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<GachaCostInputs>({ pullsRequired: initialInputs?.pullsRequired ?? 80, gemCostPerPull: initialInputs?.gemCostPerPull ?? 160, usdCostPer1000Gems: initialInputs?.usdCostPer1000Gems ?? 15.0 });
  const updateInput = <K extends keyof GachaCostInputs>(key: K, val: GachaCostInputs[K]) => { const u = { ...inputs, [key]: val }; setInputs(u); onInputsChange(u); };
  const r = useMemo(() => calculateGachaCost(inputs), [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">Gacha Pricing Inputs</h3>
        <SliderInput label="Target Pulls Required" value={inputs.pullsRequired} min={10} max={500} step={5} onChange={(v) => updateInput('pullsRequired', v)} />
        <SliderInput label="Currency Cost / Pull" value={inputs.gemCostPerPull} min={10} max={500} step={5} onChange={(v) => updateInput('gemCostPerPull', v)} />
        <SliderInput label="USD Cost / 1,000 Currency ($)" value={inputs.usdCostPer1000Gems} min={1.0} max={50.0} step={1.0} unit="$" onChange={(v) => updateInput('usdCostPer1000Gems', v)} />
      </div>
      <div className="lg:col-span-7">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <KpiCard label="Total Real-Money Cost" value={`$${r.totalUsdCost}`} subtext="Total USD expenditure" accentColor="text-indigo-600 dark:text-indigo-400" badgeText="Real Money" badgeVariant="warning" />
          <KpiCard label="Total In-Game Currency" value={r.totalGemsNeeded.toLocaleString()} subtext="Required gems/coins" accentColor="text-cyan-600 dark:text-cyan-400" />
        </div>
      </div>
    </div>
  );
};
