import React, { useState, useMemo } from 'react';
import { SoftLaunchScorecardInputs } from '../../types';
import { calculateSoftLaunchScorecard } from '../../engine/softLaunchScorecardCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

export const SoftLaunchScorecardCalculatorView: React.FC<{ initialInputs?: Partial<SoftLaunchScorecardInputs>; onInputsChange: (inputs: SoftLaunchScorecardInputs) => void }> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<SoftLaunchScorecardInputs>({ d1Retention: initialInputs?.d1Retention ?? 38, d7Retention: initialInputs?.d7Retention ?? 14, d30Arpu: initialInputs?.d30Arpu ?? 2.10, cpi: initialInputs?.cpi ?? 1.80 });
  const updateInput = <K extends keyof SoftLaunchScorecardInputs>(key: K, val: SoftLaunchScorecardInputs[K]) => { const u = { ...inputs, [key]: val }; setInputs(u); onInputsChange(u); };
  const r = useMemo(() => calculateSoftLaunchScorecard(inputs), [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">Soft Launch Key Metrics</h3>
        <SliderInput label="Day 1 Retention (%)" value={inputs.d1Retention} min={10} max={70} step={1} unit="%" onChange={(v) => updateInput('d1Retention', v)} />
        <SliderInput label="Day 7 Retention (%)" value={inputs.d7Retention} min={5} max={40} step={1} unit="%" onChange={(v) => updateInput('d7Retention', v)} />
        <SliderInput label="D30 ARPU ($)" value={inputs.d30Arpu} min={0.1} max={15.0} step={0.1} unit="$" onChange={(v) => updateInput('d30Arpu', v)} />
        <SliderInput label="Cost Per Install (CPI $)" value={inputs.cpi} min={0.2} max={10.0} step={0.1} unit="$" onChange={(v) => updateInput('cpi', v)} />
      </div>
      <div className="lg:col-span-7">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <KpiCard label="Soft Launch Readiness Score" value={`${r.overallScore} / 100`} subtext="Overall launch score" accentColor="text-indigo-600 dark:text-indigo-400" badgeText={r.readinessRating} badgeVariant={r.overallScore >= 85 ? 'success' : 'warning'} />
        </div>
      </div>
    </div>
  );
};
