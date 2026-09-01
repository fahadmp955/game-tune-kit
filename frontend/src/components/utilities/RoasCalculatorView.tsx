import React, { useState, useMemo } from 'react';
import { RoasInputs } from '../../types';
import { calculateRoas } from '../../engine/roasCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';
import { FaqAccordion } from '../common/FaqAccordion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface RoasCalculatorViewProps {
  initialInputs?: Partial<RoasInputs>;
  onInputsChange: (inputs: RoasInputs) => void;
}

export const RoasCalculatorView: React.FC<RoasCalculatorViewProps> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<RoasInputs>({
    adSpend: initialInputs?.adSpend ?? 5000,
    paidInstalls: initialInputs?.paidInstalls ?? 2500,
    d7Revenue: initialInputs?.d7Revenue ?? 1200,
    d30Revenue: initialInputs?.d30Revenue ?? 3500,
    d90Revenue: initialInputs?.d90Revenue ?? 5800,
    d180Revenue: initialInputs?.d180Revenue ?? 7200,
    organicMultiplier: initialInputs?.organicMultiplier ?? 1.2,
  });

  const updateInput = <K extends keyof RoasInputs>(key: K, val: RoasInputs[K]) => {
    const updated = { ...inputs, [key]: val };
    setInputs(updated);
    onInputsChange(updated);
  };

  const results = useMemo(() => calculateRoas(inputs), [inputs]);

  const faqItems = [
    {
      question: 'How is Return on Ad Spend (ROAS %) calculated?',
      answer: 'ROAS % = (Cumulative Attributed Revenue at Horizon / Total Acquisition Ad Spend) * 100.',
    },
    {
      question: 'What is the Organic Multiplier (K-Factor Spillage)?',
      answer: 'Acquired paid users often generate organic invites and viral installs. An organic multiplier of 1.2 means every 100 paid installs bring 20 additional organic installs for free.',
    },
    {
      question: 'What is the Break-even CPI Ceiling?',
      answer: 'The maximum Cost Per Install (CPI) your campaign can afford while breaking even at D30 given current revenue performance.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Control Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-5 sm:p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">
            Acquisition Campaign Inputs
          </h3>

          <SliderInput
            label="Total Campaign Ad Spend ($)"
            value={inputs.adSpend}
            min={100}
            max={50000}
            step={100}
            unit="$"
            onChange={(val) => updateInput('adSpend', val)}
          />

          <SliderInput
            label="Paid Installs"
            value={inputs.paidInstalls}
            min={50}
            max={20000}
            step={50}
            onChange={(val) => updateInput('paidInstalls', val)}
          />

          <SliderInput
            label="Organic Multiplier (K-Factor)"
            value={inputs.organicMultiplier}
            min={1.0}
            max={2.5}
            step={0.05}
            unit="x"
            onChange={(val) => updateInput('organicMultiplier', val)}
            description="Organic multiplier (e.g. 1.2 = 20% organic spillage)"
          />

          <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase">
              Cohort Revenue Milestones ($)
            </span>
            <SliderInput label="D7 Revenue ($)" value={inputs.d7Revenue} min={0} max={25000} step={50} unit="$" onChange={(val) => updateInput('d7Revenue', val)} />
            <SliderInput label="D30 Revenue ($)" value={inputs.d30Revenue} min={0} max={40000} step={50} unit="$" onChange={(val) => updateInput('d30Revenue', val)} />
            <SliderInput label="D90 Revenue ($)" value={inputs.d90Revenue} min={0} max={60000} step={50} unit="$" onChange={(val) => updateInput('d90Revenue', val)} />
            <SliderInput label="D180 Revenue ($)" value={inputs.d180Revenue} min={0} max={80000} step={50} unit="$" onChange={(val) => updateInput('d180Revenue', val)} />
          </div>
        </div>

        {/* Right Results Grid (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <KpiCard
              label="Effective CPI"
              value={`$${results.cpi}`}
              subtext="Cost Per Paid Install"
              accentColor="text-indigo-600 dark:text-indigo-400"
            />
            <KpiCard
              label="D30 ROAS %"
              value={`${results.d30Roas}%`}
              subtext={`Target spend: $${inputs.adSpend}`}
              accentColor="text-cyan-600 dark:text-cyan-400"
              badgeText={results.d30Roas >= 100 ? 'Profitable' : 'Payback Pending'}
              badgeVariant={results.d30Roas >= 100 ? 'success' : 'warning'}
            />
            <KpiCard
              label="Break-even Horizon"
              value={results.breakEvenHorizon}
              subtext={`Max CPI ceiling: $${results.breakEvenCpiCeiling}`}
              accentColor="text-emerald-600 dark:text-emerald-400"
            />
          </div>

          <div className="glass-panel rounded-2xl p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              ROAS % Horizon Breakdown vs 100% Break-even Threshold
            </h4>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results.chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#818cf8', fontSize: 11 }} unit="%" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="roas" name="ROAS (%)" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <FaqAccordion items={faqItems} />
    </div>
  );
};
