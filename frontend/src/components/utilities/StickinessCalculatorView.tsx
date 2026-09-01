import React, { useState, useMemo } from 'react';
import { StickinessInputs } from '../../types';
import { calculateStickiness } from '../../engine/stickinessCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';
import { FaqAccordion } from '../common/FaqAccordion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface StickinessCalculatorViewProps {
  initialInputs?: Partial<StickinessInputs>;
  onInputsChange: (inputs: StickinessInputs) => void;
}

export const StickinessCalculatorView: React.FC<StickinessCalculatorViewProps> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<StickinessInputs>({
    dau: initialInputs?.dau ?? 25000,
    wau: initialInputs?.wau ?? 75000,
    mau: initialInputs?.mau ?? 150000,
    d1Churn: initialInputs?.d1Churn ?? 60,
  });

  const updateInput = <K extends keyof StickinessInputs>(key: K, val: StickinessInputs[K]) => {
    const updated = { ...inputs, [key]: val };
    setInputs(updated);
    onInputsChange(updated);
  };

  const results = useMemo(() => calculateStickiness(inputs), [inputs]);

  const faqItems = [
    {
      question: 'What is the DAU / MAU Stickiness Ratio?',
      answer: 'DAU / MAU ratio measures what percentage of your monthly active player base logs in on any given day. A ratio above 20% is considered strong engagement for mobile games.',
    },
    {
      question: 'How is Monthly Active Churn estimated?',
      answer: 'Estimated monthly active player decay based on compounding daily retention rates over a 30-day window.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-5 sm:p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">
            Active User Base Inputs
          </h3>

          <SliderInput label="Daily Active Users (DAU)" value={inputs.dau} min={100} max={500000} step={500} onChange={(val) => updateInput('dau', val)} />
          <SliderInput label="Weekly Active Users (WAU)" value={inputs.wau} min={500} max={1500000} step={1000} onChange={(val) => updateInput('wau', val)} />
          <SliderInput label="Monthly Active Users (MAU)" value={inputs.mau} min={1000} max={3000000} step={2500} onChange={(val) => updateInput('mau', val)} />
          <SliderInput label="Daily Churn Rate (D1 Churn %)" value={inputs.d1Churn} min={10} max={90} unit="%" onChange={(val) => updateInput('d1Churn', val)} />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <KpiCard
              label="DAU / MAU Ratio"
              value={`${results.dauMauRatio}%`}
              subtext="Daily active stickiness"
              accentColor="text-indigo-600 dark:text-indigo-400"
              badgeText={results.engagementTier}
              badgeVariant={results.dauMauRatio >= 18 ? 'success' : 'warning'}
            />
            <KpiCard
              label="WAU / MAU Ratio"
              value={`${results.wauMauRatio}%`}
              subtext="Weekly active coverage"
              accentColor="text-cyan-600 dark:text-cyan-400"
            />
            <KpiCard
              label="Proj. Monthly Churn"
              value={`${results.monthlyActiveChurn}%`}
              subtext="30-day active loss"
              accentColor="text-violet-600 dark:text-violet-400"
            />
          </div>

          <div className="glass-panel rounded-2xl p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              30-Day Active Cohort Decay Projection
            </h4>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={results.retentionCurve} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#818cf8', fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="activeUsers" stroke="#818cf8" fill="#6366f1" fillOpacity={0.25} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <FaqAccordion items={faqItems} />
    </div>
  );
};
