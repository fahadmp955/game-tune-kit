import React, { useState, useMemo } from 'react';
import { LootInputs } from '../../types';
import { calculateLoot } from '../../engine/lootCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';
import { FaqAccordion } from '../common/FaqAccordion';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface LootCalculatorViewProps {
  initialInputs?: Partial<LootInputs>;
  onInputsChange: (inputs: LootInputs) => void;
}

export const LootCalculatorView: React.FC<LootCalculatorViewProps> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<LootInputs>({
    dropRatePercent: initialInputs?.dropRatePercent ?? 2.5,
    targetDrops: initialInputs?.targetDrops ?? 1,
    pullCost: initialInputs?.pullCost ?? 2.0,
    confidenceThreshold: initialInputs?.confidenceThreshold ?? 90,
  });

  const updateInput = <K extends keyof LootInputs>(key: K, val: LootInputs[K]) => {
    const updated = { ...inputs, [key]: val };
    setInputs(updated);
    onInputsChange(updated);
  };

  const results = useMemo(() => calculateLoot(inputs), [inputs]);

  const faqItems = [
    {
      question: 'How is the Cumulative Probability calculated?',
      answer: 'The probability of obtaining at least 1 item in n independent pulls with base rate p is calculated as P(At least 1) = 1 - (1 - p)^n.',
    },
    {
      question: 'Why is expected pulls for 90% confidence higher than average pulls?',
      answer: 'Due to the non-linear tail of Bernoulli trials, getting a 50% chance requires fewer pulls, but guaranteeing a 90% or 99% probability requires significantly more pulls to cover bad luck outliers.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-5 sm:p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">
            Loot System Parameters
          </h3>

          <SliderInput label="Base Drop Rate (%)" value={inputs.dropRatePercent} min={0.1} max={50} step={0.1} unit="%" onChange={(val) => updateInput('dropRatePercent', val)} />
          <SliderInput label="Target Items Required" value={inputs.targetDrops} min={1} max={10} step={1} onChange={(val) => updateInput('targetDrops', val)} />
          <SliderInput label="Pull Cost ($ or Gems)" value={inputs.pullCost} min={0.1} max={20} step={0.1} unit="$" onChange={(val) => updateInput('pullCost', val)} />
          
          <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-3.5 rounded-xl">
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
              Desired Confidence Threshold
            </label>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[50, 80, 90, 99].map((c) => (
                <button
                  key={c}
                  onClick={() => updateInput('confidenceThreshold', c)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    inputs.confidenceThreshold === c
                      ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-600/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {c}%
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <KpiCard
              label={`Pulls for ${inputs.confidenceThreshold}% Confidence`}
              value={`${results.attemptsForConfidence} pulls`}
              subtext={`Cost: $${(results.attemptsForConfidence * inputs.pullCost).toFixed(2)}`}
              accentColor="text-violet-600 dark:text-violet-400"
              badgeText={`${inputs.confidenceThreshold}% Success`}
              badgeVariant="success"
            />
            <KpiCard
              label="Expected Average Pulls"
              value={`${results.expectedPullsAverage} pulls`}
              subtext="50% mean expectation"
              accentColor="text-indigo-600 dark:text-indigo-400"
            />
            <KpiCard
              label="Expected Average Cost"
              value={`$${results.expectedCostAverage}`}
              subtext="Average currency spend"
              accentColor="text-emerald-600 dark:text-emerald-400"
            />
          </div>

          <div className="glass-panel rounded-2xl p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Cumulative Drop Probability vs Pull Count (CDF Curve)
            </h4>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={results.cdfData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="pulls" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#a855f7', fontSize: 11 }} domain={[0, 100]} unit="%" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="probability" name="Probability (%)" stroke="#a855f7" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <FaqAccordion items={faqItems} />
    </div>
  );
};
