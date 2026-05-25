import { useState } from 'react'
import { Trophy, Plus, Minus } from 'lucide-react'

const DEFAULT_TEAMS = [
  'Al Hilal',
  'Sporting Manchi',
  'Dubai Guys',
  'Team Zinda',
  'Banglore Bulls',
]

const DEFAULT_POINTS = 1500

export default function TeamSetup({ onSetupComplete }) {
  const [teamsCount, setTeamsCount] = useState(5)
  const [teams, setTeams] = useState(DEFAULT_TEAMS.map(name => ({ name, points: DEFAULT_POINTS })))

  const handleTeamNameChange = (index, name) => {
    const newTeams = [...teams]
    newTeams[index].name = name
    setTeams(newTeams)
  }

  const handlePointsChange = (index, points) => {
    const newTeams = [...teams]
    newTeams[index].points = parseInt(points) || 0
    setTeams(newTeams)
  }

  const handleAddTeam = () => {
    setTeams([...teams, { name: `Team ${teams.length + 1}`, points: DEFAULT_POINTS }])
    setTeamsCount(teams.length + 1)
  }

  const handleRemoveTeam = () => {
    if (teams.length > 2) {
      setTeams(teams.slice(0, -1))
      setTeamsCount(teams.length - 1)
    }
  }

  const handleStart = () => {
    const setupTeams = teams.map(t => ({
      id: Math.random().toString(36).substr(2, 9),
      name: t.name,
      initialPoints: t.points,
      balance: t.points,
      playersBought: [],
      totalSpent: 0,
      icon: getTeamIcon(t.name),
      color: getTeamColor(t.name),
    }))
    onSetupComplete(setupTeams)
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Trophy className="w-16 h-16 text-gold animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-2 text-neon">
            MANCHI FEST 2026
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gold">SEASON 2</h2>
          <p className="text-gray-400 text-lg">Cricket Auction Management System</p>
        </div>

        {/* Setup Card */}
        <div className="glow-card bg-dark-800/50 p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-neon-green">⚙️</span> Tournament Setup
          </h3>

          {/* Teams List */}
          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map((team, index) => (
                <div key={index} className="glow-card bg-dark-700/50 p-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Team Name</label>
                      <input
                        type="text"
                        value={team.name}
                        onChange={(e) => handleTeamNameChange(index, e.target.value)}
                        className="w-full bg-dark-600 border border-gold/30 rounded px-3 py-2 text-white focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Initial Points</label>
                      <input
                        type="number"
                        value={team.points}
                        onChange={(e) => handlePointsChange(index, e.target.value)}
                        className="w-full bg-dark-600 border border-gold/30 rounded px-3 py-2 text-white focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green/50"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add/Remove Team Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={handleAddTeam}
              className="flex-1 bg-neon-green/20 border border-neon-green hover:bg-neon-green/30 text-neon-green font-bold py-2 px-4 rounded transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" /> Add Team
            </button>
            <button
              onClick={handleRemoveTeam}
              disabled={teams.length <= 2}
              className="flex-1 bg-red-500/20 border border-red-500 hover:bg-red-500/30 disabled:opacity-50 text-red-400 font-bold py-2 px-4 rounded transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Minus className="w-5 h-5" /> Remove Team
            </button>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={teams.length < 2 || teams.some(t => !t.name.trim())}
            className="w-full bg-gradient-to-r from-neon-green to-neon-blue hover:shadow-lg hover:shadow-neon-green/50 disabled:opacity-50 text-dark-900 font-bold py-3 px-6 rounded text-lg transition-all duration-200"
          >
            🎯 Start Auction
          </button>
        </div>

        {/* Info */}
        <div className="glow-card bg-dark-700/30 p-6 text-center text-sm text-gray-300">
          <p>✨ Set up your teams and initial bidding points to begin the auction</p>
        </div>
      </div>
    </div>
  )
}

function getTeamIcon(teamName) {
  const iconMap = {
    'Al Hilal': '👑',
    'Sporting Manchi': '⚽',
    'Dubai Guys': '🏙️',
    'Team Zinda': '🔥',
    'Banglore Bulls': '🐂',
  }
  return iconMap[teamName] || '🏏'
}

function getTeamColor(teamName) {
  const colorMap = {
    'Al Hilal': 'from-purple-500 to-purple-700',
    'Sporting Manchi': 'from-green-500 to-green-700',
    'Dubai Guys': 'from-red-500 to-red-700',
    'Team Zinda': 'from-orange-500 to-orange-700',
    'Banglore Bulls': 'from-yellow-500 to-yellow-700',
  }
  return colorMap[teamName] || 'from-blue-500 to-blue-700'
}
