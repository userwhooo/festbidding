import { Download } from 'lucide-react'

export default function ExportData({ teams, transactions, players }) {
  const exportAsJSON = () => {
    const data = {
      tournament: 'MANCHI FEST 2026 - SEASON 2',
      exportDate: new Date().toISOString(),
      teams,
      transactions,
      players,
    }
    const json = JSON.stringify(data, null, 2)
    const link = document.createElement('a')
    link.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(json)
    link.download = `auction-data-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  const exportAsCSV = () => {
    const headers = ['Player Name', 'Sold Price', 'Sold To', 'Time', 'Status']
    const rows = transactions.map(t => [
      t.playerName,
      t.soldPrice,
      t.soldTo,
      t.timestamp,
      t.status,
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n')

    const link = document.createElement('a')
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    link.download = `auction-history-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const exportAsHTML = () => {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>MANCHI FEST 2026 - Auction Report</title>
  <style>
    body { font-family: Arial, sans-serif; background: #111827; color: white; padding: 20px; }
    h1, h2 { color: #39ff14; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; background: #1f2937; }
    th, td { border: 1px solid #374151; padding: 12px; text-align: left; }
    th { background: #374151; color: #ffd700; font-weight: bold; }
    tr:nth-child(even) { background: #111827; }
    .team { margin: 20px 0; padding: 15px; border: 1px solid #ffd700; border-radius: 5px; }
    .stat { display: inline-block; margin-right: 30px; }
  </style>
</head>
<body>
  <h1>🏏 MANCHI FEST 2026 - SEASON 2</h1>
  <p>Cricket Auction Report - Generated on ${new Date().toLocaleString()}</p>
  
  <h2>📊 Summary</h2>
  <div class="stat"><strong>Total Teams:</strong> ${teams.length}</div>
  <div class="stat"><strong>Total Players Sold:</strong> ${teams.reduce((sum, t) => sum + t.playersBought.length, 0)}</div>
  <div class="stat"><strong>Total Amount Spent:</strong> ${teams.reduce((sum, t) => sum + t.totalSpent, 0).toLocaleString()}</div>
  
  <h2>👥 Team Details</h2>
  ${teams.map(team => `
    <div class="team">
      <h3>${team.icon} ${team.name}</h3>
      <p><strong>Initial Points:</strong> ${team.initialPoints.toLocaleString()}</p>
      <p><strong>Remaining Balance:</strong> ${team.balance.toLocaleString()}</p>
      <p><strong>Total Spent:</strong> ${team.totalSpent.toLocaleString()}</p>
      <p><strong>Players Purchased:</strong> ${team.playersBought.length}</p>
      ${team.playersBought.length > 0 ? `
        <h4>Players:</h4>
        <ul>
          ${team.playersBought.map(p => `<li>${p.name} - ${p.price.toLocaleString()}</li>`).join('')}
        </ul>
      ` : '<p>No players purchased</p>'}
    </div>
  `).join('')}
  
  <h2>📋 Auction History</h2>
  <table>
    <thead>
      <tr>
        <th>Player Name</th>
        <th>Sold Price</th>
        <th>Sold To</th>
        <th>Time</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${transactions.map(t => `
        <tr>
          <td>${t.playerName}</td>
          <td>${t.soldPrice.toLocaleString()}</td>
          <td>${t.soldTo}</td>
          <td>${t.timestamp}</td>
          <td><strong>${t.status}</strong></td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>
    `
    const link = document.createElement('a')
    link.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(html)
    link.download = `auction-report-${new Date().toISOString().split('T')[0]}.html`
    link.click()
  }

  return (
    <div className="space-y-2">
      <button
        onClick={exportAsJSON}
        className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-semibold py-2 px-3 rounded text-sm transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" /> Export JSON
      </button>
      <button
        onClick={exportAsCSV}
        className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-300 font-semibold py-2 px-3 rounded text-sm transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" /> Export CSV
      </button>
      <button
        onClick={exportAsHTML}
        className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-semibold py-2 px-3 rounded text-sm transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" /> Export HTML
      </button>
    </div>
  )
}
