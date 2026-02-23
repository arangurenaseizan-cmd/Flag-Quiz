import { Country, countries } from './data';

export type GameMode = 'adventure' | 'timed' | 'survival' | 'multiplayer' | 'daily';

export interface UserState {
  xp: number;
  level: number;
  coins: number;
  totalCoins: number;
  streak: number;
  lastLogin: string;
  unlockedContinents: string[];
  achievements: string[];
  unlockedAvatars: string[];
  username: string;
  isDarkMode: boolean;
  bestSurvivalStreak: number;
  dailyChallengesCompleted: number;
  avatar: {
    base: string;
    accessory: string;
  };
}

export const INITIAL_USER_STATE: UserState = {
  xp: 0,
  level: 1,
  coins: 100,
  totalCoins: 100,
  streak: 0,
  lastLogin: new Date().toISOString(),
  unlockedContinents: ['Europe'],
  achievements: [],
  unlockedAvatars: ['role-1'],
  username: 'Explorador',
  isDarkMode: false,
  bestSurvivalStreak: 0,
  dailyChallengesCompleted: 0,
  avatar: {
    base: 'char-1',
    accessory: 'role-1'
  }
};

export const getXPForLevel = (level: number) => level * 500;

export const getRandomCountries = (count: number, excludeId?: string, continent?: string): Country[] => {
  let filtered = continent 
    ? countries.filter(c => c.continent === continent)
    : countries;
  
  if (excludeId) {
    filtered = filtered.filter(c => c.id !== excludeId);
  }

  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getDailyChallenge = (): Country[] => {
  // Deterministic daily challenge based on date
  const today = new Date().toDateString();
  const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const shuffled = [...countries].sort((a, b) => {
    const valA = (a.id.charCodeAt(0) + seed) % 100;
    const valB = (b.id.charCodeAt(0) + seed) % 100;
    return valA - valB;
  });
  return shuffled.slice(0, 5);
};
