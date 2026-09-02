import React, { useState } from 'react';
import { useStudio, Cohort } from '../../context/StudioContext';
import { Users, Database, Sparkles, RefreshCw, Unlink } from 'lucide-react';

interface StudioCohortSelectorProps {
  activeCohortName?: string | null;
  activeReach?: number | null;
  onSelectCohort: (cohort: Cohort) => void;
  onDisconnect: () => void;
  calculatorName?: string;
}

export const StudioCohortSelector: React.FC<StudioCohortSelectorProps> = ({
  activeCohortName,
  activeReach,
  onSelectCohort,
  onDisconnect,
  calculatorName = 'Calculator',
}) => {
  const { availableGames, selectedGame, selectGameById, cohorts, isLoading } = useStudio();
  const [selectedCohortId, setSelectedCohortId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleApply = () => {
    const target = cohorts.find((c) => c.id === selectedCohortId) || cohorts[0];
    if (target) {
      onSelectCohort(target);
      setIsExpanded(false);
    }
  };

  const isConnected = Boolean(activeCohortName);

  return (
    <div className="glass-panel rounded-2xl p-4 transition-all duration-200 border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-indigo-50/30 via-transparent to-cyan-50/20 dark:from-indigo-950/10 dark:via-transparent dark:to-cyan-950/10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Status & Title */}
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Database className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Studio Cohort Sync (Layer 1/2)
              </span>
              {isConnected ? (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Connected</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Manual Sandbox Mode
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isConnected
                ? `Syncing inputs with ${selectedGame.name} • ${activeCohortName} (${activeReach?.toLocaleString()} players)`
                : `Optionally import real audience reach & behavioral baselines into this ${calculatorName}.`}
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <button
              onClick={onDisconnect}
              className="px-3 py-1.5 text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-xl transition-all flex items-center space-x-1.5"
            >
              <Unlink className="w-3 h-3" />
              <span>Reset to Sandbox</span>
            </button>
          ) : (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-sm shadow-indigo-600/20 transition-all flex items-center space-x-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{isExpanded ? 'Hide Studio Importer' : 'Connect Studio Segment'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable Cohort Selector Form */}
      {isExpanded && !isConnected && (
        <div className="mt-3.5 pt-3.5 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Game Selector */}
          <div className="sm:col-span-5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Select Studio Game Tenant
            </label>
            <select
              value={selectedGame.id}
              onChange={(e) => selectGameById(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-indigo-500"
            >
              {availableGames.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cohort Selector */}
          <div className="sm:col-span-5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Select Live Cohort Segment
            </label>
            <select
              value={selectedCohortId || (cohorts[0]?.id ?? '')}
              onChange={(e) => setSelectedCohortId(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-indigo-500"
            >
              {cohorts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.estimatedReach.toLocaleString()} reach)
                </option>
              ))}
            </select>
          </div>

          {/* Apply Button */}
          <div className="sm:col-span-2 pt-4 sm:pt-4">
            <button
              onClick={handleApply}
              disabled={isLoading || cohorts.length === 0}
              className="w-full py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center space-x-1"
            >
              {isLoading ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-3 h-3" />
                  <span>Apply</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
