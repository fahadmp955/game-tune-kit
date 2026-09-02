import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';

export interface Game {
  id: string;
  name: string;
  bundleId: string;
  apiKey?: string;
}

export interface Cohort {
  id: string;
  name: string;
  description: string;
  estimatedReach: number;
  rules: string[];
}

export interface CampaignItem {
  id: string;
  name: string;
  title: string;
  body: string;
  targetSegmentId?: string;
  data?: Record<string, any>;
  status: 'draft' | 'scheduled' | 'sent';
  sentCount: number;
  successCount: number;
  failedCount: number;
  createdAt: string;
}

interface StudioContextType {
  availableGames: Game[];
  selectedGame: Game;
  setSelectedGame: (game: Game) => void;
  selectGameById: (gameId: string) => void;
  cohorts: Cohort[];
  selectedCohort: string;
  setSelectedCohort: (cohortId: string) => void;
  campaigns: CampaignItem[];
  setCampaigns: React.Dispatch<React.SetStateAction<CampaignItem[]>>;
  isLoading: boolean;
  fetchGameDetails: (game: Game) => Promise<void>;
  createCohort: (newCohort: { name: string; description: string; rules: string[] }) => Promise<boolean>;
}

const initialDefaultGames: Game[] = [
  {
    id: 'game_cyberclash',
    name: 'Cyber Clash 2088',
    bundleId: 'com.gametunekit.cyberclash',
    apiKey: 'gtk_live_cyberclash_8892',
  },
  {
    id: 'game_puzzlequest',
    name: 'Puzzle Quest Saga',
    bundleId: 'com.gametunekit.puzzlequest',
    apiKey: 'gtk_live_puzzlequest_3411',
  },
  {
    id: 'game_realmrpg',
    name: 'Realm of Legends RPG',
    bundleId: 'com.gametunekit.realmrpg',
    apiKey: 'gtk_live_realmrpg_5590',
  },
  {
    id: 'default',
    name: 'Default Game Project',
    bundleId: 'com.gametunekit.default',
    apiKey: 'gtk_live_default_9999',
  },
];

