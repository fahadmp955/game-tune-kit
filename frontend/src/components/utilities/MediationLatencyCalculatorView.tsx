import React, { useState, useMemo } from 'react';
import { MediationLatencyInputs } from '../../types';
import { calculateMediationLatency } from '../../engine/mediationLatencyCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';

export const MediationLatencyCalculatorView: React.FC<{ initialInputs?: Partial<MediationLatencyInputs>; onInputsChange: (inputs: MediationLatencyInputs) => void }> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<MediationLatencyInputs>({ waterfallLatencyMs: initialInputs?.waterfallLatencyMs ?? 450, dropOffRatePer100ms: initialInputs?.dropOffRatePer100ms ?? 3.5, dailyAdRequests: initialInputs?.dailyAdRequests ?? 100000, ecpm: initialInputs?.ecpm ?? 15.0 });
  const updateInput = <K extends keyof MediationLatencyInputs>(key: K, val: MediationLatencyInputs[K]) => { const u = { ...inputs, [key]: val }; setInputs(u); onInputsChange(u); };
  const r = useMemo(() => calculateMediationLatency(inputs), [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">Waterfall Latency Parameters</h3>
        <SliderInput label="Waterfall Response Latency (ms)" value={inputs.waterfallLatencyMs} min={50} max={2000} step={50} unit="ms" onChange={(v) => updateInput('waterfallLatencyMs', v)} />
        <SliderInput label="Drop-off Rate / 100ms (%)" value={inputs.dropOffRatePer100ms} min={0.5} max={10.0} step={0.5} unit="%" onChange={(v) => updateInput('dropOffRatePer100ms', v)} />
        <SliderInput label="Daily Ad Requests" value={inputs.dailyAdRequests} min={10000} max={1000000} step={10000} onChange={(v) => updateInput('dailyAdRequests', v)} />
        <SliderInput label="Ad eCPM ($)" value={inputs.ecpm} min={1.0} max={50.0} step={1.0} unit="$" onChange={(v) => updateInput('ecpm', v)} />
      </div>
      <div className="lg:col-span-7">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <KpiCard label="Daily Yield Leakage" value={`-$${r.dailyYieldLeakageUsd}`} subtext="Revenue lost to latency" accentColor="text-indigo-600 dark:text-indigo-400" badgeText="Latency Leakage" badgeVariant="warning" />
          <KpiCard label="Impression Drop-Off %" value={`${r.totalDropOffPercent}%`} subtext="Un-rendered ad impressions" accentColor="text-cyan-600 dark:text-cyan-400" />
          <KpiCard label="Lost Daily Impressions" value={r.lostImpressions.toLocaleString()} subtext="Failed fill timeouts" accentColor="text-emerald-600 dark:text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
