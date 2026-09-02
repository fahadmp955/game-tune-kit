import React, { useState, useMemo } from 'react';
import { OfferInputs } from '../../types';
import { calculateOffer } from '../../engine/offerCalculator';
import { SliderInput } from '../common/SliderInput';
import { KpiCard } from '../common/KpiCard';
import { FaqAccordion } from '../common/FaqAccordion';
import { StudioCohortSelector } from '../common/StudioCohortSelector';
import { Cohort } from '../../context/StudioContext';

interface OfferCalculatorViewProps {
  initialInputs?: Partial<OfferInputs>;
  onInputsChange: (inputs: OfferInputs) => void;
}

export const OfferCalculatorView: React.FC<OfferCalculatorViewProps> = ({ initialInputs, onInputsChange }) => {
  const [inputs, setInputs] = useState<OfferInputs>({
    primaryItemPrice: initialInputs?.primaryItemPrice ?? 10.0,
    bonusItemsValue: initialInputs?.bonusItemsValue ?? 15.0,
    hardCurrencyBonusValue: initialInputs?.hardCurrencyBonusValue ?? 10.0,
    offerPackagePrice: initialInputs?.offerPackagePrice ?? 9.99,
  });

  const [connectedCohort, setConnectedCohort] = useState<Cohort | null>(null);

  const updateInput = <K extends keyof OfferInputs>(key: K, val: OfferInputs[K]) => {
    const updated = { ...inputs, [key]: val };
    setInputs(updated);
    onInputsChange(updated);
  };

  const results = useMemo(() => calculateOffer(inputs), [inputs]);

  const cohortProjectedSales = useMemo(() => {
    if (!connectedCohort?.estimatedReach) return null;
    const reach = connectedCohort.estimatedReach;
    const estimatedBuyers = Math.round(reach * 0.048); // ~4.8% typical conversion
    const grossRevenue = (estimatedBuyers * inputs.offerPackagePrice).toFixed(2);
    return { estimatedBuyers, grossRevenue };
  }, [connectedCohort, inputs.offerPackagePrice]);

  const faqItems = [
    {
      question: 'How is the Value Multiplier calculated?',
      answer: 'Value Multiplier = Total Anchor Economy Value of items / Offer Package Retail Price (e.g. $35 value for $9.99 = 3.5x Value).',
    },
    {
      question: 'What is Effective Discount %?',
      answer: 'Effective Discount = ((Total Anchor Value - Offer Price) / Total Anchor Value) * 100.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Studio Cohort Ingestion */}
      <StudioCohortSelector
        activeCohortName={connectedCohort?.name}
        activeReach={connectedCohort?.estimatedReach}
        onSelectCohort={(cohort) => setConnectedCohort(cohort)}
        onDisconnect={() => setConnectedCohort(null)}
        calculatorName="Offer Discount Calculator"
      />

      {connectedCohort && cohortProjectedSales && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/10 border border-amber-500/20 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
              Push Offer Campaign Projection for {connectedCohort.name}
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Target reach: {connectedCohort.estimatedReach.toLocaleString()} players • Estimated ~{cohortProjectedSales.estimatedBuyers.toLocaleString()} conversions (4.8% baseline)
            </p>
          </div>
          <div className="text-right">
            <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
              ${Number(cohortProjectedSales.grossRevenue).toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
              @ ${inputs.offerPackagePrice} / pack
            </span>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 glass-panel rounded-2xl p-5 sm:p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">
            Bundle Item & Anchor Valuation ($)
          </h3>

          <SliderInput label="Primary Item Anchor Value ($)" value={inputs.primaryItemPrice} min={0.99} max={100} step={0.5} unit="$" onChange={(val) => updateInput('primaryItemPrice', val)} />
          <SliderInput label="Bonus Gear / Consumables Value ($)" value={inputs.bonusItemsValue} min={0} max={100} step={0.5} unit="$" onChange={(val) => updateInput('bonusItemsValue', val)} />
          <SliderInput label="Hard Currency Bonus Value ($)" value={inputs.hardCurrencyBonusValue} min={0} max={100} step={0.5} unit="$" onChange={(val) => updateInput('hardCurrencyBonusValue', val)} />
          <SliderInput label="Offer Retail Selling Price ($)" value={inputs.offerPackagePrice} min={0.99} max={100} step={0.5} unit="$" onChange={(val) => updateInput('offerPackagePrice', val)} />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <KpiCard
              label="Value Multiplier"
              value={`${results.valueMultiplier}x`}
              subtext="Bundle value boost"
              accentColor="text-amber-500 dark:text-amber-400"
              badgeText={results.positioningRating}
              badgeVariant="success"
            />
            <KpiCard
              label="Effective Discount"
              value={`${results.effectiveDiscountPercent}%`}
              subtext={`Save $${results.savingsAmount}`}
              accentColor="text-indigo-600 dark:text-indigo-400"
            />
            <KpiCard
              label="Total Anchor Value"
              value={`$${results.totalAnchorValue}`}
              subtext={`Retail price: $${inputs.offerPackagePrice}`}
              accentColor="text-emerald-600 dark:text-emerald-400"
            />
          </div>

          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Bundle Value Breakdown
            </h4>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600 dark:text-slate-300">Retail Price</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">${inputs.offerPackagePrice}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (inputs.offerPackagePrice / Math.max(1, results.totalAnchorValue)) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600 dark:text-slate-300">Total Economy Anchor Value</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">${results.totalAnchorValue}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FaqAccordion items={faqItems} />
    </div>
  );
};
