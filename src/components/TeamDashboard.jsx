import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function TeamDashboard({ teams }) {
  const [expandedTeams, setExpandedTeams] = useState({})

  const toggleTeam = (teamId) => {
    setExpandedTeams(prev => ({
      ...prev,
      [teamId]: !prev[teamId]
    }))
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-neon-green">👥 Team Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map(team => (
            <div key={team.id} className="glow-card bg-dark-800/50 overflow-hidden">
              {/* Team Header */}
              <button
                onClick={() => toggleTeam(team.id)}
                className="w-full p-6 text-left hover:bg-dark-700/50 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-4xl">{team.icon}</span>
                      <h3 className="text-xl font-bold text-neon-green">{team.name}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-dark-700/50 p-3 rounded">
                        <div className="text-xs text-gray-400 mb-1">Remaining Balance</div>
                        <div className="text-lg font-bold text-gold">{team.balance.toLocaleString()}</div>
                      </div>
                      <div className="bg-dark-700/50 p-3 rounded">
                        <div className="text-xs text-gray-400 mb-1">Players Bought</div>
                        <div className="text-lg font-bold text-neon-green">{team.playersBought.length}</div>
                      </div>
                      <div className="bg-dark-700/50 p-3 rounded col-span-2">
                        <div className="text-xs text-gray-400 mb-1">Total Spent</div>
                        <div className="text-lg font-bold text-neon-blue">{team.totalSpent.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {expandedTeams[team.id] ? (
                      <ChevronUp className="w-6 h-6 text-gold" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gold" />
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded Players List */}
              {expandedTeams[team.id] && (
                <div className="border-t border-gold/20 p-6">
                  {team.playersBought.length > 0 ? (
                    <div className="space-y-2">
                      <h4 className="font-bold text-sm text-gray-300 mb-3">PURCHASED PLAYERS</h4>
                      {team.playersBought.map((player, idx) => (
                        <div
                          key={idx}
                          className="bg-dark-700/50 p-3 rounded flex justify-between items-center"
                        >
                          <span className="font-medium text-white">{player.name}</span>
                          <span className="text-gold font-bold">{player.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-4">
                      No players purchased yet
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glow-card bg-dark-800/50 p-6 text-center">
            <div className="text-sm text-gray-400 mb-2">Total Teams</div>
            <div className="text-3xl font-bold text-neon-green">{teams.length}</div>
          </div>
          <div className="glow-card bg-dark-800/50 p-6 text-center">
            <div className="text-sm text-gray-400 mb-2">Total Players Sold</div>
            <div className="text-3xl font-bold text-neon-green">
              {teams.reduce((sum, t) => sum + t.playersBought.length, 0)}
            </div>
          </div>
          <div className="glow-card bg-dark-800/50 p-6 text-center">
            <div className="text-sm text-gray-400 mb-2">Total Spent</div>
            <div className="text-3xl font-bold text-gold">
              {teams.reduce((sum, t) => sum + t.totalSpent, 0).toLocaleString()}
            </div>
          </div>
          <div className="glow-card bg-dark-800/50 p-6 text-center">
            <div className="text-sm text-gray-400 mb-2">Remaining Balance</div>
            <div className="text-3xl font-bold text-neon-blue">
              {teams.reduce((sum, t) => sum + t.balance, 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
