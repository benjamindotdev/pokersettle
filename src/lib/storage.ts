import type { Game } from "@/types/poker";

const STORAGE_KEY = "pokersettle:v1";
const LEGACY_STORAGE_KEY = "poker-settler:v1";

interface PersistedState {
  games: Game[];
  activeGameId: string | null;
}

const empty: PersistedState = { games: [], activeGameId: null };

export function loadState(): PersistedState {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // One-time migration from the old key.
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacy) {
        localStorage.setItem(STORAGE_KEY, legacy);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
        raw = legacy;
      }
    }
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as PersistedState;
    if (!parsed || !Array.isArray(parsed.games)) return empty;
    return parsed;
  } catch {
    return empty;
  }
}

export function saveState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota / private mode errors
  }
}

export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
}
