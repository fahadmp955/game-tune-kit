import { UserPreset } from '../types';

/**
 * Encodes input state object into compressed Base64 URL parameter with utility ID
 */
export const encodeStateToUrl = (utilityId: string, inputs: Record<string, any>): string => {
  try {
    const payload = JSON.stringify({ u: utilityId, i: inputs });
    const encoded = btoa(encodeURIComponent(payload));
    const origin = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'http://localhost:5173/';
    const url = new URL(origin);
    url.searchParams.set('util', utilityId);
    url.searchParams.set('state', encoded);
    return url.toString();
  } catch (err) {
    console.error('Failed to encode state to URL:', err);
    return typeof window !== 'undefined' ? window.location.href : 'http://localhost:5173/';
  }
};

/**
 * Decodes input state object from URL query parameter
 */
export const decodeStateFromUrl = <T>(utilityId: string): T | null => {
  try {
    if (typeof window === 'undefined') return null;
    const urlParams = new URLSearchParams(window.location.search);
    const stateParam = urlParams.get('state');
    if (!stateParam) return null;

    const decodedStr = decodeURIComponent(atob(stateParam));
    const parsed = JSON.parse(decodedStr);
    if (parsed && (parsed.u === utilityId || !parsed.u) && parsed.i) {
      return parsed.i as T;
    }
    return null;
  } catch (err) {
    console.warn('Failed to decode state from URL query param:', err);
    return null;
  }
};

/**
 * Extracts utility ID directly from URL state param if util param is missing
 */
export const getUtilityIdFromUrl = (): string | null => {
  try {
    if (typeof window === 'undefined') return null;
    const urlParams = new URLSearchParams(window.location.search);
    const utilParam = urlParams.get('util');
    if (utilParam) return utilParam;

    const stateParam = urlParams.get('state');
    if (stateParam) {
      const decodedStr = decodeURIComponent(atob(stateParam));
      const parsed = JSON.parse(decodedStr);
      if (parsed && parsed.u) return parsed.u;
    }
    return null;
  } catch (err) {
    return null;
  }
};

const PRESETS_STORAGE_KEY = 'gametune_presets_v1';

export const getSavedPresets = (utilityId?: string): UserPreset[] => {
  try {
    if (typeof window === 'undefined') return [];
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
  if (typeof window !== 'undefined') {
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updated));
  }
  return newPreset;
};

export const deletePreset = (presetId: string): void => {
  const presets = getSavedPresets();
  const filtered = presets.filter((p) => p.id !== presetId);
  if (typeof window !== 'undefined') {
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(filtered));
  }
};
