import React, { useState, useMemo } from 'react';
import { SubscriptionFunnelInputs } from '../../types';
import { calculateSubscriptionFunnel } from '../../engine/subscriptionFunnelCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

export const SubscriptionFunnelCalculatorView: React.FC<{ initialInputs?: Partial<SubscriptionFunnelInputs>; onInputsChange: (inputs: SubscriptionFunnelInputs) => void }> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<SubscriptionFunnelInputs>({ monthlySubscriptionPrice: initialInputs?.monthlySubscriptionPrice ?? 4.99, trialToPaidConversionPercent: initialInputs?.trialToPaidConversionPercent ?? 45, monthlyChurnPercent: initialInputs?.monthlyChurnPercent ?? 12 });
  const updateInput = <K extends keyof SubscriptionFunnelInputs>(key: K, val: SubscriptionFunnelInputs[K]) => { const u = { ...inputs, [key]: val }; setInputs(u); onInputsChange(u); };
  const r = useMemo(() => calculateSubscriptionFunnel(inputs), [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">Subscription Funnel Inputs</h3>
        <SliderInput label="Monthly Subscription Price ($)" value={inputs.monthlySubscriptionPrice} min={0.99} max={29.99} step={1.0} unit="$" onChange={(v) => updateInput('monthlySubscriptionPrice', v)} />
        <SliderInput label="Trial-to-Paid Conversion (%)" value={inputs.trialToPaidConversionPercent} min={5} max={90} step={5} unit="%" onChange={(v) => updateInput('trialToPaidConversionPercent', v)} />
        <SliderInput label="Monthly Subscriber Churn (%)" value={inputs.monthlyChurnPercent} min={2} max={40} step={1} unit="%" onChange={(v) => updateInput('monthlyChurnPercent', v)} />
      </div>
      <div className="lg:col-span-7">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <KpiCard label="Subscriber LTV ($)" value={`$${r.subscriberLtv}`} subtext="Expected lifetime revenue per trial" accentColor="text-indigo-600 dark:text-indigo-400" badgeText="Subscription" badgeVariant="success" />
          <KpiCard label="Average Subscriber Lifespan" value={`${r.subscriberActiveMonths} months`} subtext="Active renewal months" accentColor="text-cyan-600 dark:text-cyan-400" />
        </div>
      </div>
    </div>
  );
};
