import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Gamepad2, Menu, X, LayoutGrid } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  selectedFamily: string;
  onSelectFamily: (family: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, selectedFamily, onSelectFamily }) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const families = [
    { id: 'all', label: 'All Utilities' },
    { id: 'pricing-monetisation', label: 'Monetisation' },
    { id: 'growth-ua', label: 'Growth / UA' },
    { id: 'intelligence-metrics', label: 'Intelligence' },
    { id: 'economy-simulation', label: 'Economy & Systems' },
    { id: 'liveops', label: 'LiveOps' },
    { id: 'data-experimentation', label: 'Data & A/B' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => onNavigate('catalog')}
            className="flex items-center space-x-2.5 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white font-sans">
                  GameTune<span className="text-indigo-600 dark:text-indigo-400">Kit</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  L0 Open
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                Game Ops & Economics Tools
              </span>
            </div>
          </button>

          {/* Desktop Family Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200 dark:border-slate-800/60">
            {families.map((fam) => {
              const isActive = currentView === 'catalog' && selectedFamily === fam.id;
              return (
                <button
                  key={fam.id}
                  onClick={() => {
                    onSelectFamily(fam.id);
                    if (currentView !== 'catalog') onNavigate('catalog');
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {fam.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center space-x-3">
            {/* Mode Switcher */}
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => onNavigate('catalog')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  currentView === 'catalog' || currentView === 'utility'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Calculators</span>
              </button>
              <button
                onClick={() => onNavigate('pns')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  currentView === 'pns'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>PNS Studio</span>
              </button>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/50 transition-colors shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-800 animate-slide-down">
            <div className="flex flex-col space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1">
                Utility Families
              </span>
              {families.map((fam) => (
                <button
                  key={fam.id}
                  onClick={() => {
                    onSelectFamily(fam.id);
                    onNavigate('catalog');
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    currentView === 'catalog' && selectedFamily === fam.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {fam.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
