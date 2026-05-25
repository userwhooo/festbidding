import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import AuctionPanel from './AuctionPanel'
import TeamDashboard from './TeamDashboard'
import AuctionHistory from './AuctionHistory'
import Leaderboard from './Leaderboard'
import ExportData from './ExportData'
import { STORAGE_KEYS, loadJSON, saveJSON } from '../utils/storage'

export default function AuctionManager({ teams, setTeams, transactions, setTransactions, players, setPlayers, onReset }) {
  const [activeTab, setActiveTab] = useState(() => loadJSON(STORAGE_KEYS.activeTab, 'auction'))
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    saveJSON(STORAGE_KEYS.activeTab, activeTab)
  }, [activeTab])

  const handlePlayerSold = (playerName, soldPrice, soldToTeam) => {
    const transaction = {
      id: Math.random().toString(36).substr(2, 9),
      playerName,
      soldPrice,
      soldTo: soldToTeam.name,
      soldToId: soldToTeam.id,
      timestamp: new Date().toLocaleString(),
      status: 'Sold',
    }

    // Update team balance
    const updatedTeams = teams.map(team => {
      if (team.id === soldToTeam.id) {
        return {
          ...team,
          balance: team.balance - soldPrice,
          playersBought: [...team.playersBought, { name: playerName, price: soldPrice }],
          totalSpent: team.totalSpent + soldPrice,
        }
      }
      return team
    })

    setTeams(updatedTeams)
    setTransactions([...transactions, transaction])
    setPlayers([...players, { name: playerName, price: soldPrice, team: soldToTeam.name }])

    // Play sound
    playAuctionSound('sold')
  }

  const handlePlayerUnsold = (playerName) => {
    const transaction = {
      id: Math.random().toString(36).substr(2, 9),
      playerName,
      soldPrice: 0,
      soldTo: 'Unsold',
      timestamp: new Date().toLocaleString(),
      status: 'Unsold',
    }
    setTransactions([...transactions, transaction])
    playAuctionSound('unsold')
  }

  const playAuctionSound = (type) => {
    // Create simple beep sounds
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    if (type === 'sold') {
      oscillator.frequency.value = 800
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } else {
      oscillator.frequency.value = 400
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }

  return (
    <div className={`flex bg-dark-900 text-white ${fullscreen ? 'fixed inset-0 z-50 h-screen' : 'min-h-screen'}`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-dark-800 border-r border-gold/20 transition-all duration-300 overflow-hidden flex flex-col`}>
        <div className="p-4 border-b border-gold/20">
          <h2 className="text-xl font-bold text-neon-green">MANCHI FEST</h2>
          <p className="text-xs text-gray-400">SEASON 2</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'auction', label: '🎯 Live Auction', icon: '🔨' },
            { id: 'teams', label: '👥 Teams', icon: '👑' },
            { id: 'history', label: '📋 History', icon: '📊' },
            { id: 'leaderboard', label: '🏆 Leaderboard', icon: '⭐' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-2 rounded transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-neon-green/20 text-neon-green border border-neon-green/50'
                  : 'hover:bg-dark-700 text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-gold/20 p-4 space-y-2">
          <ExportData teams={teams} transactions={transactions} players={players} />
          <button
            onClick={toggleFullscreen}
            className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-semibold py-2 px-3 rounded text-sm transition-all duration-200"
          >
            {fullscreen ? '↙️ Exit Fullscreen' : '⛶ Fullscreen'}
          </button>
          <button
            onClick={onReset}
            className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-2 px-3 rounded text-sm transition-all duration-200"
          >
            🔄 Reset Tournament
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-dark-800 border-b border-gold/20 p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-dark-700 rounded transition-all duration-200"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className="text-2xl font-bold text-neon-green flex-1 text-center">
            MANCHI FEST 2026 - SEASON 2
          </h1>
          <div className="text-sm text-gray-400">
            {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'auction' && (
            <AuctionPanel
              teams={teams}
              onPlayerSold={handlePlayerSold}
              onPlayerUnsold={handlePlayerUnsold}
            />
          )}
          {activeTab === 'teams' && <TeamDashboard teams={teams} />}
          {activeTab === 'history' && <AuctionHistory transactions={transactions} teams={teams} />}
          {activeTab === 'leaderboard' && <Leaderboard teams={teams} transactions={transactions} />}
        </div>
      </div>
    </div>
  )
}
