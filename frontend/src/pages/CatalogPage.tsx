import React, { useState } from 'react';
import { UtilityMeta } from '../types';
import { Search, Sparkles, ArrowRight, Play, Zap } from 'lucide-react';

interface CatalogPageProps {
  onSelectUtility: (utilityId: string) => void;
  selectedFamily: string;
  onSelectFamily: (family: string) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ onSelectUtility, selectedFamily, onSelectFamily }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const utilities: UtilityMeta[] = [
    {
      id: '01-ltv-calculator',
      code: '01',
      name: 'Cohort LTV & Retention Simulator',
      family: 'pricing-monetisation',
      description: 'Fit a power-law decay curve to observed cohort metrics. Project Day 365 survival and cumulative cohort LTV.',
      isCore: true,
      tagText: 'Monetisation & Pricing',
      tagColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    {
      id: '02-roas-calculator',
      code: '02',
      name: 'ROAS & UA Payback Calculator',
      family: 'growth-ua',
      description: 'Calculate campaign ROAS % across D7, D30, D90, D180 and determine break-even CPI ceilings.',
      isCore: true,
      tagText: 'Growth & UA',
      tagColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    },
    {
      id: '32-stickiness-calculator',
      code: '32',
      name: 'DAU / MAU Stickiness & Churn',
      family: 'intelligence-metrics',
      description: 'Compute daily stickiness ratios, engagement classification tiers, and 30-day active user churn decay.',
      isCore: true,
      tagText: 'Intelligence',
      tagColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    },
    {
      id: '14-loot-calculator',
      code: '14',
      name: 'Loot & Drop-Rate Simulator',
      family: 'economy-simulation',
      description: 'Model binomial drop probabilities, expected pulls required for 90%/99% confidence, and cumulative CDF.',
      isCore: true,
      tagText: 'Economy & Systems',
      tagColor: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
    },
    {
      id: '36-offer-calculator',
      code: '36',
      name: 'Offer & Bundle Discount Calculator',
      family: 'liveops',
      description: 'Evaluate bundle anchor values, effective discount %, value multipliers (e.g. 3.5x), and package positioning.',
      isCore: true,
      tagText: 'LiveOps',
      tagColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    },
    {
      id: '27-ab-test-calculator',
      code: '27',
      name: 'A/B Test Sample Size & Duration',
      family: 'data-experimentation',
      description: 'Determine required user sample size per variant, target MDE uplift, and runtime days for game experiments.',
      isCore: true,
      tagText: 'Data & A/B',
      tagColor: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    },
  ];

  const futureCatalogItems = [
    { code: '08', name: 'PPP Price Calculator', family: 'pricing-monetisation' },
    { code: '09', name: 'IAP Pack Value Calculator', family: 'pricing-monetisation' },
    { code: '10', name: 'Currency Exchange Calculator', family: 'economy-simulation' },
    { code: '12', name: 'Economy Inflation Calculator', family: 'economy-simulation' },
    { code: '15', name: 'Pity System Calculator', family: 'economy-simulation' },
    { code: '17', name: 'XP & Progression Curve Generator', family: 'economy-simulation' },
    { code: '20', name: 'Battle Pass Calculator', family: 'liveops' },
    { code: '23', name: 'Ad Revenue Calculator', family: 'growth-ua' },
  ];

  const filteredUtilities = utilities.filter((u) => {
    const matchesFamily = selectedFamily === 'all' || u.family === selectedFamily;
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFamily && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 relative overflow-hidden bg-gradient-to-r from-indigo-900/30 via-slate-900 to-slate-900 border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Game Operations Suite</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
            Decision-Support Tools for Game Teams
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Zero-friction standalone utilities for game developers, economy designers, and growth managers. Pure client-side calculation, no backend setup needed.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Family Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All' },
            { id: 'pricing-monetisation', label: 'Monetisation' },
            { id: 'growth-ua', label: 'Growth/UA' },
            { id: 'intelligence-metrics', label: 'Intelligence' },
            { id: 'economy-simulation', label: 'Economy' },
            { id: 'liveops', label: 'LiveOps' },
            { id: 'data-experimentation', label: 'Data' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onSelectFamily(tab.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                selectedFamily === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search utilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Active Core Utilities Grid */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Core Utilities (Ready to Run)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUtilities.map((utility) => (
            <div
              key={utility.id}
              onClick={() => onSelectUtility(utility.id)}
              className="glass-panel rounded-2xl p-6 flex flex-col justify-between group cursor-pointer hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${utility.tagColor}`}>
                    {utility.tagText}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    UTIL-{utility.code}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {utility.name}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {utility.description}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                  <span>Open Utility</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </span>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Catalogue Grid */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Upcoming Catalogue Utilities (Specs Available)
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {futureCatalogItems.map((item) => (
            <div
              key={item.code}
              className="bg-slate-100/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 p-3.5 rounded-xl opacity-75 hover:opacity-100 transition-opacity"
            >
              <span className="text-[10px] font-mono text-slate-400 block mb-1">
                UTIL-{item.code}
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-300 block">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
