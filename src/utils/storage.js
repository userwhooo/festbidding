const STORAGE_VERSION = 1

export const STORAGE_KEYS = {
  version: 'auctionStorageVersion',
  teams: 'auctionTeams',
  transactions: 'auctionTransactions',
  players: 'auctionPlayers',
  gameState: 'auctionGameState',
  activeTab: 'auctionActiveTab',
  liveAuction: 'auctionLiveSession',
}

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    localStorage.setItem(STORAGE_KEYS.version, String(STORAGE_VERSION))
  } catch (err) {
    console.warn('Failed to save auction data:', err)
  }
}

export function clearAuctionStorage() {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key))
}
