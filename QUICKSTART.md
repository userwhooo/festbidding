# 🏏 MANCHI FEST 2026 - Quick Start Guide

## ✨ What's Included

Your cricket auction management system is now ready with all the requested features:

### ✅ Completed Features

1. **Team Setup Screen** - Configure teams and initial points
2. **Live Auction Panel** - Real-time bidding with timer and bid controls
3. **Team Dashboard** - View team balances and purchased players
4. **Auction History** - Complete transaction records with search & filter
5. **Leaderboard** - Rankings and tournament statistics
6. **Data Storage** - Automatic localStorage persistence
7. **Export Options** - JSON, CSV, and HTML export formats
8. **Dark Premium UI** - Gold and neon green theme with animations
9. **Responsive Design** - Mobile, tablet, and desktop optimized
10. **Keyboard Shortcuts** - Space (+bid), Backspace (-bid), Enter (SOLD)
11. **Sound Effects** - Audio feedback for auction events
12. **Fullscreen Mode** - Projector display option

## 🚀 Getting Started

### 1. Start the Development Server
```bash
npm run dev
```
The app will open automatically at `http://localhost:5173` (or next available port)

### 2. Team Setup
- Modify team names and initial points if needed
- Click "🎯 Start Auction"

### 3. Live Auction
- Enter player name and base price
- Click "Start Auction"
- Use bid controls to adjust price
- Select team from the team buttons
- Click "🔨 SOLD" to complete the sale

### 4. View Statistics
- Click "Teams" to see team dashboards
- Click "History" to view all transactions
- Click "Leaderboard" for rankings

## 📱 Key Features to Try

### Auction Panel
- **+50, +100, +500, +1K** - Increase bid by amount
- **-50, -100, -500, -1K** - Decrease bid by amount
- **Manual Entry** - Edit price directly
- **Timer** - 60-second countdown with pause/resume
- **Team Selection** - Click team button to set highest bidder

### Team Selection
- Each team shows remaining balance
- Teams are color-coded with emoji icons
- Balance updates automatically after sale

### Search & Filter
- Search by player name
- Filter by team
- Filter by status (Sold/Unsold)
- Sort by price or time

### Export Data
- **Export JSON** - Full backup of all data
- **Export CSV** - Transaction history for spreadsheets
- **Export HTML** - Printable report

## 🎨 Design Features

- **Dark Theme** - Professional sports dashboard appearance
- **Neon Accents** - Gold (#ffd700) and Green (#39ff14) highlights
- **Glowing Cards** - Semi-transparent with hover effects
- **Smooth Animations** - Transitions and pulse effects
- **Responsive Layout** - Adapts to all screen sizes
- **Cricket Icons** - Team emojis and auction symbols

## 💾 Data Persistence

All data is automatically saved to browser localStorage:
- Team configurations
- Auction history
- Player purchases
- Transaction records

Data persists across browser sessions until cleared.

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | +50 bid |
| Backspace | -50 bid |
| Enter | Mark SOLD |

## 🔧 Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📋 Default Teams

1. 👑 **Al Hilal** - Purple theme
2. ⚽ **Sporting Manchi** - Green theme
3. 🏙️ **Dubai Guys** - Red theme
4. 🔥 **Team Zinda** - Orange theme
5. 🐂 **Banglore Bulls** - Yellow theme

Each team starts with **9,000 points**

## 🐛 Troubleshooting

### Port Already in Use
- The app will try the next available port (e.g., 5174, 5175)
- Check the terminal output for the correct URL

### Data Not Persisting
- Ensure browser localStorage is enabled
- Check browser privacy settings
- Try a different browser if issue persists

### Styling Issues
- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Rebuild the project: `npm run build`

## 📞 Notes

- **No Backend Required** - Everything runs in the browser
- **No Database** - Uses browser localStorage for persistence
- **Fully Offline** - Works without internet connection
- **No Installation Required** - Just run and use

## 🎯 Next Steps

1. Customize team names and initial points
2. Start the first auction
3. Test the bidding system
4. View team dashboards
5. Export results when done

Enjoy the MANCHI FEST 2026 Cricket Auction! 🏏✨
