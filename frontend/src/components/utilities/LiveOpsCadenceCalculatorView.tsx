import React, { useState, useMemo } from 'react';
import { LiveOpsCadenceInputs } from '../../types';
import { calculateLiveOpsCadence } from '../../engine/liveOpsCadenceCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

export const LiveOpsCadenceCalculatorView: React.FC<{ initialInputs?: Partial<LiveOpsCadenceInputs>; onInputsChange: (inputs: LiveOpsCadenceInputs) => void }> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<LiveOpsCadenceInputs>({ eventDurationDays: initialInputs?.eventDurationDays ?? 3, cooldownDays: initialInputs?.cooldownDays ?? 4, monthlyEventsTarget: initialInputs?.monthlyEventsTarget ?? 4 });
  const updateInput = <K extends keyof LiveOpsCadenceInputs>(key: K, val: LiveOpsCadenceInputs[K]) => { const u = { ...inputs, [key]: val }; setInputs(u); onInputsChange(u); };
  const r = useMemo(() => calculateLiveOpsCadence(inputs), [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">Event Schedule Inputs</h3>
        <SliderInput label="Event Duration (Days)" value={inputs.eventDurationDays} min={1} max={14} step={1} onChange={(v) => updateInput('eventDurationDays', v)} />
        <SliderInput label="Cooldown Days" value={inputs.cooldownDays} min={0} max={14} step={1} onChange={(v) => updateInput('cooldownDays', v)} />
        <SliderInput label="Events / Month Target" value={inputs.monthlyEventsTarget} min={1} max={10} step={1} onChange={(v) => updateInput('monthlyEventsTarget', v)} />
      </div>
      <div className="lg:col-span-7">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <KpiCard label="Active Event Days / Month" value={`${r.activeDaysPerMonth} days`} subtext="Total monthly active event days" accentColor="text-indigo-600 dark:text-indigo-400" badgeText={r.fatigueRisk} badgeVariant={r.activeDaysPerMonth < 25 ? 'success' : 'warning'} />
          <KpiCard label="Cooldown Days / Month" value={`${r.totalCooldownDaysMonth} days`} subtext="Rest days" accentColor="text-cyan-600 dark:text-cyan-400" />
        </div>
      </div>
    </div>
  );
};
