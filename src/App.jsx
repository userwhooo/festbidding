import { useState, useEffect } from 'react'
import TeamSetup from './components/TeamSetup'
import AuctionManager from './components/AuctionManager'
import './App.css'
import { STORAGE_KEYS, loadJSON, saveJSON, clearAuctionStorage } from './utils/storage'

function getInitialGameState() {
  const teams = loadJSON(STORAGE_KEYS.teams, [])
  return teams.length > 0 ? 'auction' : 'setup'
}

export default function App() {
  const [gameState, setGameState] = useState(getInitialGameState)
  const [teams, setTeams] = useState(() => loadJSON(STORAGE_KEYS.teams, []))
  const [transactions, setTransactions] = useState(() => loadJSON(STORAGE_KEYS.transactions, []))
  const [players, setPlayers] = useState(() => loadJSON(STORAGE_KEYS.players, []))

  useEffect(() => {
    if (teams.length > 0) {
      saveJSON(STORAGE_KEYS.teams, teams)
      saveJSON(STORAGE_KEYS.gameState, gameState)
    }
  }, [teams, gameState])

  useEffect(() => {
    if (gameState === 'auction') {
      saveJSON(STORAGE_KEYS.transactions, transactions)
      saveJSON(STORAGE_KEYS.players, players)
      saveJSON(STORAGE_KEYS.gameState, gameState)
    }
  }, [transactions, players, gameState])

  const handleTeamsSetup = (setupTeams) => {
    setTeams(setupTeams)
    setTransactions([])
    setPlayers([])
    setGameState('auction')
    saveJSON(STORAGE_KEYS.teams, setupTeams)
    saveJSON(STORAGE_KEYS.gameState, 'auction')
    saveJSON(STORAGE_KEYS.transactions, [])
    saveJSON(STORAGE_KEYS.players, [])
    saveJSON(STORAGE_KEYS.liveAuction, {
      playerName: '',
      basePrice: '',
      currentBid: 0,
      currentBidderId: null,
      timerActive: false,
      timeLeft: 60,
    })
  }

  const handleResetTournament = () => {
    if (confirm('Are you sure you want to reset the entire tournament? This cannot be undone.')) {
      clearAuctionStorage()
      setTeams([])
      setTransactions([])
      setPlayers([])
      setGameState('setup')
    }
  }

  return (
    <div className="w-full relative z-10">
      {gameState === 'setup' ? (
        <TeamSetup onSetupComplete={handleTeamsSetup} />
      ) : (
        <AuctionManager
          teams={teams}
          setTeams={setTeams}
          transactions={transactions}
          setTransactions={setTransactions}
          players={players}
          setPlayers={setPlayers}
          onReset={handleResetTournament}
        />
      )}
    </div>
  )
}
