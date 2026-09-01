import React, { useState, useMemo } from 'react';
import { EconomyInflationInputs } from '../../types';
import { calculateEconomyInflation } from '../../engine/economyInflationCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

interface EconomyInflationCalculatorViewProps {
  initialInputs?: Partial<EconomyInflationInputs>;
  onInputsChange: (inputs: EconomyInflationInputs) => void;
}

export const EconomyInflationCalculatorView: React.FC<EconomyInflationCalculatorViewProps> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<EconomyInflationInputs>({
    dailyCurrencyGenerated: initialInputs?.dailyCurrencyGenerated ?? 500000,
    dailyCurrencyBurned: initialInputs?.dailyCurrencyBurned ?? 420000,
    currentCirculatingSupply: initialInputs?.currentCirculatingSupply ?? 5000000,
  });

  const updateInput = <K extends keyof EconomyInflationInputs>(key: K, val: EconomyInflationInputs[K]) => {
    const updated = { ...inputs, [key]: val };
    setInputs(updated);
    onInputsChange(updated);
  };

  const results = useMemo(() => calculateEconomyInflation(inputs), [inputs]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-5 sm:p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">
            Source vs Sink Flow Inputs
          </h3>
          <SliderInput label="Daily Source Currency (Created)" value={inputs.dailyCurrencyGenerated} min={10000} max={5000000} step={10000} onChange={(val) => updateInput('dailyCurrencyGenerated', val)} />
          <SliderInput label="Daily Sink Currency (Burned)" value={inputs.dailyCurrencyBurned} min={10000} max={5000000} step={10000} onChange={(val) => updateInput('dailyCurrencyBurned', val)} />
          <SliderInput label="Current Circulating Supply" value={inputs.currentCirculatingSupply} min={100000} max={50000000} step={100000} onChange={(val) => updateInput('currentCirculatingSupply', val)} />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <KpiCard label="Net Daily Delta" value={`${results.netDailyDelta > 0 ? '+' : ''}${results.netDailyDelta.toLocaleString()}`} subtext="Created minus burned" accentColor="text-indigo-600 dark:text-indigo-400" badgeText={results.stateRating} badgeVariant={results.netDailyDelta <= 0 ? 'success' : 'warning'} />
            <KpiCard label="Daily Inflation Rate" value={`${results.netDailyInflationRate}%`} subtext="% of current supply" accentColor="text-cyan-600 dark:text-cyan-400" />
            <KpiCard label="Projected 30D Supply" value={results.projected30DaySupply.toLocaleString()} subtext="Estimated supply in 30 days" accentColor="text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
