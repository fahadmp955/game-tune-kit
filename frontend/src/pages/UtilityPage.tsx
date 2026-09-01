import React, { useState, useEffect } from 'react';
import { ShareModal } from '../components/common/ShareModal';
import { Toast } from '../components/common/Toast';
import { decodeStateFromUrl } from '../utils/stateSerializer';
import { LtvCalculatorView } from '../components/utilities/LtvCalculatorView';
import { RoasCalculatorView } from '../components/utilities/RoasCalculatorView';
import { StickinessCalculatorView } from '../components/utilities/StickinessCalculatorView';
import { LootCalculatorView } from '../components/utilities/LootCalculatorView';
import { OfferCalculatorView } from '../components/utilities/OfferCalculatorView';
import { AbTestCalculatorView } from '../components/utilities/AbTestCalculatorView';
import { CpiCalculatorView } from '../components/utilities/CpiCalculatorView';
import { LtvCacCalculatorView } from '../components/utilities/LtvCacCalculatorView';
import { UaPaybackCalculatorView } from '../components/utilities/UaPaybackCalculatorView';
import { ArpdauCalculatorView } from '../components/utilities/ArpdauCalculatorView';
import { PppCalculatorView } from '../components/utilities/PppCalculatorView';
import { PackValueCalculatorView } from '../components/utilities/PackValueCalculatorView';
import { CurrencyExchangeCalculatorView } from '../components/utilities/CurrencyExchangeCalculatorView';
import { EconomyInflationCalculatorView } from '../components/utilities/EconomyInflationCalculatorView';
import { Share2, ArrowLeft } from 'lucide-react';

interface UtilityPageProps {
  utilityId: string;
  onBackToCatalog: () => void;
}

export const UtilityPage: React.FC<UtilityPageProps> = ({ utilityId, onBackToCatalog }) => {
  const [currentInputs, setCurrentInputs] = useState<Record<string, any>>({});
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  // Decode URL state on mount if present
  useEffect(() => {
    const urlInputs = decodeStateFromUrl<Record<string, any>>(utilityId);
    if (urlInputs) {
      setCurrentInputs(urlInputs);
      showToast('Loaded shared calculator state from URL link!');
    }
  }, [utilityId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
  };

  const getUtilityMeta = () => {
    switch (utilityId) {
      case '01-ltv-calculator':
        return { name: 'Cohort LTV & Retention Simulator', code: '01', family: 'Monetisation' };
      case '02-roas-calculator':
        return { name: 'ROAS & UA Payback Calculator', code: '02', family: 'Growth / UA' };
      case '32-stickiness-calculator':
        return { name: 'DAU / MAU Stickiness & Churn', code: '32', family: 'Intelligence' };
      case '14-loot-calculator':
        return { name: 'Loot & Drop-Rate Probability Simulator', code: '14', family: 'Economy & Systems' };
      case '36-offer-calculator':
        return { name: 'Offer & Bundle Discount Calculator', code: '36', family: 'LiveOps' };
      case '27-ab-test-calculator':
        return { name: 'A/B Test Sample Size Calculator', code: '27', family: 'Data & A/B' };
      case '03-cpi-calculator':
        return { name: 'Break-even CPI Calculator', code: '03', family: 'Growth / UA' };
      case '05-ltv-cac-calculator':
        return { name: 'LTV to CAC & Cash Runway', code: '05', family: 'Growth / UA' };
      case '04-ua-payback-calculator':
        return { name: 'UA Payback Economics', code: '04', family: 'Growth / UA' };
      case '07-arpdau-calculator':
        return { name: 'ARPDAU / ARPPU Calculator', code: '07', family: 'Monetisation' };
      case '08-ppp-calculator':
        return { name: 'PPP Regional Price Calculator', code: '08', family: 'Monetisation' };
      case '09-pack-value-calculator':
        return { name: 'IAP Pack Value Calculator', code: '09', family: 'Monetisation' };
      case '10-currency-exchange-calculator':
        return { name: 'Currency Exchange Calculator', code: '10', family: 'Economy & Systems' };
      case '12-economy-inflation-calculator':
        return { name: 'Economy Inflation Calculator', code: '12', family: 'Economy & Systems' };
      default:
        return { name: 'Calculator Utility', code: '00', family: 'General' };
    }
  };

  const meta = getUtilityMeta();

  const renderCalculatorView = () => {
    switch (utilityId) {
      case '01-ltv-calculator':
        return <LtvCalculatorView initialInputs={currentInputs} onInputsChange={setCurrentInputs} />;
      case '02-roas-calculator':
        return <RoasCalculatorView initialInputs={currentInputs} onInputsChange={setCurrentInputs} />;
      case '32-stickiness-calculator':
        return <StickinessCalculatorView initialInputs={currentInputs} onInputsChange={setCurrentInputs} />;
      case '14-loot-calculator':
        return <LootCalculatorView initialInputs={currentInputs} onInputsChange={setCurrentInputs} />;
      case '36-offer-calculator':
        return <OfferCalculatorView initialInputs={currentInputs} onInputsChange={setCurrentInputs} />;
      case '27-ab-test-calculator':
        return <AbTestCalculatorView initialInputs={currentInputs} onInputsChange={setCurrentInputs} />;
      case '03-cpi-calculator':
        return <CpiCalculatorView initialInputs={currentInputs} onInputsChange={setCurrentInputs} />;
      case '05-ltv-cac-calculator':
        return <LtvCacCalculatorView initialInputs={currentInputs} onInputsChange={setCurrentInputs} />;
      case '04-ua-payback-calculator':
        return <UaPaybackCalculatorView initialInputs={currentInputs} onInputsChange={setCurrentInputs} />;
      case '07-arpdau-calculator':
        return <ArpdauCalculatorView initialInputs={currentInputs} onInputsChange={setCurrentInputs} />;
      case '08-ppp-calculator':
        return <PppCalculatorView initialInputs={currentInputs} onInputsChange={setCurrentInputs} />;
      case '09-pack-value-calculator':
        return <PackValueCalculatorView initialInputs={currentInputs} onInputsChange={setCurrentInputs} />;
      case '10-currency-exchange-calculator':
        return <CurrencyExchangeCalculatorView initialInputs={currentInputs} onInputsChange={setCurrentInputs} />;
      case '12-economy-inflation-calculator':
        return <EconomyInflationCalculatorView initialInputs={currentInputs} onInputsChange={setCurrentInputs} />;
      default:
        return <div>Utility not found</div>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Bar with Breadcrumb and Share Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <button
            onClick={onBackToCatalog}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Utilities</span>
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-slate-400">UTIL-{meta.code}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">• {meta.family}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
            {meta.name}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShareModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
          >
            <Share2 className="w-4 h-4" />
            <span>Share & Copy Link</span>
          </button>
        </div>
      </div>

      {/* Calculator Workspace Body */}
      {renderCalculatorView()}

      {/* Share & Preset Modal */}
      <ShareModal
        utilityId={utilityId}
        utilityName={meta.name}
        currentInputs={currentInputs}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        onLoadPreset={(presetInputs) => {
          setCurrentInputs(presetInputs);
        }}
        onShowToast={showToast}
      />

      {/* Floating Toast Notification */}
      <Toast
        message={toastMessage}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
};
