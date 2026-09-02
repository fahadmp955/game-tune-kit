import React, { useState, useMemo } from 'react';
import { LtvInputs } from '../../types';
import { calculateLtv } from '../../engine/ltvCalculator';
import { mapCohortToLtvAssumptions } from '../../engine/pnsCampaignSync';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';
import { FaqAccordion } from '../common/FaqAccordion';
import { StudioCohortSelector } from '../common/StudioCohortSelector';
import { Cohort } from '../../context/StudioContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface LtvCalculatorViewProps {
  initialInputs?: Partial<LtvInputs>;
  onInputsChange: (inputs: LtvInputs) => void;
}

export const LtvCalculatorView: React.FC<LtvCalculatorViewProps> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<LtvInputs>({
    d1Retention: initialInputs?.d1Retention ?? 40,
    d7Retention: initialInputs?.d7Retention ?? 15,
    d30Retention: initialInputs?.d30Retention ?? 6,
    dailyArpu: initialInputs?.dailyArpu ?? 0.15,
    horizonDays: initialInputs?.horizonDays ?? 180,
  });

  const [connectedCohort, setConnectedCohort] = useState<Cohort | null>(null);

  const updateInput = <K extends keyof LtvInputs>(key: K, val: LtvInputs[K]) => {
    const updated = { ...inputs, [key]: val };
    setInputs(updated);
    onInputsChange(updated);
  };

  const handleSelectStudioCohort = (cohort: Cohort) => {
    setConnectedCohort(cohort);
    const assumptions = mapCohortToLtvAssumptions(cohort.name, cohort.estimatedReach);
    const updated: LtvInputs = {
      d1Retention: assumptions.d1Retention ?? inputs.d1Retention,
      d7Retention: assumptions.d7Retention ?? inputs.d7Retention,
      d30Retention: assumptions.d30Retention ?? inputs.d30Retention,
      dailyArpu: assumptions.dailyArpu ?? inputs.dailyArpu,
      horizonDays: assumptions.horizonDays ?? inputs.horizonDays,
    };
    setInputs(updated);
    onInputsChange(updated);
  };

  const handleDisconnectStudioCohort = () => {
    setConnectedCohort(null);
  };

  const results = useMemo(() => calculateLtv(inputs), [inputs]);

  const projectedCohortTotalRevenue = useMemo(() => {
    if (!connectedCohort?.estimatedReach) return null;
    return (results.estimatedLtv * connectedCohort.estimatedReach).toLocaleString('en-US', {
      maximumFractionDigits: 0,
    });
  }, [results.estimatedLtv, connectedCohort]);

  const presetBenchmarks = [
    { label: 'Casual Game', d1: 42, d7: 16, d30: 6, arpu: 0.08 },
    { label: 'Midcore RPG', d1: 38, d7: 18, d30: 8, arpu: 0.35 },
    { label: 'Hardcore Strategy', d1: 32, d7: 16, d30: 9, arpu: 0.75 },
    { label: 'Hypercasual', d1: 48, d7: 12, d30: 2, arpu: 0.04 },
  ];

  const faqItems = [
    {
      question: 'How is the power-law retention curve fitted?',
      answer: 'GameTuneKit fits observed D1, D7, and D30 retention checkpoints to the power-law function R(t) = a * t^(-b) using logarithmic linear regression. Decay coefficient (b) reflects long-term player churn speed.',
    },
    {
      question: 'What is Active Lifespan?',
      answer: 'Active Lifespan is the mathematical integral of the retention curve over time. It represents the expected total active days an acquired player spends in your game.',
    },
    {
      question: 'How is Cumulative LTV calculated?',
      answer: 'Cumulative LTV(T) = (Sum of daily retention probabilities from Day 1 to Day T) * Daily ARPU (Average Revenue Per Daily Active User).',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Studio Cohort Ingestion (Layer 1/2 Sync) */}
      <StudioCohortSelector
        activeCohortName={connectedCohort?.name}
        activeReach={connectedCohort?.estimatedReach}
        onSelectCohort={handleSelectStudioCohort}
        onDisconnect={handleDisconnectStudioCohort}
        calculatorName="LTV Simulator"
      />

      {/* Top Benchmark Selector */}
      <div className="glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Autofill Genre Benchmarks:
        </span>
        <div className="flex flex-wrap gap-2">
          {presetBenchmarks.map((b) => (
            <button
              key={b.label}
              onClick={() => {
                const updated = {
                  d1Retention: b.d1,
                  d7Retention: b.d7,
                  d30Retention: b.d30,
                  dailyArpu: b.arpu,
                  horizonDays: inputs.horizonDays,
                };
                setInputs(updated);
                onInputsChange(updated);
              }}
              className="px-3 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700/60 rounded-xl transition-colors"
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Control Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-5 sm:p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">
            Cohort Assumptions
          </h3>

          <SliderInput
            label="Day 1 Retention (D1 %)"
            value={inputs.d1Retention}
            min={1}
            max={90}
            unit="%"
            onChange={(val) => updateInput('d1Retention', val)}
            description="Percentage of new installs returning on Day 1"
          />

          <SliderInput
            label="Day 7 Retention (D7 %)"
            value={inputs.d7Retention}
            min={1}
            max={60}
            unit="%"
            onChange={(val) => updateInput('d7Retention', val)}
            description="Percentage of new installs returning on Day 7"
          />

          <SliderInput
            label="Day 30 Retention (D30 %)"
            value={inputs.d30Retention}
            min={0.5}
            max={40}
            step={0.5}
            unit="%"
            onChange={(val) => updateInput('d30Retention', val)}
            description="Percentage of new installs returning on Day 30"
          />

          <SliderInput
            label="Daily ARPU (ARPU / DAU)"
            value={inputs.dailyArpu}
            min={0.01}
            max={5.0}
            step={0.01}
            unit="$"
            onChange={(val) => updateInput('dailyArpu', val)}
            description="Blended daily revenue generated per DAU"
          />

          <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-3.5 rounded-xl">
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
              LTV Horizon Window
            </label>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[30, 90, 180, 365].map((d) => (
                <button
                  key={d}
                  onClick={() => updateInput('horizonDays', d)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    inputs.horizonDays === d
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Results & Visualizations (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live PNS Cohort Revenue Forecast Banner */}
          {connectedCohort && projectedCohortTotalRevenue && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  PNS Segment Audience Revenue Forecast
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Projected revenue for <strong className="text-slate-900 dark:text-white">{connectedCohort.name}</strong> ({connectedCohort.estimatedReach.toLocaleString()} players) over {inputs.horizonDays} days
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  ${projectedCohortTotalRevenue}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  @ ${results.estimatedLtv} / player
                </span>
              </div>
            </div>
          )}

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <KpiCard
              label={`Estimated D${inputs.horizonDays} LTV`}
              value={`$${results.estimatedLtv}`}
              subtext={`Cumulative value at D${inputs.horizonDays}`}
              accentColor="text-indigo-600 dark:text-indigo-400"
              badgeText={results.healthRating}
              badgeVariant={results.healthRating === 'Excellent' || results.healthRating === 'Healthy' ? 'success' : 'warning'}
            />
            <KpiCard
              label="Active Lifespan"
              value={`${results.activeLifespanDays} days`}
              subtext="Expected total active days"
              accentColor="text-cyan-600 dark:text-cyan-400"
            />
            <KpiCard
              label="Decay Coefficient (b)"
              value={results.decayCoeffB}
              subtext="Power-law decay rate"
              accentColor="text-violet-600 dark:text-violet-400"
            />
          </div>

          {/* Interactive Chart Container */}
          <div className="glass-panel rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Retention & Cumulative LTV Trajectory
              </h4>
              <div className="flex items-center space-x-4 text-xs font-semibold">
                <span className="flex items-center space-x-1.5 text-indigo-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>
                  <span>LTV ($)</span>
                </span>
                <span className="flex items-center space-x-1.5 text-cyan-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block"></span>
                  <span>Retention (%)</span>
                </span>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={results.chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fill: '#818cf8', fontSize: 11 }} domain={[0, 'auto']} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: '#38bdf8', fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="cumulativeLtv" name="LTV ($)" stroke="#6366f1" strokeWidth={2.5} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="retention" name="Retention (%)" stroke="#38bdf8" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Accordion */}
      <FaqAccordion items={faqItems} />
    </div>
  );
};
