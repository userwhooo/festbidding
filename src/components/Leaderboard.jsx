import { useMemo } from 'react'
import { Trophy, TrendingUp, Users } from 'lucide-react'

export default function Leaderboard({ teams, transactions }) {
  // Calculate rankings
  const rankings = useMemo(() => {
    const teamStats = teams.map(team => ({
      ...team,
      mostSpent: team.totalSpent,
      highestBalance: team.balance,
      mostPlayers: team.playersBought.length,
      avgPrice: team.playersBought.length > 0 ? team.totalSpent / team.playersBought.length : 0,
    }))

    const mostSpent = [...teamStats].sort((a, b) => b.mostSpent - a.mostSpent)
    const highestBalance = [...teamStats].sort((a, b) => b.highestBalance - a.highestBalance)
    const mostPlayers = [...teamStats].sort((a, b) => b.mostPlayers - a.mostPlayers)
    const avgPrice = [...teamStats].sort((a, b) => b.avgPrice - a.avgPrice)

    return { mostSpent, highestBalance, mostPlayers, avgPrice }
  }, [teams])

  const RankingCard = ({ title, icon, data, metric, suffix = '' }) => (
    <div className="glow-card bg-dark-800/50 p-6">
      <h3 className="text-lg font-bold mb-4 text-neon-green flex items-center gap-2">
        {icon} {title}
      </h3>
      <div className="space-y-3">
        {data.map((team, idx) => (
          <div key={team.id} className="flex items-center justify-between p-3 bg-dark-700/50 rounded">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/20 text-gold font-bold">
                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
              </div>
              <div>
                <div className="font-bold text-white flex items-center gap-1">
                  <span className="text-2xl">{team.icon}</span>
                  {team.name}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gold">
                {team[metric].toLocaleString()}
                {suffix}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-neon-green flex items-center gap-2">
          <Trophy className="w-8 h-8" /> Leaderboard
        </h2>
        <p className="text-gray-400 mb-8">Live tournament standings and statistics</p>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glow-card bg-dark-800/50 p-6 text-center">
            <div className="text-sm text-gray-400 mb-2">Total Players Sold</div>
            <div className="text-3xl font-bold text-neon-green">
              {teams.reduce((sum, t) => sum + t.playersBought.length, 0)}
            </div>
          </div>
          <div className="glow-card bg-dark-800/50 p-6 text-center">
            <div className="text-sm text-gray-400 mb-2">Total Amount Spent</div>
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
          <div className="glow-card bg-dark-800/50 p-6 text-center">
            <div className="text-sm text-gray-400 mb-2">Avg Price / Player</div>
            <div className="text-3xl font-bold text-neon-green">
              {teams.length > 0
                ? Math.round(
                    teams.reduce((sum, t) => sum + t.totalSpent, 0) /
                      Math.max(1, teams.reduce((sum, t) => sum + t.playersBought.length, 0))
                  ).toLocaleString()
                : '0'}
            </div>
          </div>
        </div>

        {/* Rankings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RankingCard
            title="Most Money Spent"
            icon="💰"
            data={rankings.mostSpent}
            metric="mostSpent"
          />
          <RankingCard
            title="Highest Remaining Balance"
            icon="💸"
            data={rankings.highestBalance}
            metric="highestBalance"
          />
          <RankingCard
            title="Most Players Purchased"
            icon="👥"
            data={rankings.mostPlayers}
            metric="mostPlayers"
            suffix=""
          />
          <RankingCard
            title="Highest Average Price"
            icon="📈"
            data={rankings.avgPrice}
            metric="avgPrice"
          />
        </div>

        {/* Detailed Stats Table */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4 text-neon-green">📊 Detailed Statistics</h3>
          <div className="glow-card bg-dark-800/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold/20 bg-dark-700/50">
                    <th className="px-6 py-3 text-left text-sm font-bold text-neon-green">Team</th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-neon-green">Players</th>
                    <th className="px-6 py-3 text-right text-sm font-bold text-neon-green">Total Spent</th>
                    <th className="px-6 py-3 text-right text-sm font-bold text-neon-green">Balance</th>
                    <th className="px-6 py-3 text-right text-sm font-bold text-neon-green">Avg Price</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.mostSpent.map((team, idx) => (
                    <tr
                      key={team.id}
                      className={`border-b border-gold/10 hover:bg-dark-700/30 transition-all duration-200 ${
                        idx % 2 === 0 ? 'bg-dark-800/30' : 'bg-dark-900/30'
                      }`}
                    >
                      <td className="px-6 py-4 text-white font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{team.icon}</span>
                          {team.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-neon-green font-bold">
                        {team.mostPlayers}
                      </td>
                      <td className="px-6 py-4 text-right text-gold font-bold">
                        {team.totalSpent.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-neon-blue font-bold">
                        {team.balance.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-neon-green font-bold">
                        {team.mostPlayers > 0
                          ? Math.round(team.totalSpent / team.mostPlayers).toLocaleString()
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
