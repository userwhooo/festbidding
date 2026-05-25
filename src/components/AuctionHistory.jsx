import { useState, useMemo } from 'react'
import { Search, Filter, Download } from 'lucide-react'

export default function AuctionHistory({ transactions, teams }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTeam, setFilterTeam] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('time-desc') // time-desc, price-desc, price-asc

  const filteredTransactions = useMemo(() => {
    let filtered = transactions

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.playerName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Team filter
    if (filterTeam !== 'all') {
      filtered = filtered.filter(t => t.soldToId === filterTeam)
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(t => t.status === filterStatus)
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'time-desc') {
        return new Date(b.timestamp) - new Date(a.timestamp)
      } else if (sortBy === 'time-asc') {
        return new Date(a.timestamp) - new Date(b.timestamp)
      } else if (sortBy === 'price-desc') {
        return b.soldPrice - a.soldPrice
      } else if (sortBy === 'price-asc') {
        return a.soldPrice - b.soldPrice
      }
      return 0
    })

    return filtered
  }, [transactions, searchTerm, filterTeam, filterStatus, sortBy])

  const totalSold = filteredTransactions
    .filter(t => t.status === 'Sold')
    .reduce((sum, t) => sum + t.soldPrice, 0)

  const handleExportCSV = () => {
    const csv = [
      ['Player Name', 'Sold Price', 'Sold To', 'Time', 'Status'],
      ...filteredTransactions.map(t => [
        t.playerName,
        t.soldPrice,
        t.soldTo,
        t.timestamp,
        t.status
      ])
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const link = document.createElement('a')
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    link.download = `auction-history-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-neon-green">📋 Auction History</h2>
          <button
            onClick={handleExportCSV}
            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-bold py-2 px-4 rounded flex items-center gap-2 transition-all duration-200"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="glow-card bg-dark-800/50 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm text-gray-300 mb-2 flex items-center gap-2">
                <Search className="w-4 h-4" /> Player Name
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search player..."
                className="w-full bg-dark-700 border border-gold/30 rounded px-3 py-2 text-white focus:outline-none focus:border-neon-green"
              />
            </div>

            {/* Team Filter */}
            <div>
              <label className="block text-sm text-gray-300 mb-2 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Team
              </label>
              <select
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className="w-full bg-dark-700 border border-gold/30 rounded px-3 py-2 text-white focus:outline-none focus:border-neon-green"
              >
                <option value="all">All Teams</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-dark-700 border border-gold/30 rounded px-3 py-2 text-white focus:outline-none focus:border-neon-green"
              >
                <option value="all">All</option>
                <option value="Sold">Sold</option>
                <option value="Unsold">Unsold</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-dark-700 border border-gold/30 rounded px-3 py-2 text-white focus:outline-none focus:border-neon-green"
              >
                <option value="time-desc">Latest First</option>
                <option value="time-asc">Oldest First</option>
                <option value="price-desc">Highest Price</option>
                <option value="price-asc">Lowest Price</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="glow-card bg-dark-800/50 p-4 text-center">
            <div className="text-sm text-gray-400 mb-1">Total Transactions</div>
            <div className="text-2xl font-bold text-neon-green">{filteredTransactions.length}</div>
          </div>
          <div className="glow-card bg-dark-800/50 p-4 text-center">
            <div className="text-sm text-gray-400 mb-1">Players Sold</div>
            <div className="text-2xl font-bold text-neon-green">
              {filteredTransactions.filter(t => t.status === 'Sold').length}
            </div>
          </div>
          <div className="glow-card bg-dark-800/50 p-4 text-center">
            <div className="text-sm text-gray-400 mb-1">Total Amount</div>
            <div className="text-2xl font-bold text-gold">{totalSold.toLocaleString()}</div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="glow-card bg-dark-800/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold/20 bg-dark-700/50">
                  <th className="px-6 py-3 text-left text-sm font-bold text-neon-green">Player Name</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-neon-green">Sold Price</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-neon-green">Sold To</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-neon-green">Time</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-neon-green">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction, idx) => (
                    <tr
                      key={transaction.id}
                      className={`border-b border-gold/10 hover:bg-dark-700/30 transition-all duration-200 ${
                        idx % 2 === 0 ? 'bg-dark-800/30' : 'bg-dark-900/30'
                      }`}
                    >
                      <td className="px-6 py-4 text-white font-semibold">{transaction.playerName}</td>
                      <td className="px-6 py-4 text-gold font-bold">
                        {transaction.soldPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-white">
                        {transaction.soldTo === 'Unsold' ? (
                          <span className="text-gray-400">—</span>
                        ) : (
                          transaction.soldTo
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">{transaction.timestamp}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            transaction.status === 'Sold'
                              ? 'bg-neon-green/20 text-neon-green'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
