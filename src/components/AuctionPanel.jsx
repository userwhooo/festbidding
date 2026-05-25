import { useState, useEffect } from 'react'
import { Plus, Minus, RotateCcw } from 'lucide-react'
import { STORAGE_KEYS, loadJSON, saveJSON } from '../utils/storage'
import {
  MAX_TEAM_SPEND,
  canTeamBuyAtPrice,
  getSpendLimitMessage,
  getSpendRemaining,
  getTeamSpent,
} from '../utils/constants'

const EMPTY_SESSION = {
  playerName: '',
  basePrice: '',
  currentBid: 0,
  currentBidderId: null,
  auctionActive: false,
}

function loadLiveSession(teams) {
  const saved = loadJSON(STORAGE_KEYS.liveAuction, null)
  if (!saved) return { ...EMPTY_SESSION, currentBidder: null }

  const currentBidder = saved.currentBidderId
    ? teams.find((t) => t.id === saved.currentBidderId) || null
    : null

  return {
    playerName: saved.playerName || '',
    basePrice: saved.basePrice || '',
    currentBid: saved.currentBid || 0,
    currentBidder,
    auctionActive: Boolean(saved.auctionActive),
  }
}

export default function AuctionPanel({ teams, onPlayerSold, onPlayerUnsold }) {
  const initial = loadLiveSession(teams)
  const [playerName, setPlayerName] = useState(initial.playerName)
  const [basePrice, setBasePrice] = useState(initial.basePrice)
  const [currentBid, setCurrentBid] = useState(initial.currentBid)
  const [currentBidder, setCurrentBidder] = useState(initial.currentBidder)
  const [auctionActive, setAuctionActive] = useState(initial.auctionActive)
  const [showSoldAnimation, setShowSoldAnimation] = useState(false)

  useEffect(() => {
    if (currentBidder) return
    const saved = loadJSON(STORAGE_KEYS.liveAuction, null)
    if (!saved?.currentBidderId) return
    const team = teams.find((t) => t.id === saved.currentBidderId)
    if (team) setCurrentBidder(team)
  }, [teams, currentBidder])

  useEffect(() => {
    if (!currentBidder) return
    const team = teams.find((t) => t.id === currentBidder.id) || currentBidder
    if (!canTeamBuyAtPrice(team, currentBid)) {
      setCurrentBidder(null)
    }
  }, [currentBid, teams, currentBidder])

  useEffect(() => {
    saveJSON(STORAGE_KEYS.liveAuction, {
      playerName,
      basePrice,
      currentBid,
      currentBidderId: currentBidder?.id || null,
      auctionActive,
    })
  }, [playerName, basePrice, currentBid, currentBidder, auctionActive])

  useEffect(() => {
    const handleKeyPress = (e) => {
      const isInputElement = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA'
      if (!auctionActive || isInputElement) return

      if (e.code === 'Space') {
        e.preventDefault()
        increaseBid(50)
      } else if (e.code === 'Backspace') {
        e.preventDefault()
        decreaseBid(50)
      } else if (e.code === 'Enter') {
        e.preventDefault()
        handleSold()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [auctionActive, currentBid, currentBidder, playerName])

  const startAuction = () => {
    if (!playerName.trim() || !basePrice) {
      alert('Please enter player name and base price')
      return
    }
    setCurrentBid(parseInt(basePrice))
    setCurrentBidder(null)
    setAuctionActive(true)
  }

  const increaseBid = (amount) => {
    if (!auctionActive) return
    setCurrentBid((prev) => prev + amount)
  }

  const decreaseBid = (amount) => {
    if (!auctionActive) return
    setCurrentBid((prev) => Math.max(parseInt(basePrice) || 0, prev - amount))
  }

  const handleBidderSelect = (team) => {
    if (!auctionActive) return
    if (!canTeamBuyAtPrice(team, currentBid)) {
      alert(getSpendLimitMessage(team, currentBid))
      return
    }
    setCurrentBidder(team)
  }

  const handleSold = () => {
    if (!auctionActive || !playerName.trim() || !currentBidder) {
      alert('Please start the auction, enter a player, and select a team')
      return
    }
    const team = teams.find((t) => t.id === currentBidder.id) || currentBidder
    if (!canTeamBuyAtPrice(team, currentBid)) {
      alert(getSpendLimitMessage(team, currentBid))
      return
    }
    setShowSoldAnimation(true)
    setTimeout(() => {
      const sold = onPlayerSold(playerName, currentBid, team)
      if (sold) resetAuction()
      setShowSoldAnimation(false)
    }, 600)
  }

  const soldDisabled =
    !auctionActive ||
    !currentBidder ||
    !playerName ||
    !canTeamBuyAtPrice(
      teams.find((t) => t.id === currentBidder?.id) || currentBidder,
      currentBid
    )

  const handleUnsold = () => {
    if (!auctionActive || !playerName.trim()) {
      alert('Please start the auction and enter a player name')
      return
    }
    onPlayerUnsold(playerName)
    resetAuction()
  }

  const resetAuction = () => {
    setPlayerName('')
    setBasePrice('')
    setCurrentBid(0)
    setCurrentBidder(null)
    setAuctionActive(false)
    saveJSON(STORAGE_KEYS.liveAuction, EMPTY_SESSION)
  }

  const handleManualPriceEdit = (value) => {
    if (!auctionActive) return
    const price = parseInt(value) || 0
    if (price >= parseInt(basePrice)) {
      setCurrentBid(price)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1 space-y-4">
            <div className="glow-card bg-dark-800/50 p-6">
              <h3 className="text-xl font-bold mb-4 text-neon-green">⚙️ Auction Setup</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Player Name</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter player name"
                    disabled={auctionActive}
                    className="w-full bg-dark-700 border border-gold/30 rounded px-3 py-2 text-white disabled:opacity-50 focus:outline-none focus:border-neon-green"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Base Price</label>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="Enter base price"
                    disabled={auctionActive}
                    className="w-full bg-dark-700 border border-gold/30 rounded px-3 py-2 text-white disabled:opacity-50 focus:outline-none focus:border-neon-green"
                  />
                </div>

                <button
                  onClick={startAuction}
                  disabled={auctionActive || !playerName.trim() || !basePrice}
                  className="w-full bg-neon-green/30 hover:bg-neon-green/50 disabled:opacity-50 text-neon-green font-bold py-2 px-4 rounded transition-all duration-200"
                >
                  🎯 Start Auction
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className={`glow-card bg-gradient-to-br from-gold/20 to-gold/5 p-8 text-center ${showSoldAnimation ? 'sold-animation' : ''}`}>
              <div className="text-sm text-gray-300 mb-2">CURRENT BID</div>
              <div className="text-6xl font-bold text-gold mb-2">
                {currentBid.toLocaleString()}
              </div>
              <input
                type="number"
                value={currentBid}
                onChange={(e) => handleManualPriceEdit(e.target.value)}
                className="w-full bg-dark-700/50 border border-gold/30 rounded px-3 py-2 text-center text-white focus:outline-none focus:border-neon-green text-sm"
                disabled={!auctionActive}
              />
            </div>

            <div className="glow-card bg-dark-800/50 p-6 text-center">
              <div className="text-sm text-gray-400 mb-2">HIGHEST BIDDER</div>
              <div className={`text-2xl font-bold ${currentBidder ? 'text-neon-green' : 'text-gray-400'}`}>
                {currentBidder ? `${currentBidder.icon} ${currentBidder.name}` : 'No Bid'}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="glow-card bg-dark-800/50 p-6">
              <h3 className="text-lg font-bold mb-4 text-neon-green">💰 Bid Controls</h3>

              <div className="grid grid-cols-2 gap-2 mb-6">
                <button
                  onClick={() => increaseBid(50)}
                  disabled={!auctionActive}
                  className="bg-neon-green/20 hover:bg-neon-green/40 disabled:opacity-50 text-neon-green font-bold py-2 px-3 rounded transition-all duration-200 flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> +50
                </button>
                <button
                  onClick={() => increaseBid(100)}
                  disabled={!auctionActive}
                  className="bg-neon-green/20 hover:bg-neon-green/40 disabled:opacity-50 text-neon-green font-bold py-2 px-3 rounded transition-all duration-200 flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> +100
                </button>
                <button
                  onClick={() => increaseBid(500)}
                  disabled={!auctionActive}
                  className="bg-neon-green/20 hover:bg-neon-green/40 disabled:opacity-50 text-neon-green font-bold py-2 px-3 rounded transition-all duration-200 flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> +500
                </button>
                <button
                  onClick={() => increaseBid(1000)}
                  disabled={!auctionActive}
                  className="bg-neon-green/20 hover:bg-neon-green/40 disabled:opacity-50 text-neon-green font-bold py-2 px-3 rounded transition-all duration-200 flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> +1K
                </button>
                <button
                  onClick={() => decreaseBid(50)}
                  disabled={!auctionActive}
                  className="bg-red-500/20 hover:bg-red-500/40 disabled:opacity-50 text-red-400 font-bold py-2 px-3 rounded transition-all duration-200 flex items-center justify-center gap-1"
                >
                  <Minus className="w-4 h-4" /> -50
                </button>
                <button
                  onClick={() => decreaseBid(100)}
                  disabled={!auctionActive}
                  className="bg-red-500/20 hover:bg-red-500/40 disabled:opacity-50 text-red-400 font-bold py-2 px-3 rounded transition-all duration-200 flex items-center justify-center gap-1"
                >
                  <Minus className="w-4 h-4" /> -100
                </button>
                <button
                  onClick={() => decreaseBid(500)}
                  disabled={!auctionActive}
                  className="bg-red-500/20 hover:bg-red-500/40 disabled:opacity-50 text-red-400 font-bold py-2 px-3 rounded transition-all duration-200 flex items-center justify-center gap-1"
                >
                  <Minus className="w-4 h-4" /> -500
                </button>
                <button
                  onClick={() => decreaseBid(1000)}
                  disabled={!auctionActive}
                  className="bg-red-500/20 hover:bg-red-500/40 disabled:opacity-50 text-red-400 font-bold py-2 px-3 rounded transition-all duration-200 flex items-center justify-center gap-1"
                >
                  <Minus className="w-4 h-4" /> -1K
                </button>
              </div>
            </div>
          </div>
        </div>

        {auctionActive && (
          <div className="glow-card bg-dark-800/50 p-6 mb-8">
            <h3 className="text-lg font-bold mb-2 text-neon-green">👥 Select Team</h3>
            <p className="text-xs text-gray-400 mb-4">
              Spending limit: {MAX_TEAM_SPEND.toLocaleString()} per team (total purchases)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {teams.map((team) => {
                const canBuy = canTeamBuyAtPrice(team, currentBid)
                const atLimit = getSpendRemaining(team) === 0
                return (
                  <button
                    key={team.id}
                    onClick={() => handleBidderSelect(team)}
                    disabled={!canBuy}
                    className={`glow-card p-4 text-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                      currentBidder?.id === team.id
                        ? 'border-neon-green/80 bg-neon-green/20'
                        : atLimit
                          ? 'border-red-500/40'
                          : 'border-gold/20 hover:border-gold/50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{team.icon}</div>
                    <div className="font-bold text-sm mb-1">{team.name}</div>
                    <div className="text-xs text-gray-400">
                      Spent {getTeamSpent(team).toLocaleString()} / {MAX_TEAM_SPEND.toLocaleString()}
                    </div>
                    <div className="text-xs text-gold mt-1">
                      {getSpendRemaining(team).toLocaleString()} left
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={handleSold}
            disabled={soldDisabled}
            className="flex-1 bg-gradient-to-r from-neon-green to-neon-blue hover:shadow-lg hover:shadow-neon-green/50 disabled:opacity-50 text-dark-900 font-bold py-4 px-6 rounded-lg text-lg transition-all duration-200 hammer-animation"
          >
            🔨 SOLD
          </button>
          <button
            onClick={handleUnsold}
            disabled={!auctionActive || !playerName}
            className="flex-1 bg-yellow-500/20 hover:bg-yellow-500/40 disabled:opacity-50 text-yellow-400 font-bold py-4 px-6 rounded-lg text-lg transition-all duration-200"
          >
            ❌ UNSOLD
          </button>
          <button
            onClick={resetAuction}
            className="flex-1 bg-gray-500/20 hover:bg-gray-500/40 text-gray-300 font-bold py-4 px-6 rounded-lg text-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" /> RESET
          </button>
        </div>
      </div>
    </div>
  )
}