const initialDefaultCohorts: Cohort[] = [
  {
    id: 'cohort_whales',
    name: 'Whales & High VIPs ($100+)',
    description: 'High-value spenders with lifetime spend >= $100',
    estimatedReach: 2450,
    rules: ['attributes.lifetimeSpend >= 100', 'device.isActive == true'],
  },
  {
    id: 'cohort_lapsed',
    name: 'Lapsed Players (7+ Days)',
    description: 'Dormant users inactive for a week or more',
    estimatedReach: 6890,
    rules: ['attributes.daysInactive >= 7', 'device.isActive == true'],
  },
  {
    id: 'cohort_minnows',
    name: 'Engaged Non-Payers (Minnows)',
    description: 'Highly active players who have never made an in-app purchase',
    estimatedReach: 14200,
    rules: ['attributes.lifetimeSpend == 0', 'attributes.level >= 10'],
  },
  {
    id: 'cohort_new_installs',
    name: 'New Install Onboarding (D1 - D3)',
    description: 'Fresh installs navigating initial FTUE and onboarding',
    estimatedReach: 9350,
    rules: ['attributes.daysSinceInstall <= 3', 'device.isActive == true'],
  },
  {
    id: 'cohort_all',
    name: 'All Active Players',
    description: 'Entire active registered player base across all platforms',
    estimatedReach: 48200,
    rules: ['device.isActive == true'],
  },
];

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [availableGames, setAvailableGames] = useState<Game[]>(initialDefaultGames);
  const [selectedGame, setSelectedGame] = useState<Game>(initialDefaultGames[0]);
  const [cohorts, setCohorts] = useState<Cohort[]>(initialDefaultCohorts);
  const [selectedCohort, setSelectedCohort] = useState<string>(initialDefaultCohorts[0].id);
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchGameDetails = useCallback(async (game: Game) => {
    if (!game || !game.id || game.id === 'loading') return;
    setIsLoading(true);

    const headers: Record<string, string> = {};
    if (game.apiKey) {
      headers['X-Game-Key'] = game.apiKey;
    }

    try {
      // 1. Fetch live segments
      const segmentsRes = await fetch(`${API_BASE_URL}/segments`, { headers });
      if (segmentsRes.ok) {
        const data = await segmentsRes.json();
        if (Array.isArray(data)) {
          const defaultReaches: Record<string, number> = {
            'All Active Players': 48200,
            'Whales & High VIPs ($100+)': 2450,
            'Lapsed Players (7+ Days)': 6890,
            'Engaged Non-Payers (Minnows)': 14200,
            'New Install Onboarding (D1 - D3)': 9350,
          };

          const liveCohorts: Cohort[] = data.map((s: any) => ({
            id: s.id,
            name: s.name,
            description: s.description || 'Live Segment',
            estimatedReach: s.cachedReach || defaultReaches[s.name] || 1500,
            rules: Array.isArray(s.rules) && s.rules.length > 0
              ? s.rules.map((r: any) => `${r.field} ${r.operator} ${r.value}`)
              : ['device.isActive == true'],
          }));

          setCohorts(liveCohorts);
          if (liveCohorts.length > 0) {
            setSelectedCohort(liveCohorts[0].id);
          }
        }
      }

      // 2. Fetch live campaigns
      const campaignsRes = await fetch(`${API_BASE_URL}/campaigns`, { headers });
      if (campaignsRes.ok) {
        const campaignData = await campaignsRes.json();
        if (Array.isArray(campaignData)) {
          setCampaigns(campaignData);
        }
      }
    } catch (err) {
      console.warn('[StudioContext] Error fetching game details:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectGameById = useCallback((gameId: string) => {
    const found = availableGames.find((g) => g.id === gameId);
    if (found) {
      setSelectedGame(found);
      fetchGameDetails(found);
    }
  }, [availableGames, fetchGameDetails]);

  // Initial load of games
  useEffect(() => {
    let isMounted = true;
    fetch(`${API_BASE_URL}/games`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: any[]) => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          const gameList: Game[] = data.map((g) => ({
            id: g.id,
            name: g.name,
            bundleId: g.bundleId,
            apiKey: g.apiKey,
          }));
          setAvailableGames(gameList);
          const initial = gameList[0];
          setSelectedGame(initial);
          fetchGameDetails(initial);
        } else {
          // Fallback if games endpoint returned empty
          const fallback: Game = {
            id: 'default',
            name: 'Default Game Project',
            bundleId: 'com.gametunekit.default',
            apiKey: 'gtk_live_default_9999',
          };
          setAvailableGames([fallback]);
          setSelectedGame(fallback);
        }
      })
      .catch((err) => {
        console.warn('[StudioContext] Failed to load games:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [fetchGameDetails]);

  const createCohort = async (newCohort: { name: string; description: string; rules: string[] }): Promise<boolean> => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (selectedGame.apiKey) {
        headers['X-Game-Key'] = selectedGame.apiKey;
      }

      const parsedRules = newCohort.rules.map((r) => {
        const parts = r.split(' ');
        return {
          field: parts[0] || 'device.isActive',
          operator: parts[1] || '==',
          value: parts[2] !== undefined ? (parts[2] === 'true' ? true : isNaN(Number(parts[2])) ? parts[2] : Number(parts[2])) : true,
        };
      });

      const res = await fetch(`${API_BASE_URL}/segments`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: newCohort.name,
          description: newCohort.description,
          combinator: 'AND',
          rules: parsedRules,
        }),
      });

      if (res.ok) {
        await fetchGameDetails(selectedGame);
        return true;
      }
      return false;
    } catch (e) {
      console.error('[StudioContext] Failed to create cohort:', e);
      return false;
    }
  };

  return (
    <StudioContext.Provider
      value={{
        availableGames,
        selectedGame,
        setSelectedGame,
        selectGameById,
        cohorts,
        selectedCohort,
        setSelectedCohort,
        campaigns,
        setCampaigns,
        isLoading,
        fetchGameDetails,
        createCohort,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = (): StudioContextType => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
};
