import { UserPreset } from '../types';

/**
 * Encodes input state object into compressed Base64 URL parameter
 */
export const encodeStateToUrl = (utilityId: string, inputs: Record<string, any>): string => {
  try {
    const payload = JSON.stringify({ u: utilityId, i: inputs });
    const encoded = btoa(encodeURIComponent(payload));
    const url = new URL(window.location.href);
    url.searchParams.set('state', encoded);
    return url.toString();
  } catch (err) {
    console.error('Failed to encode state to URL:', err);
    return window.location.href;
  }
};

/**
 * Decodes input state object from URL query parameter
 */
export const decodeStateFromUrl = <T>(utilityId: string): T | null => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const stateParam = urlParams.get('state');
    if (!stateParam) return null;

    const decodedStr = decodeURIComponent(atob(stateParam));
    const parsed = JSON.parse(decodedStr);
    if (parsed && parsed.u === utilityId && parsed.i) {
      return parsed.i as T;
    }
    return null;
  } catch (err) {
    console.warn('Failed to decode state from URL query param:', err);
    return null;
  }
};

const PRESETS_STORAGE_KEY = 'gametune_presets_v1';

export const getSavedPresets = (utilityId?: string): UserPreset[] => {
  try {
    const data = localStorage.getItem(PRESETS_STORAGE_KEY);
    if (!data) return [];
    const presets: UserPreset[] = JSON.parse(data);
    if (utilityId) {
      return presets.filter((p) => p.utilityId === utilityId);
    }
    return presets;
  } catch (err) {
    console.error('Failed to load presets from localStorage:', err);
    return [];
  }
};

export const savePreset = (utilityId: string, name: string, inputs: Record<string, any>): UserPreset => {
  const presets = getSavedPresets();
  const newPreset: UserPreset = {
    id: `preset_${Date.now()}`,
    utilityId,
    name,
    createdAt: new Date().toISOString().split('T')[0],
    inputs,
  };
  const updated = [newPreset, ...presets];
  localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updated));
  return newPreset;
};

export const deletePreset = (presetId: string): void => {
  const presets = getSavedPresets();
  const filtered = presets.filter((p) => p.id !== presetId);
  localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(filtered));
};
