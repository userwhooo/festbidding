import { useState, useEffect } from 'react'
import { Plus, Minus, RotateCcw } from 'lucide-react'
import { STORAGE_KEYS, loadJSON, saveJSON } from '../utils/storage'

const EMPTY_SESSION = {
  playerName: '',
  basePrice: '',
  currentBid: 0,
  currentBidderId: null,
  timerActive: false,
  timeLeft: 60,
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
    timerActive: Boolean(saved.timerActive),
    timeLeft: typeof saved.timeLeft === 'number' ? saved.timeLeft : 60,
  }
}

export default function AuctionPanel({ teams, onPlayerSold, onPlayerUnsold }) {
  const [playerName, setPlayerName] = useState(() => {
    const s = loadLiveSession(teams)
    return s.playerName
  })
  const [basePrice, setBasePrice] = useState(() => loadLiveSession(teams).basePrice)
  const [currentBid, setCurrentBid] = useState(() => loadLiveSession(teams).currentBid)
  const [currentBidder, setCurrentBidder] = useState(() => loadLiveSession(teams).currentBidder)
  const [soldToTeam, setSoldToTeam] = useState(() => loadLiveSession(teams).currentBidder)
  const [timerActive, setTimerActive] = useState(() => loadLiveSession(teams).timerActive)
  const [timeLeft, setTimeLeft] = useState(() => loadLiveSession(teams).timeLeft)
  const [showSoldAnimation, setShowSoldAnimation] = useState(false)

  // Re-link bidder after refresh once teams are available
  useEffect(() => {
    if (currentBidder) return
    const saved = loadJSON(STORAGE_KEYS.liveAuction, null)
    if (!saved?.currentBidderId) return
    const team = teams.find((t) => t.id === saved.currentBidderId)
    if (team) {
      setCurrentBidder(team)
      setSoldToTeam(team)
    }
  }, [teams, currentBidder])

  // Persist in-progress auction so refresh does not lose current player
  useEffect(() => {
    saveJSON(STORAGE_KEYS.liveAuction, {
      playerName,
      basePrice,
      currentBid,
      currentBidderId: currentBidder?.id || null,
      timerActive,
      timeLeft,
    })
  }, [playerName, basePrice, currentBid, currentBidder, timerActive, timeLeft])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Don't trigger shortcuts when typing in input/textarea
      const isInputElement = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA'
      
      if (e.code === 'Space' && !isInputElement) {
        e.preventDefault()
        increaseBid(50)
      } else if (e.code === 'Backspace' && !isInputElement) {
        e.preventDefault()
        decreaseBid(50)
      } else if (e.code === 'Enter' && !isInputElement) {
        e.preventDefault()
        handleSold()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentBid, soldToTeam, playerName])

  // Timer logic
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [timerActive, timeLeft])

  const startAuction = () => {
    if (!playerName.trim() || !basePrice) {
      alert('Please enter player name and base price')
      return
    }
    setCurrentBid(parseInt(basePrice))
    setCurrentBidder(null)
    setSoldToTeam(null)
    setTimeLeft(60)
    setTimerActive(true)
  }

  const increaseBid = (amount) => {
    if (!timerActive || timeLeft <= 0) return
    setCurrentBid(prev => prev + amount)
  }

  const decreaseBid = (amount) => {
    if (!timerActive || timeLeft <= 0) return
    setCurrentBid(prev => Math.max(parseInt(basePrice), prev - amount))
  }

  const handleBidderSelect = (team) => {
    if (!timerActive || timeLeft <= 0) return
    setCurrentBidder(team)
    setSoldToTeam(team)
  }

  const handleSold = () => {
    if (!playerName.trim() || !currentBidder) {
      alert('Please select a player and bidder')
      return
    }
    setShowSoldAnimation(true)
    setTimeout(() => {
      onPlayerSold(playerName, currentBid, currentBidder)
      resetAuction()
      setShowSoldAnimation(false)
    }, 600)
  }

  const handleUnsold = () => {
    if (!playerName.trim()) {
      alert('Please enter a player name')
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
    setSoldToTeam(null)
    setTimerActive(false)
    setTimeLeft(60)
    saveJSON(STORAGE_KEYS.liveAuction, EMPTY_SESSION)
  }

  const handleManualPriceEdit = (value) => {
    const price = parseInt(value) || 0
    if (price >= parseInt(basePrice)) {
      setCurrentBid(price)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Auction Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Panel - Player Input */}
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
                    disabled={timerActive}
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
                    disabled={timerActive}
                    className="w-full bg-dark-700 border border-gold/30 rounded px-3 py-2 text-white disabled:opacity-50 focus:outline-none focus:border-neon-green"
                  />
                </div>

                <button
                  onClick={startAuction}
                  disabled={timerActive}
                  className="w-full bg-neon-green/30 hover:bg-neon-green/50 disabled:opacity-50 text-neon-green font-bold py-2 px-4 rounded transition-all duration-200"
                >
                  🎯 Start Auction
                </button>
              </div>
            </div>
          </div>

          {/* Center Panel - Current Bid Display */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {/* Timer */}
            <div className={`glow-card bg-dark-800/50 p-6 text-center ${timeLeft <= 10 && timerActive ? 'border-red-500/50' : ''}`}>
              <div className="text-sm text-gray-400 mb-2">TIMER</div>
              <div className={`text-5xl font-bold ${timeLeft <= 10 && timerActive ? 'text-red-500 animate-pulse' : 'text-neon-green'}`}>
                {String(timeLeft).padStart(2, '0')}s
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setTimerActive(!timerActive)}
                  disabled={!timerActive && timeLeft === 60}
                  className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 disabled:opacity-50 text-blue-300 font-bold py-1 px-2 rounded text-sm transition-all duration-200"
                >
                  {timerActive ? '⏸' : '▶'}
                </button>
                <button
                  onClick={() => setTimeLeft(60)}
                  className="flex-1 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 font-bold py-1 px-2 rounded text-sm transition-all duration-200"
                >
                  ⟲ Reset
                </button>
              </div>
            </div>

            {/* Current Bid */}
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
                disabled={!timerActive}
              />
            </div>

            {/* Current Bidder */}
            <div className="glow-card bg-dark-800/50 p-6 text-center">
              <div className="text-sm text-gray-400 mb-2">HIGHEST BIDDER</div>
              <div className={`text-2xl font-bold ${currentBidder ? 'text-neon-green' : 'text-gray-400'}`}>
                {currentBidder ? `${currentBidder.icon} ${currentBidder.name}` : 'No Bid'}
              </div>
            </div>
          </div>

          {/* Right Panel - Bid Controls */}
          <div className="lg:col-span-1">
            <div className="glow-card bg-dark-800/50 p-6">
              <h3 className="text-lg font-bold mb-4 text-neon-green">💰 Bid Controls</h3>

              <div className="grid grid-cols-2 gap-2 mb-6">
                <button
                  onClick={() => increaseBid(50)}
                  disabled={!timerActive}
                  className="bg-neon-green/20 hover:bg-neon-green/40 disabled:opacity-50 text-neon-green font-bold py-2 px-3 rounded transition-all duration-200 flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> +50
                </button>
                <button
                  onClick={() => increaseBid(100)}
                  disabled={!timerActive}
                  className="bg-neon-green/20 hover:bg-neon-green/40 disabled:opacity-50 text-neon-green font-bold py-2 px-3 rounded transition-all duration-200 flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> +100
                </button>
                <button
                  onClick={() => increaseBid(500)}
                  disabled={!timerActive}
                  className="bg-neon-green/20 hover:bg-neon-green/40 disabled:opacity-50 text-neon-green font-bold py-2 px-3 rounded transition-all duration-200 flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> +500
                </button>
                <button
                  onClick={() => increaseBid(1000)}
                  disabled={!timerActive}
                  className="bg-neon-green/20 hover:bg-neon-green/40 disabled:opacity-50 text-neon-green font-bold py-2 px-3 rounded transition-all duration-200 flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> +1K
                </button>
                <button
                  onClick={() => decreaseBid(50)}
                  disabled={!timerActive}
                  className="bg-red-500/20 hover:bg-red-500/40 disabled:opacity-50 text-red-400 font-bold py-2 px-3 rounded transition-all duration-200 flex items-center justify-center gap-1"
                >
                  <Minus className="w-4 h-4" /> -50
                </button>
                <button
                  onClick={() => decreaseBid(100)}
                  disabled={!timerActive}
                  className="bg-red-500/20 hover:bg-red-500/40 disabled:opacity-50 text-red-400 font-bold py-2 px-3 rounded transition-all duration-200 flex items-center justify-center gap-1"
                >
                  <Minus className="w-4 h-4" /> -100
                </button>
                <button
                  onClick={() => decreaseBid(500)}
                  disabled={!timerActive}
                  className="bg-red-500/20 hover:bg-red-500/40 disabled:opacity-50 text-red-400 font-bold py-2 px-3 rounded transition-all duration-200 flex items-center justify-center gap-1"
                >
                  <Minus className="w-4 h-4" /> -500
                </button>
                <button
                  onClick={() => decreaseBid(1000)}
                  disabled={!timerActive}
                  className="bg-red-500/20 hover:bg-red-500/40 disabled:opacity-50 text-red-400 font-bold py-2 px-3 rounded transition-all duration-200 flex items-center justify-center gap-1"
                >
                  <Minus className="w-4 h-4" /> -1K
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Team Selection for Sold */}
        {timerActive && (
          <div className="glow-card bg-dark-800/50 p-6 mb-8">
            <h3 className="text-lg font-bold mb-4 text-neon-green">👥 Select Team</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {teams.map(team => (
                <button
                  key={team.id}
                  onClick={() => handleBidderSelect(team)}
                  className={`glow-card p-4 text-center transition-all duration-200 ${
                    currentBidder?.id === team.id
                      ? 'border-neon-green/80 bg-neon-green/20'
                      : 'border-gold/20 hover:border-gold/50'
                  }`}
                >
                  <div className="text-3xl mb-2">{team.icon}</div>
                  <div className="font-bold text-sm mb-1">{team.name}</div>
                  <div className="text-xs text-gray-400">{team.balance.toLocaleString()}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={handleSold}
            disabled={!timerActive || !currentBidder || !playerName}
            className="flex-1 bg-gradient-to-r from-neon-green to-neon-blue hover:shadow-lg hover:shadow-neon-green/50 disabled:opacity-50 text-dark-900 font-bold py-4 px-6 rounded-lg text-lg transition-all duration-200 hammer-animation"
          >
            🔨 SOLD
          </button>
          <button
            onClick={handleUnsold}
            disabled={!timerActive || !playerName}
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
