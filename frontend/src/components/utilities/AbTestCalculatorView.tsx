import React, { useState, useMemo } from 'react';
import { AbTestInputs } from '../../types';
import { calculateAbTest } from '../../engine/abTestCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';
import { FaqAccordion } from '../common/FaqAccordion';

interface AbTestCalculatorViewProps {
  initialInputs?: Partial<AbTestInputs>;
  onInputsChange: (inputs: AbTestInputs) => void;
}

export const AbTestCalculatorView: React.FC<AbTestCalculatorViewProps> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<AbTestInputs>({
    baselineConversionPercent: initialInputs?.baselineConversionPercent ?? 5.0,
    mdePercent: initialInputs?.mdePercent ?? 10.0,
    significanceAlpha: initialInputs?.significanceAlpha ?? 5,
    powerBeta: initialInputs?.powerBeta ?? 80,
    dailyTrafficPerVariant: initialInputs?.dailyTrafficPerVariant ?? 2000,
  });

  const updateInput = <K extends keyof AbTestInputs>(key: K, val: AbTestInputs[K]) => {
    const updated = { ...inputs, [key]: val };
    setInputs(updated);
    onInputsChange(updated);
  };

  const results = useMemo(() => calculateAbTest(inputs), [inputs]);

  const faqItems = [
    {
      question: 'What is Minimum Detectable Effect (MDE)?',
      answer: 'MDE is the relative percentage uplift you want your experiment to reliably detect. A 10% MDE on a 5.0% baseline conversion means detecting an uplift to 5.5%. Smaller MDEs require exponentially larger sample sizes.',
    },
    {
      question: 'What is Statistical Power (1 - Beta)?',
      answer: 'Statistical power (typically 80%) is the probability that your test detects a real effect if one actually exists.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-5 sm:p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">
            Experiment Parameters
          </h3>

          <SliderInput label="Baseline Metric % (Conversion/Payer Rate)" value={inputs.baselineConversionPercent} min={0.5} max={50} step={0.5} unit="%" onChange={(val) => updateInput('baselineConversionPercent', val)} />
          <SliderInput label="Minimum Detectable Effect (MDE %)" value={inputs.mdePercent} min={1} max={50} step={0.5} unit="%" onChange={(val) => updateInput('mdePercent', val)} />
          <SliderInput label="Daily Traffic per Variant" value={inputs.dailyTrafficPerVariant} min={100} max={50000} step={100} onChange={(val) => updateInput('dailyTrafficPerVariant', val)} />

          <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-3.5 rounded-xl">
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
              Significance Level (Alpha α)
            </label>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {[1, 5, 10].map((a) => (
                <button
                  key={a}
                  onClick={() => updateInput('significanceAlpha', a)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    inputs.significanceAlpha === a
                      ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  α = {a}%
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <KpiCard
              label="Sample Size per Variant"
              value={results.sampleSizePerVariant.toLocaleString()}
              subtext={`Total users: ${results.totalRequiredUsers.toLocaleString()}`}
              accentColor="text-sky-600 dark:text-sky-400"
              badgeText={results.feasibilityRating}
              badgeVariant={results.estimatedRuntimeDays <= 14 ? 'success' : 'warning'}
            />
            <KpiCard
              label="Estimated Runtime"
              value={`${results.estimatedRuntimeDays} days`}
              subtext={`At ${inputs.dailyTrafficPerVariant.toLocaleString()} users/day`}
              accentColor="text-indigo-600 dark:text-indigo-400"
            />
            <KpiCard
              label="Target Uplift (Abs MDE)"
              value={`+${results.absoluteMde}%`}
              subtext={`Target: ${(inputs.baselineConversionPercent + results.absoluteMde).toFixed(2)}%`}
              accentColor="text-emerald-600 dark:text-emerald-400"
            />
          </div>
        </div>
      </div>

      <FaqAccordion items={faqItems} />
    </div>
  );
};
