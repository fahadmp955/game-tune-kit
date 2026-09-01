import React, { useState, useMemo } from 'react';
import { RewardValueInputs } from '../../types';
import { calculateRewardValue } from '../../engine/rewardValueCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

export const RewardValueCalculatorView: React.FC<{ initialInputs?: Partial<RewardValueInputs>; onInputsChange: (inputs: RewardValueInputs) => void }> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<RewardValueInputs>({ rewardItemGemsValue: initialInputs?.rewardItemGemsValue ?? 50, rewardCount: initialInputs?.rewardCount ?? 7 });
  const updateInput = <K extends keyof RewardValueInputs>(key: K, val: RewardValueInputs[K]) => { const u = { ...inputs, [key]: val }; setInputs(u); onInputsChange(u); };
  const r = useMemo(() => calculateRewardValue(inputs), [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">Reward Parameters</h3>
        <SliderInput label="Reward Unit Economy Value" value={inputs.rewardItemGemsValue} min={5} max={500} step={5} onChange={(v) => updateInput('rewardItemGemsValue', v)} />
        <SliderInput label="Reward Count / Frequency" value={inputs.rewardCount} min={1} max={30} step={1} onChange={(v) => updateInput('rewardCount', v)} />
      </div>
      <div className="lg:col-span-7">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <KpiCard label="Total Economy Value" value={r.totalEconomyValue.toLocaleString()} subtext="Cumulative reward value" accentColor="text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
    </div>
  );
};
