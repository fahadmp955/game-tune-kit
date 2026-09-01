import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 mt-8">
      <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <HelpCircle className="w-5 h-5 text-indigo-500" />
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
          Common Questions & Calculation Formulas
        </h3>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-slate-200 dark:border-slate-800/80 rounded-xl overflow-hidden transition-all bg-slate-50/50 dark:bg-slate-900/30"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-3.5 text-left font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <span>{item.question}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-3.5 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/50 dark:border-slate-800/50 font-sans">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
