/** Maximum total a team may spend on players in the auction */
export const MAX_TEAM_SPEND = 15000

export function getTeamSpent(team) {
  return team?.totalSpent ?? 0
}

export function getSpendRemaining(team) {
  return Math.max(0, MAX_TEAM_SPEND - getTeamSpent(team))
}

export function canTeamBuyAtPrice(team, price) {
  if (!team || price <= 0) return false
  const spent = getTeamSpent(team)
  return spent + price <= MAX_TEAM_SPEND && team.balance >= price
}

export function getSpendLimitMessage(team, price) {
  const spent = getTeamSpent(team)
  const remaining = getSpendRemaining(team)
  if (spent + price > MAX_TEAM_SPEND) {
    return `${team.name} cannot spend more than ${MAX_TEAM_SPEND.toLocaleString()} total. Already spent ${spent.toLocaleString()}, only ${remaining.toLocaleString()} left.`
  }
  if (team.balance < price) {
    return `${team.name} does not have enough balance (${team.balance.toLocaleString()} remaining).`
  }
  return null
}
