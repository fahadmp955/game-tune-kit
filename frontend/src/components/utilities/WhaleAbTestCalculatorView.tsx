import React, { useState, useMemo } from 'react';
import { WhaleAbTestInputs } from '../../types';
import { calculateWhaleAbTest } from '../../engine/whaleAbTestCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

export const WhaleAbTestCalculatorView: React.FC<{ initialInputs?: Partial<WhaleAbTestInputs>; onInputsChange: (inputs: WhaleAbTestInputs) => void }> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<WhaleAbTestInputs>({ sampleSizePerVariant: initialInputs?.sampleSizePerVariant ?? 15000, whaleOutlierCount: initialInputs?.whaleOutlierCount ?? 45, whaleArpuDiffPercent: initialInputs?.whaleArpuDiffPercent ?? 250 });
  const updateInput = <K extends keyof WhaleAbTestInputs>(key: K, val: WhaleAbTestInputs[K]) => { const u = { ...inputs, [key]: val }; setInputs(u); onInputsChange(u); };
  const r = useMemo(() => calculateWhaleAbTest(inputs), [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">A/B Test Outlier Inputs</h3>
        <SliderInput label="Sample Size / Variant" value={inputs.sampleSizePerVariant} min={1000} max={100000} step={1000} onChange={(v) => updateInput('sampleSizePerVariant', v)} />
        <SliderInput label="Whale Outliers Count" value={inputs.whaleOutlierCount} min={1} max={500} step={1} onChange={(v) => updateInput('whaleOutlierCount', v)} />
        <SliderInput label="Whale ARPU Premium (%)" value={inputs.whaleArpuDiffPercent} min={50} max={1000} step={50} unit="%" onChange={(v) => updateInput('whaleArpuDiffPercent', v)} />
      </div>
      <div className="lg:col-span-7">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <KpiCard label="Whale Outlier Frequency" value={`${r.outlierFrequencyPercent}%`} subtext="Outliers in sample" accentColor="text-indigo-600 dark:text-indigo-400" badgeText={r.skewImpactRating} badgeVariant={r.outlierFrequencyPercent >= 1.0 ? 'warning' : 'success'} />
        </div>
      </div>
    </div>
  );
};
