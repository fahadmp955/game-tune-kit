import React, { useState, useMemo } from 'react';
import { CurrencyExchangeInputs } from '../../types';
import { calculateCurrencyExchange } from '../../engine/currencyExchangeCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

interface CurrencyExchangeCalculatorViewProps {
  initialInputs?: Partial<CurrencyExchangeInputs>;
  onInputsChange: (inputs: CurrencyExchangeInputs) => void;
}

export const CurrencyExchangeCalculatorView: React.FC<CurrencyExchangeCalculatorViewProps> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<CurrencyExchangeInputs>({
    realMoneyUsd: initialInputs?.realMoneyUsd ?? 10.0,
    usdToHardRatio: initialInputs?.usdToHardRatio ?? 100,
    hardToSoftRatio: initialInputs?.hardToSoftRatio ?? 50,
  });

  const updateInput = <K extends keyof CurrencyExchangeInputs>(key: K, val: CurrencyExchangeInputs[K]) => {
    const updated = { ...inputs, [key]: val };
    setInputs(updated);
    onInputsChange(updated);
  };

  const results = useMemo(() => calculateCurrencyExchange(inputs), [inputs]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-5 sm:p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">
            Currency Conversion Ratios
          </h3>
          <SliderInput label="USD Amount ($)" value={inputs.realMoneyUsd} min={1.0} max={100.0} step={1.0} unit="$" onChange={(val) => updateInput('realMoneyUsd', val)} />
          <SliderInput label="Hard Currency / $1 USD" value={inputs.usdToHardRatio} min={10} max={1000} step={10} onChange={(val) => updateInput('usdToHardRatio', val)} />
          <SliderInput label="Soft Currency / 1 Hard Currency" value={inputs.hardToSoftRatio} min={5} max={500} step={5} onChange={(val) => updateInput('hardToSoftRatio', val)} />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <KpiCard label="Hard Currency Yield" value={results.hardCurrencyEquivalent.toLocaleString()} subtext={`At $${inputs.realMoneyUsd} USD`} accentColor="text-indigo-600 dark:text-indigo-400" />
            <KpiCard label="Soft Currency Yield" value={results.softCurrencyEquivalent.toLocaleString()} subtext="Full conversion pipeline" accentColor="text-cyan-600 dark:text-cyan-400" />
            <KpiCard label="Soft / USD Rate" value={`${results.softPerUsd.toLocaleString()} soft/$`} subtext="Effective dollar exchange" accentColor="text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
