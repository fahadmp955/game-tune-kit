import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { StudioProvider } from './context/StudioContext';
import { Header } from './components/common/Header';
import { CatalogPage } from './pages/CatalogPage';
import { UtilityPage } from './pages/UtilityPage';
import { PnsDashboardPage } from './pages/PnsDashboardPage';
import { getUtilityIdFromUrl } from './utils/stateSerializer';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'catalog' | 'utility' | 'pns'>('catalog');
  const [selectedUtilityId, setSelectedUtilityId] = useState<string>('01-ltv-calculator');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');

  // Check URL on load for direct utility links or encoded state
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    if (viewParam === 'pns') {
      setCurrentView('pns');
      return;
    }

    const targetUtilId = getUtilityIdFromUrl();
    if (targetUtilId) {
      setSelectedUtilityId(targetUtilId);
      setCurrentView('utility');
    }
  }, []);

  const handleSelectUtility = (utilityId: string) => {
    setSelectedUtilityId(utilityId);
    setCurrentView('utility');
    const url = new URL(window.location.href);
    url.searchParams.set('util', utilityId);
    url.searchParams.delete('view');
    window.history.pushState({}, '', url.toString());
  };

  const handleBackToCatalog = () => {
    setCurrentView('catalog');
    const url = new URL(window.location.href);
    url.searchParams.delete('util');
    url.searchParams.delete('state');
    url.searchParams.delete('view');
    window.history.pushState({}, '', url.toString());
  };

  const handleNavigateToPns = () => {
    setCurrentView('pns');
    const url = new URL(window.location.href);
    url.searchParams.delete('util');
    url.searchParams.set('view', 'pns');
    window.history.pushState({}, '', url.toString());
  };

  return (
    <ThemeProvider>
      <StudioProvider>
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
        <Header
          currentView={currentView}
          onNavigate={(view) => {
            if (view === 'pns') handleNavigateToPns();
            else handleBackToCatalog();
          }}
          selectedFamily={selectedFamily}
          onSelectFamily={setSelectedFamily}
        />

        <main className="flex-1">
          {currentView === 'catalog' && (
            <CatalogPage
              onSelectUtility={handleSelectUtility}
              selectedFamily={selectedFamily}
              onSelectFamily={setSelectedFamily}
            />
          )}
          {currentView === 'utility' && (
            <UtilityPage
              utilityId={selectedUtilityId}
              onBackToCatalog={handleBackToCatalog}
            />
          )}
          {currentView === 'pns' && <PnsDashboardPage />}
        </main>

        <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-[#0b0f19]/50 py-6 mt-12 transition-colors">
          <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              GameTuneKit — Open Game Operations & Economics Suite (Layer 0)
            </p>
            <p>Built for game designers, product managers, and UA operators. Free, client-side, and open-schema.</p>
          </div>
        </footer>
      </div>
      </StudioProvider>
    </ThemeProvider>
  );
};

export default App;
