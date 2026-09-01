import React, { useState, useMemo } from 'react';
import { AttDilutionInputs } from '../../types';
import { calculateAttDilution } from '../../engine/attDilutionCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

export const AttDilutionCalculatorView: React.FC<{ initialInputs?: Partial<AttDilutionInputs>; onInputsChange: (inputs: AttDilutionInputs) => void }> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<AttDilutionInputs>({ attOptInRatePercent: initialInputs?.attOptInRatePercent ?? 28, unattributedUaSpendPercent: initialInputs?.unattributedUaSpendPercent ?? 35 });
  const updateInput = <K extends keyof AttDilutionInputs>(key: K, val: AttDilutionInputs[K]) => { const u = { ...inputs, [key]: val }; setInputs(u); onInputsChange(u); };
  const r = useMemo(() => calculateAttDilution(inputs), [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">ATT Signal Parameters</h3>
        <SliderInput label="ATT Consent Opt-In Rate (%)" value={inputs.attOptInRatePercent} min={5} max={80} step={1} unit="%" onChange={(v) => updateInput('attOptInRatePercent', v)} />
        <SliderInput label="Unattributed UA Spend (%)" value={inputs.unattributedUaSpendPercent} min={0} max={70} step={5} unit="%" onChange={(v) => updateInput('unattributedUaSpendPercent', v)} />
      </div>
      <div className="lg:col-span-7">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <KpiCard label="Attribution Signal Loss" value={`${r.signalDilutionPercent}%`} subtext="Un-tracked iOS users" accentColor="text-indigo-600 dark:text-indigo-400" badgeText="Privacy Dilution" badgeVariant="warning" />
          <KpiCard label="Est. UA Efficiency Loss" value={`${r.estimatedUaEfficiencyLossPercent}%`} subtext="Effective ROAS degradation" accentColor="text-cyan-600 dark:text-cyan-400" />
        </div>
      </div>
    </div>
  );
};
