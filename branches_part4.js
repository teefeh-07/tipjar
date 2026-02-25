// Part 4: React Components branches
module.exports = [
    {
        name: 'feature/connect-wallet-component',
        prTitle: 'feat: create ConnectWallet component with dual provider support',
        prBody: 'Builds the ConnectWallet React component that offers users two authentication paths: Hiro Wallet via @stacks/connect and any WC-compatible wallet via WalletConnect. Displays connection status, the connected STX address (truncated), and a disconnect button. Handles loading states and error feedback during connection.',
        commits: [
            { file: 'src/components/ConnectWallet.jsx', mode: 'create', content: 'import React, { useState } from \'react\';\n', msg: 'feat: create ConnectWallet component with React import' },
            { file: 'src/components/ConnectWallet.jsx', mode: 'append', content: 'import { authenticate, logout, isAuthenticated, getStxAddress } from \'../services/authService.js\';\n', msg: 'feat: import auth service into ConnectWallet' },
            { file: 'src/components/ConnectWallet.jsx', mode: 'append', content: 'import { connectWallet, disconnectWallet, isConnected } from \'../services/walletConnectService.js\';\n\n', msg: 'feat: import walletconnect service into ConnectWallet' },
            { file: 'src/components/ConnectWallet.jsx', mode: 'append', content: 'export default function ConnectWallet() {\n  const [loading, setLoading] = useState(false);\n  const [error, setError] = useState(null);\n  const connected = isAuthenticated() || isConnected();\n  const address = getStxAddress();\n\n', msg: 'feat: define ConnectWallet state and derived values' },
            { file: 'src/components/ConnectWallet.jsx', mode: 'append', content: '  const handleHiroConnect = async () => {\n    setLoading(true);\n    setError(null);\n    try {\n      authenticate();\n    } catch (err) {\n      setError(err.message);\n    } finally {\n      setLoading(false);\n    }\n  };\n\n', msg: 'feat: implement Hiro Wallet connection handler' },
            { file: 'src/components/ConnectWallet.jsx', mode: 'append', content: '  const handleWCConnect = async () => {\n    setLoading(true);\n    setError(null);\n    try {\n      await connectWallet();\n    } catch (err) {\n      setError(err.message);\n    } finally {\n      setLoading(false);\n    }\n  };\n\n', msg: 'feat: implement WalletConnect connection handler' },
            { file: 'src/components/ConnectWallet.jsx', mode: 'append', content: '  const handleDisconnect = () => {\n    if (isAuthenticated()) logout();\n    if (isConnected()) disconnectWallet();\n  };\n\n', msg: 'feat: implement disconnect handler for both providers' },
            { file: 'src/components/ConnectWallet.jsx', mode: 'append', content: '  if (connected) {\n    return (\n      <div className="wallet-connected">\n        <span className="wallet-address">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : \'Connected\'}</span>\n        <button onClick={handleDisconnect} className="btn-disconnect">Disconnect</button>\n      </div>\n    );\n  }\n\n', msg: 'feat: render connected state with truncated address' },
            { file: 'src/components/ConnectWallet.jsx', mode: 'append', content: '  return (\n    <div className="wallet-connect">\n      {error && <p className="error-text">{error}</p>}\n      <button onClick={handleHiroConnect} disabled={loading} className="btn-hiro">Connect Hiro Wallet</button>\n      <button onClick={handleWCConnect} disabled={loading} className="btn-wc">Connect via WalletConnect</button>\n      {loading && <span className="loading-indicator">Connecting...</span>}\n    </div>\n  );\n}\n', msg: 'feat: render disconnected state with dual connect buttons' },
        ]
    },
    {
        name: 'feature/send-tip-component',
        prTitle: 'feat: build SendTip form component with live validation',
        prBody: 'Creates the SendTip component with a form for entering a recipient address and tip amount. Includes real-time validation feedback, amount presets (0.1, 0.5, 1, 5 STX), an optional memo field, and a submit handler that calls the tip service. Shows a success confirmation with the transaction ID after submission.',
        commits: [
            { file: 'src/components/SendTip.jsx', mode: 'create', content: 'import React, { useState } from \'react\';\n', msg: 'feat: create SendTip component file' },
            { file: 'src/components/SendTip.jsx', mode: 'append', content: 'import { processTip, validateTip } from \'../services/tipService.js\';\n\n', msg: 'feat: import tip service into SendTip' },
            { file: 'src/components/SendTip.jsx', mode: 'append', content: 'const AMOUNT_PRESETS = [\n  { label: \'0.1 STX\', value: 100000 },\n  { label: \'0.5 STX\', value: 500000 },\n  { label: \'1 STX\', value: 1000000 },\n  { label: \'5 STX\', value: 5000000 },\n];\n\n', msg: 'feat: define tip amount preset buttons' },
            { file: 'src/components/SendTip.jsx', mode: 'append', content: 'export default function SendTip() {\n  const [recipient, setRecipient] = useState(\'\');\n  const [amount, setAmount] = useState(\'\');\n  const [memo, setMemo] = useState(\'\');\n  const [status, setStatus] = useState(null);\n  const [error, setError] = useState(null);\n  const [loading, setLoading] = useState(false);\n\n', msg: 'feat: initialize SendTip form state variables' },
            { file: 'src/components/SendTip.jsx', mode: 'append', content: '  const handleSubmit = async (e) => {\n    e.preventDefault();\n    setError(null);\n    setStatus(null);\n    setLoading(true);\n    try {\n      const amountMicro = Math.floor(parseFloat(amount) * 1000000);\n      const result = await processTip(recipient, amountMicro, memo);\n      setStatus(`Tip sent! TX: ${result.txId}`);\n      setRecipient(\'\');\n      setAmount(\'\');\n      setMemo(\'\');\n    } catch (err) {\n      setError(err.message);\n    } finally {\n      setLoading(false);\n    }\n  };\n\n', msg: 'feat: implement form submission handler with error handling' },
            { file: 'src/components/SendTip.jsx', mode: 'append', content: '  const handlePreset = (value) => {\n    setAmount((value / 1000000).toString());\n  };\n\n', msg: 'feat: add preset amount selection handler' },
            { file: 'src/components/SendTip.jsx', mode: 'append', content: '  return (\n    <form onSubmit={handleSubmit} className="send-tip-form">\n      <h2>Send a Tip</h2>\n      {error && <div className="form-error">{error}</div>}\n      {status && <div className="form-success">{status}</div>}\n      <div className="form-group">\n        <label htmlFor="recipient">Recipient Address</label>\n        <input id="recipient" type="text" value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="ST..." required />\n      </div>\n', msg: 'feat: render tip form with recipient address input' },
            { file: 'src/components/SendTip.jsx', mode: 'append', content: '      <div className="form-group">\n        <label htmlFor="amount">Amount (STX)</label>\n        <input id="amount" type="number" step="0.000001" min="0.001" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required />\n        <div className="presets">\n          {AMOUNT_PRESETS.map(p => <button key={p.value} type="button" onClick={() => handlePreset(p.value)} className="preset-btn">{p.label}</button>)}\n        </div>\n      </div>\n', msg: 'feat: add amount input field with preset buttons' },
            { file: 'src/components/SendTip.jsx', mode: 'append', content: '      <div className="form-group">\n        <label htmlFor="memo">Memo (optional)</label>\n        <input id="memo" type="text" value={memo} onChange={e => setMemo(e.target.value)} placeholder="Thanks for the great work!" maxLength={34} />\n      </div>\n      <button type="submit" disabled={loading} className="btn-send-tip">{loading ? \'Sending...\' : \'Send Tip' }</button >\n    </form >\n  ); \n}\n', msg: 'feat: add memo input and submit button to tip form' },
]
  },
{
    name: 'feature/tip-history-component',
        prTitle: 'feat: create TipHistory component showing recent transactions',
            prBody: 'Implements the TipHistory component that displays a reverse-chronological list of tips sent by the current user. Each entry shows the recipient (truncated), amount in STX, memo, timestamp, and transaction status. Provides a clean, scannable layout for users to review their tipping activity.',
                commits: [
                    { file: 'src/components/TipHistory.jsx', mode: 'create', content: 'import React from \'react\';\nimport { getTipHistory } from \'../services/tipService.js\';\n\n', msg: 'feat: create TipHistory component with imports' },
                    { file: 'src/components/TipHistory.jsx', mode: 'append', content: 'export default function TipHistory() {\n  const tips = getTipHistory();\n\n  if (tips.length === 0) {\n    return <div className="tip-history-empty"><p>No tips sent yet. Be the first to tip a creator!</p></div>;\n  }\n\n', msg: 'feat: add empty state for tip history' },
                    { file: 'src/components/TipHistory.jsx', mode: 'append', content: '  return (\n    <div className="tip-history">\n      <h2>Tip History</h2>\n      <ul className="tip-list">\n        {tips.map(tip => (\n          <li key={tip.id} className="tip-item">\n            <div className="tip-recipient">To: {tip.recipient.slice(0, 8)}...{tip.recipient.slice(-4)}</div>\n            <div className="tip-amount">{(tip.amount / 1000000).toFixed(6)} STX</div>\n', msg: 'feat: render tip list with recipient and amount' },
                    { file: 'src/components/TipHistory.jsx', mode: 'append', content: '            {tip.memo && <div className="tip-memo">&quot;{tip.memo}&quot;</div>}\n            <div className="tip-meta">\n              <span className="tip-time">{new Date(tip.timestamp).toLocaleString()}</span>\n              <span className={`tip-status tip-status--${tip.status}`}>{tip.status}</span>\n            </div>\n          </li>\n        ))}\n      </ul>\n    </div>\n  );\n}\n', msg: 'feat: add memo, timestamp and status to tip history items' },
                ]
},
{
    name: 'feature/header-component',
        prTitle: 'feat: build Header component with navigation and wallet connection',
            prBody: 'Creates the app header with the Tipjar branding, primary navigation links (Dashboard, Send Tip, History, Leaderboard), and the ConnectWallet component positioned on the right. Uses semantic HTML and is fully responsive.',
                commits: [
                    { file: 'src/components/Header.jsx', mode: 'create', content: 'import React from \'react\';\nimport ConnectWallet from \'./ConnectWallet.jsx\';\n\n', msg: 'feat: create Header component with imports' },
                    { file: 'src/components/Header.jsx', mode: 'append', content: 'export default function Header() {\n  return (\n    <header className="app-header">\n      <div className="header-brand">\n        <h1 className="logo">Tipjar</h1>\n        <span className="tagline">Decentralized Tipping on Stacks</span>\n      </div>\n', msg: 'feat: render header with branding section' },
                    { file: 'src/components/Header.jsx', mode: 'append', content: '      <nav className="header-nav">\n        <a href="#dashboard" className="nav-link">Dashboard</a>\n        <a href="#send-tip" className="nav-link">Send Tip</a>\n        <a href="#history" className="nav-link">History</a>\n        <a href="#leaderboard" className="nav-link">Leaderboard</a>\n      </nav>\n', msg: 'feat: add navigation links to header' },
                    { file: 'src/components/Header.jsx', mode: 'append', content: '      <div className="header-actions">\n        <ConnectWallet />\n      </div>\n    </header>\n  );\n}\n', msg: 'feat: embed ConnectWallet component in header actions' },
                ]
},
{
    name: 'feature/footer-component',
        prTitle: 'feat: create app Footer with links and attribution',
            prBody: 'Adds the Footer component with links to documentation, GitHub repository, contributing guide, and the Stacks explorer. Includes copyright year and a brief platform description for SEO.',
                commits: [
                    { file: 'src/components/Footer.jsx', mode: 'create', content: 'import React from \'react\';\n\n', msg: 'feat: create Footer component file' },
                    { file: 'src/components/Footer.jsx', mode: 'append', content: 'export default function Footer() {\n  return (\n    <footer className="app-footer">\n      <div className="footer-links">\n        <a href="/docs">Documentation</a>\n        <a href="https://github.com/teefeh-07/tipjar" target="_blank" rel="noopener noreferrer">GitHub</a>\n        <a href="/docs/contributing">Contributing</a>\n        <a href="https://explorer.hiro.so" target="_blank" rel="noopener noreferrer">Stacks Explorer</a>\n      </div>\n', msg: 'feat: render footer navigation links' },
                    { file: 'src/components/Footer.jsx', mode: 'append', content: '      <div className="footer-info">\n        <p>&copy; {new Date().getFullYear()} Tipjar. Built on Stacks blockchain.</p>\n        <p className="footer-tagline">Empowering creators through decentralized micro-tips.</p>\n      </div>\n    </footer>\n  );\n}\n', msg: 'feat: add footer copyright and tagline' },
                ]
},
{
    name: 'feature/dashboard-component',
        prTitle: 'feat: build Dashboard component with platform stats and quick actions',
            prBody: 'Creates the main Dashboard view that shows platform-wide statistics (total tips sent, total STX volume, unique creators tipped), a quick tip shortcut, and the recent tip activity feed. Fetches stats from both the contract read-only functions and the local tip service.',
                commits: [
                    { file: 'src/components/Dashboard.jsx', mode: 'create', content: 'import React, { useState, useEffect } from \'react\';\n', msg: 'feat: create Dashboard component with state imports' },
                    { file: 'src/components/Dashboard.jsx', mode: 'append', content: 'import { getTipStats } from \'../services/tipService.js\';\nimport { getPlatformStats } from \'../services/stacksService.js\';\n\n', msg: 'feat: import tip and stacks services into Dashboard' },
                    { file: 'src/components/Dashboard.jsx', mode: 'append', content: 'export default function Dashboard() {\n  const [stats, setStats] = useState({ totalTips: 0, totalAmount: 0, uniqueRecipients: 0, averageTip: 0 });\n  const [loading, setLoading] = useState(true);\n\n', msg: 'feat: define Dashboard state with default stats' },
                    { file: 'src/components/Dashboard.jsx', mode: 'append', content: '  useEffect(() => {\n    async function loadStats() {\n      try {\n        const localStats = getTipStats();\n        setStats(localStats);\n      } catch (err) {\n        console.error(\'Failed to load stats:\', err);\n      } finally {\n        setLoading(false);\n      }\n    }\n    loadStats();\n  }, []);\n\n', msg: 'feat: fetch platform stats on Dashboard mount' },
                    { file: 'src/components/Dashboard.jsx', mode: 'append', content: '  if (loading) return <div className="dashboard-loading">Loading dashboard...</div>;\n\n', msg: 'feat: add Dashboard loading state' },
                    { file: 'src/components/Dashboard.jsx', mode: 'append', content: '  return (\n    <div className="dashboard">\n      <h2>Dashboard</h2>\n      <div className="stats-grid">\n        <div className="stat-card"><h3>{stats.totalTips}</h3><p>Total Tips</p></div>\n        <div className="stat-card"><h3>{(stats.totalAmount / 1000000).toFixed(2)} STX</h3><p>Total Volume</p></div>\n        <div className="stat-card"><h3>{stats.uniqueRecipients}</h3><p>Creators Tipped</p></div>\n        <div className="stat-card"><h3>{(stats.averageTip / 1000000).toFixed(4)} STX</h3><p>Avg Tip</p></div>\n      </div>\n    </div>\n  );\n}\n', msg: 'feat: render Dashboard stats grid with formatted values' },
                ]
},
{
    name: 'feature/leaderboard-component',
        prTitle: 'feat: implement Leaderboard component for top tipped creators',
            prBody: 'Adds a Leaderboard component that ranks creators by total STX received from tips. Displays rank, truncated address, total amount, and a visual progress bar relative to the top earner. Uses the getTopRecipients function from the tip service.',
                commits: [
                    { file: 'src/components/Leaderboard.jsx', mode: 'create', content: 'import React from \'react\';\nimport { getTopRecipients } from \'../services/tipService.js\';\n\n', msg: 'feat: create Leaderboard component with imports' },
                    { file: 'src/components/Leaderboard.jsx', mode: 'append', content: 'export default function Leaderboard() {\n  const topRecipients = getTopRecipients(10);\n  const maxAmount = topRecipients.length > 0 ? topRecipients[0].total : 1;\n\n', msg: 'feat: compute leaderboard data and max amount' },
                    { file: 'src/components/Leaderboard.jsx', mode: 'append', content: '  if (topRecipients.length === 0) {\n    return <div className="leaderboard-empty"><p>No tips recorded yet. Start tipping to see the leaderboard!</p></div>;\n  }\n\n', msg: 'feat: add leaderboard empty state' },
                    { file: 'src/components/Leaderboard.jsx', mode: 'append', content: '  return (\n    <div className="leaderboard">\n      <h2>Top Creators</h2>\n      <ol className="leaderboard-list">\n        {topRecipients.map((entry, index) => (\n          <li key={entry.address} className="leaderboard-item">\n            <span className="rank">#{index + 1}</span>\n            <span className="address">{entry.address.slice(0, 8)}...{entry.address.slice(-4)}</span>\n            <div className="bar-container"><div className="bar-fill" style={{ width: `${(entry.total / maxAmount) * 100}%` }}></div></div>\n            <span className="total">{(entry.total / 1000000).toFixed(2)} STX</span>\n          </li>\n        ))}\n      </ol>\n    </div>\n  );\n}\n', msg: 'feat: render leaderboard with rank, address and progress bar' },
                ]
},
{
    name: 'feature/app-entry',
        prTitle: 'feat: assemble App root component with all sections',
            prBody: 'Creates the main App.jsx that composes the Header, Dashboard, SendTip, TipHistory, Leaderboard, and Footer components into the full application layout. Includes an initialization effect that sets up the WalletConnect client and Chainhooks listeners when the app mounts.',
                commits: [
                    { file: 'src/App.jsx', mode: 'create', content: 'import React, { useEffect } from \'react\';\n', msg: 'feat: create App root component file' },
                    { file: 'src/App.jsx', mode: 'append', content: 'import Header from \'./components/Header.jsx\';\nimport Footer from \'./components/Footer.jsx\';\nimport Dashboard from \'./components/Dashboard.jsx\';\n', msg: 'feat: import layout and dashboard components' },
                    { file: 'src/App.jsx', mode: 'append', content: 'import SendTip from \'./components/SendTip.jsx\';\nimport TipHistory from \'./components/TipHistory.jsx\';\nimport Leaderboard from \'./components/Leaderboard.jsx\';\n', msg: 'feat: import feature components into App' },
                    { file: 'src/App.jsx', mode: 'append', content: 'import { initWalletConnect } from \'./services/walletConnectService.js\';\nimport { initChainhooks } from \'./services/chainhooksService.js\';\n\n', msg: 'feat: import service initializers into App' },
                    { file: 'src/App.jsx', mode: 'append', content: 'export default function App() {\n  useEffect(() => {\n    async function bootstrap() {\n      try {\n        await initWalletConnect();\n        await initChainhooks();\n        console.log(\'Services initialized\');\n      } catch (err) {\n        console.error(\'Bootstrap error:\', err);\n      }\n    }\n    bootstrap();\n  }, []);\n\n', msg: 'feat: add bootstrap effect for service initialization' },
                    { file: 'src/App.jsx', mode: 'append', content: '  return (\n    <div className="app">\n      <Header />\n      <main className="app-main">\n        <Dashboard />\n        <SendTip />\n        <TipHistory />\n        <Leaderboard />\n      </main>\n      <Footer />\n    </div>\n  );\n}\n', msg: 'feat: compose full app layout with all sections' },
                ]
},
{
    name: 'feature/index-entry',
        prTitle: 'feat: set up application entry point with React root',
            prBody: 'Creates the src/index.js entry point that renders the App root component into the DOM. Uses React 18 createRoot API for concurrent rendering support.',
                commits: [
                    { file: 'src/index.js', mode: 'create', content: 'import React from \'react\';\n', msg: 'feat: create index.js entry point' },
                    { file: 'src/index.js', mode: 'append', content: 'import { createRoot } from \'react-dom/client\';\n', msg: 'feat: import React 18 createRoot API' },
                    { file: 'src/index.js', mode: 'append', content: 'import App from \'./App.jsx\';\n\n', msg: 'feat: import App root component' },
                    { file: 'src/index.js', mode: 'append', content: 'const container = document.getElementById(\'root\');\nconst root = createRoot(container);\n', msg: 'feat: get DOM container and create React root' },
                    { file: 'src/index.js', mode: 'append', content: 'root.render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n', msg: 'feat: render App in StrictMode' },
                ]
},
];
