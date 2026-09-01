import React, { useState, useMemo } from 'react';
import { WhaleSpendCeilingInputs } from '../../types';
import { calculateWhaleSpendCeiling } from '../../engine/whaleSpendCeilingCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

export const WhaleSpendCeilingCalculatorView: React.FC<{ initialInputs?: Partial<WhaleSpendCeilingInputs>; onInputsChange: (inputs: WhaleSpendCeilingInputs) => void }> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<WhaleSpendCeilingInputs>({ progressionMaxSpend: initialInputs?.progressionMaxSpend ?? 5000, gachaCollectionMaxSpend: initialInputs?.gachaCollectionMaxSpend ?? 3500, monthlyLiveOpsCap: initialInputs?.monthlyLiveOpsCap ?? 500 });
  const updateInput = <K extends keyof WhaleSpendCeilingInputs>(key: K, val: WhaleSpendCeilingInputs[K]) => { const u = { ...inputs, [key]: val }; setInputs(u); onInputsChange(u); };
  const r = useMemo(() => calculateWhaleSpendCeiling(inputs), [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">Structural Sink Caps ($)</h3>
        <SliderInput label="Progression Content Max Spend ($)" value={inputs.progressionMaxSpend} min={500} max={25000} step={500} unit="$" onChange={(v) => updateInput('progressionMaxSpend', v)} />
        <SliderInput label="Gacha Collection Max Spend ($)" value={inputs.gachaCollectionMaxSpend} min={500} max={25000} step={500} unit="$" onChange={(v) => updateInput('gachaCollectionMaxSpend', v)} />
        <SliderInput label="Monthly LiveOps Speed-up Cap ($)" value={inputs.monthlyLiveOpsCap} min={50} max={3000} step={50} unit="$" onChange={(v) => updateInput('monthlyLiveOpsCap', v)} />
      </div>
      <div className="lg:col-span-7">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <KpiCard label="Total Structural Spend Ceiling" value={`$${r.totalSpendCeiling.toLocaleString()}`} subtext="Max spend capacity for 1 whale" accentColor="text-indigo-600 dark:text-indigo-400" badgeText={r.depthRating} badgeVariant="success" />
          <KpiCard label="Annual LiveOps Sink Cap" value={`$${r.annualLiveOpsSpend.toLocaleString()}`} subtext="12-month LiveOps sink" accentColor="text-cyan-600 dark:text-cyan-400" />
        </div>
      </div>
    </div>
  );
};
