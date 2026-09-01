import React, { useState } from 'react';
import { Share2, Copy, Check, X, Bookmark, Trash2 } from 'lucide-react';
import { encodeStateToUrl, getSavedPresets, savePreset, deletePreset } from '../../utils/stateSerializer';
import { UserPreset } from '../../types';

interface ShareModalProps {
  utilityId: string;
  utilityName: string;
  currentInputs: Record<string, any>;
  isOpen: boolean;
  onClose: () => void;
  onLoadPreset: (inputs: Record<string, any>) => void;
  onShowToast: (msg: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  utilityId,
  utilityName,
  currentInputs,
  isOpen,
  onClose,
  onLoadPreset,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [presetNameInput, setPresetNameInput] = useState('');
  const [savedPresets, setSavedPresets] = useState<UserPreset[]>(() => getSavedPresets(utilityId));

  if (!isOpen) return null;

  const shareableUrl = encodeStateToUrl(utilityId, currentInputs);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      onShowToast('Shareable link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!presetNameInput.trim()) return;
    const newPreset = savePreset(utilityId, presetNameInput.trim(), currentInputs);
    setSavedPresets([newPreset, ...savedPresets]);
    setPresetNameInput('');
    onShowToast(`Preset "${newPreset.name}" saved!`);
  };

  const handleDeletePreset = (id: string, name: string) => {
    deletePreset(id);
    setSavedPresets(savedPresets.filter((p) => p.id !== id));
    onShowToast(`Preset "${name}" removed`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl p-6 shadow-2xl transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 dark:border-slate-800/80 pb-4 mb-5">
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Share & Save — {utilityName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Share Link Section */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Shareable Link (Encodes Current Inputs)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={shareableUrl}
              className="flex-1 bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl px-3.5 py-2.5 outline-none font-mono truncate"
            />
            <button
              onClick={handleCopyLink}
              className={`flex items-center space-x-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all shadow-md shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2. Save Preset Section */}
        <div className="border-t border-slate-200 dark:border-slate-800/80 pt-5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Save Current Setup as Preset
          </label>
          <form onSubmit={handleSavePreset} className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              placeholder="e.g. Midcore RPG Soft Launch"
              value={presetNameInput}
              onChange={(e) => setPresetNameInput(e.target.value)}
              className="flex-1 bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!presetNameInput.trim()}
              className="flex items-center space-x-1 px-4 py-2.5 text-xs font-semibold bg-slate-800 dark:bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors disabled:opacity-50"
            >
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>Save Preset</span>
            </button>
          </form>

          {/* Saved Presets List */}
          {savedPresets.length > 0 && (
            <div className="mt-3">
              <span className="text-xs font-medium text-slate-400 block mb-2">Saved Presets ({savedPresets.length}):</span>
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                {savedPresets.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/60 p-2.5 rounded-xl text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-slate-200 block">{preset.name}</span>
                      <span className="text-[10px] text-slate-500">Saved: {preset.createdAt}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          onLoadPreset(preset.inputs);
                          onShowToast(`Loaded preset "${preset.name}"`);
                          onClose();
                        }}
                        className="px-2.5 py-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => handleDeletePreset(preset.id, preset.name)}
                        className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
