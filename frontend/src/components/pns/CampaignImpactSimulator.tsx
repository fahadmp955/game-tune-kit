import React, { useState, useMemo } from 'react';
import { calculateCampaignImpact, CampaignImpactResults } from '../../engine/pnsCampaignSync';
import { SliderInput } from '../common/SliderInput';
import { TrendingUp, DollarSign, Users, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

interface CampaignImpactSimulatorProps {
  cohortName: string;
  targetReach: number;
  campaignTitle: string;
  deepLinkScreen: string;
}

export const CampaignImpactSimulator: React.FC<CampaignImpactSimulatorProps> = ({
  cohortName,
  targetReach,
  campaignTitle,
  deepLinkScreen,
}) => {
  const [openRatePct, setOpenRatePct] = useState<number>(8.5);
  const [conversionRatePct, setConversionRatePct] = useState<number>(4.8);
  const [offerPrice, setOfferPrice] = useState<number>(4.99);

  const results: CampaignImpactResults = useMemo(() => {
    return calculateCampaignImpact({
      targetReach,
      openRatePct,
      conversionRatePct,
      offerPrice,
    });
  }, [targetReach, openRatePct, conversionRatePct, offerPrice]);

  const handleOpenLtvCalculator = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('util', '01-ltv-calculator');
    url.searchParams.delete('view');
    window.location.href = url.toString();
  };

  const handleOpenOfferCalculator = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('util', '36-offer-calculator');
    url.searchParams.delete('view');
    window.location.href = url.toString();
  };

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl space-y-5 border border-indigo-500/20 bg-gradient-to-b from-indigo-500/5 via-slate-50/50 to-white dark:from-indigo-950/20 dark:via-slate-900/40 dark:to-slate-900/60 shadow-lg shadow-indigo-500/5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
              <span>Campaign Impact & Revenue Simulator</span>
              <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md border border-indigo-500/20">
                L0 ⟷ L1 Sync
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Live mathematical forecast for <strong className="text-slate-700 dark:text-slate-300">"{campaignTitle || 'Active Campaign'}"</strong> using GameTuneKit LTV & Retention engine.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Segment</span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {cohortName} ({targetReach.toLocaleString()} players)
          </span>
        </div>
      </div>

      {/* KPI Forecast Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
            <Users className="w-3 h-3 text-cyan-500" />
            <span>Est. Opens</span>
          </span>
          <p className="text-lg font-black text-slate-900 dark:text-white font-mono">
            {results.estimatedOpens.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
            @{openRatePct}% open rate
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Est. Buyers</span>
          </span>
          <p className="text-lg font-black text-slate-900 dark:text-white font-mono">
            {results.estimatedConversions.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
            @{conversionRatePct}% conv
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
            <DollarSign className="w-3 h-3 text-emerald-500" />
            <span>Projected Gross</span>
          </span>
          <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
            ${results.projectedGrossRevenue.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 block font-mono">
            @${offerPrice}/pack
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3 text-indigo-500" />
            <span>D7 Retention Lift</span>
          </span>
          <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">
            +{results.estimatedD7UpliftPct}%
          </p>
          <span className="text-[10px] text-indigo-600/70 dark:text-indigo-400/70 block font-mono">
            re-engagement
          </span>
        </div>
      </div>

      {/* Interactive Simulation Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        <SliderInput
          label="Push Open Rate"
          value={openRatePct}
          min={1}
          max={30}
          step={0.5}
          unit="%"
          onChange={setOpenRatePct}
          description="Industry benchmark: 5% – 12%"
        />
        <SliderInput
          label="In-App Conversion"
          value={conversionRatePct}
          min={0.5}
          max={20}
          step={0.1}
          unit="%"
          onChange={setConversionRatePct}
          description="Store purchase or action"
        />
        <SliderInput
          label="Target Pack Price"
          value={offerPrice}
          min={0.99}
          max={49.99}
          step={1}
          unit="$"
          onChange={setOfferPrice}
          description="SKU bundle price in push"
        />
      </div>

      {/* Deep-link Action Bar */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1">
          <span>Target screen:</span>
          <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
            {deepLinkScreen || 'shop_hub'}
          </code>
        </span>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleOpenOfferCalculator}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700/60 transition-colors flex items-center space-x-1"
          >
            <span>Offer Calculator</span>
            <ExternalLink className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={handleOpenLtvCalculator}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/20 transition-colors flex items-center space-x-1"
          >
            <span>Full LTV Model</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
