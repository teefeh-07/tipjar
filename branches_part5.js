// Part 5: Hooks, Utils, Types branches
module.exports = [
    {
        name: 'feature/use-wallet-hook',
        prTitle: 'feat: create useWallet hook for unified wallet state management',
        prBody: 'Implements the useWallet custom hook that provides a single interface for checking wallet connection status, retrieving the active address, and triggering connect/disconnect flows regardless of whether the user connected via Hiro Wallet or WalletConnect. Components consume this hook instead of importing services directly.',
        commits: [
            { file: 'src/hooks/useWallet.js', mode: 'create', content: 'import { useState, useEffect, useCallback } from \'react\';\n', msg: 'feat: create useWallet hook with React imports' },
            { file: 'src/hooks/useWallet.js', mode: 'append', content: 'import { isAuthenticated, getStxAddress, authenticate, logout } from \'../services/authService.js\';\n', msg: 'feat: import auth service into useWallet' },
            { file: 'src/hooks/useWallet.js', mode: 'append', content: 'import { isConnected, connectWallet, disconnectWallet, getSession } from \'../services/walletConnectService.js\';\n\n', msg: 'feat: import walletconnect service into useWallet' },
            { file: 'src/hooks/useWallet.js', mode: 'append', content: 'export default function useWallet() {\n  const [connected, setConnected] = useState(false);\n  const [address, setAddress] = useState(null);\n  const [provider, setProvider] = useState(null);\n\n', msg: 'feat: define useWallet state variables' },
            { file: 'src/hooks/useWallet.js', mode: 'append', content: '  useEffect(() => {\n    if (isAuthenticated()) {\n      setConnected(true);\n      setAddress(getStxAddress());\n      setProvider(\'hiro\');\n    } else if (isConnected()) {\n      setConnected(true);\n      setProvider(\'walletconnect\');\n      const session = getSession();\n      if (session) setAddress(session.namespaces?.stacks?.accounts?.[0]?.split(\':\')[2] || null);\n    }\n  }, []);\n\n', msg: 'feat: sync wallet state on hook mount' },
            { file: 'src/hooks/useWallet.js', mode: 'append', content: '  const connect = useCallback(async (method = \'hiro\') => {\n    if (method === \'hiro\') {\n      authenticate();\n    } else {\n      await connectWallet();\n      setConnected(true);\n      setProvider(\'walletconnect\');\n    }\n  }, []);\n\n', msg: 'feat: implement unified connect callback' },
            { file: 'src/hooks/useWallet.js', mode: 'append', content: '  const disconnect = useCallback(() => {\n    if (provider === \'hiro\') logout();\n    else disconnectWallet();\n    setConnected(false);\n    setAddress(null);\n    setProvider(null);\n  }, [provider]);\n\n', msg: 'feat: implement unified disconnect callback' },
            { file: 'src/hooks/useWallet.js', mode: 'append', content: '  return { connected, address, provider, connect, disconnect };\n}\n', msg: 'feat: return useWallet hook API object' },
        ]
    },
    {
        name: 'feature/use-transaction-hook',
        prTitle: 'feat: create useTransaction hook for transaction lifecycle tracking',
        prBody: 'Adds a useTransaction custom hook that wraps transaction submission and tracks its lifecycle: idle, pending, confirmed, failed. Components use this to show loading spinners during submission and success/error messages after resolution. Polls the Hiro API for transaction status updates.',
        commits: [
            { file: 'src/hooks/useTransaction.js', mode: 'create', content: 'import { useState, useCallback } from \'react\';\n\n', msg: 'feat: create useTransaction hook file' },
            { file: 'src/hooks/useTransaction.js', mode: 'append', content: 'import { API_URL } from \'../config/network.js\';\n\n', msg: 'feat: import API URL for transaction polling' },
            { file: 'src/hooks/useTransaction.js', mode: 'append', content: 'const TX_STATES = { IDLE: \'idle\', PENDING: \'pending\', CONFIRMED: \'confirmed\', FAILED: \'failed\' };\n\n', msg: 'feat: define transaction state constants' },
            { file: 'src/hooks/useTransaction.js', mode: 'append', content: 'export default function useTransaction() {\n  const [txId, setTxId] = useState(null);\n  const [status, setStatus] = useState(TX_STATES.IDLE);\n  const [error, setError] = useState(null);\n\n', msg: 'feat: define useTransaction state variables' },
            { file: 'src/hooks/useTransaction.js', mode: 'append', content: '  const submit = useCallback(async (txFn) => {\n    setStatus(TX_STATES.PENDING);\n    setError(null);\n    try {\n      const result = await txFn();\n      setTxId(result?.txId || null);\n      setStatus(TX_STATES.CONFIRMED);\n      return result;\n    } catch (err) {\n      setError(err.message);\n      setStatus(TX_STATES.FAILED);\n      throw err;\n    }\n  }, []);\n\n', msg: 'feat: implement submit wrapper with state transitions' },
            { file: 'src/hooks/useTransaction.js', mode: 'append', content: '  const checkStatus = useCallback(async () => {\n    if (!txId) return null;\n    try {\n      const res = await fetch(`${API_URL}/extended/v1/tx/${txId}`);\n      const data = await res.json();\n      if (data.tx_status === \'success\') setStatus(TX_STATES.CONFIRMED);\n      else if (data.tx_status === \'abort_by_response\') setStatus(TX_STATES.FAILED);\n      return data;\n    } catch (err) {\n      console.error(\'Status check failed:\', err);\n      return null;\n    }\n  }, [txId]);\n\n', msg: 'feat: add transaction status polling function' },
            { file: 'src/hooks/useTransaction.js', mode: 'append', content: '  const reset = useCallback(() => {\n    setTxId(null);\n    setStatus(TX_STATES.IDLE);\n    setError(null);\n  }, []);\n\n  return { txId, status, error, submit, checkStatus, reset, TX_STATES };\n}\n', msg: 'feat: add reset function and return hook API' },
        ]
    },
    {
        name: 'feature/use-tip-history-hook',
        prTitle: 'feat: create useTipHistory hook with auto-refresh',
        prBody: 'Builds a useTipHistory hook that wraps the tip service history getter and provides automatic refresh on an interval. Components get reactive tip history data without managing their own polling logic.',
        commits: [
            { file: 'src/hooks/useTipHistory.js', mode: 'create', content: 'import { useState, useEffect } from \'react\';\nimport { getTipHistory } from \'../services/tipService.js\';\n\n', msg: 'feat: create useTipHistory hook with imports' },
            { file: 'src/hooks/useTipHistory.js', mode: 'append', content: 'export default function useTipHistory(refreshInterval = 10000) {\n  const [history, setHistory] = useState([]);\n  const [loading, setLoading] = useState(true);\n\n', msg: 'feat: define useTipHistory state with refresh interval' },
            { file: 'src/hooks/useTipHistory.js', mode: 'append', content: '  useEffect(() => {\n    function refresh() {\n      setHistory(getTipHistory());\n      setLoading(false);\n    }\n    refresh();\n    const interval = setInterval(refresh, refreshInterval);\n    return () => clearInterval(interval);\n  }, [refreshInterval]);\n\n', msg: 'feat: implement auto-refresh polling effect' },
            { file: 'src/hooks/useTipHistory.js', mode: 'append', content: '  return { history, loading, count: history.length };\n}\n', msg: 'feat: return useTipHistory hook API' },
        ]
    },
    {
        name: 'feature/constants-util',
        prTitle: 'feat: define application-wide constants module',
        prBody: 'Creates the constants utility module containing all magic numbers and string literals used across the application. Centralizes contract addresses, network identifiers, tip limits, and UI configuration values to avoid duplication and make updates straightforward.',
        commits: [
            { file: 'src/utils/constants.js', mode: 'create', content: '// Application-wide constants\n\n', msg: 'feat: create constants utility file' },
            { file: 'src/utils/constants.js', mode: 'append', content: 'export const CONTRACT_ADDRESS = \'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM\';\nexport const TIPJAR_CONTRACT = \'tipjar\';\nexport const TOKEN_CONTRACT = \'tip-token\';\nexport const REGISTRY_CONTRACT = \'tip-registry\';\n\n', msg: 'feat: define contract address and name constants' },
            { file: 'src/utils/constants.js', mode: 'append', content: 'export const MICRO_STX = 1000000;\nexport const MIN_TIP_STX = 0.001;\nexport const MAX_TIP_STX = 100;\nexport const MIN_TIP_MICRO = MIN_TIP_STX * MICRO_STX;\nexport const MAX_TIP_MICRO = MAX_TIP_STX * MICRO_STX;\n\n', msg: 'feat: define STX unit conversion and tip limit constants' },
            { file: 'src/utils/constants.js', mode: 'append', content: 'export const NETWORKS = {\n  MAINNET: \'mainnet\',\n  TESTNET: \'testnet\',\n  DEVNET: \'devnet\',\n};\n\n', msg: 'feat: define network identifier constants' },
            { file: 'src/utils/constants.js', mode: 'append', content: 'export const TX_STATUS = {\n  PENDING: \'pending\',\n  SUCCESS: \'success\',\n  FAILED: \'failed\',\n  DROPPED: \'dropped\',\n};\n\n', msg: 'feat: define transaction status constants' },
            { file: 'src/utils/constants.js', mode: 'append', content: 'export const APP_NAME = \'Tipjar\';\nexport const APP_VERSION = \'1.0.0\';\nexport const REFRESH_INTERVAL = 10000;\n', msg: 'feat: define application metadata constants' },
        ]
    },
    {
        name: 'feature/helpers-util',
        prTitle: 'feat: add utility helper functions for formatting and conversion',
        prBody: 'Creates helper functions used throughout the app: STX/micro-STX conversion, address truncation, date formatting, amount formatting with locale support, and a debounce utility for input handlers. These pure functions are thoroughly tested and used across multiple components.',
        commits: [
            { file: 'src/utils/helpers.js', mode: 'create', content: '// Utility helper functions\n\nimport { MICRO_STX } from \'./constants.js\';\n\n', msg: 'feat: create helpers utility file with constants import' },
            { file: 'src/utils/helpers.js', mode: 'append', content: 'export function microToStx(microStx) {\n  return Number(microStx) / MICRO_STX;\n}\n\nexport function stxToMicro(stx) {\n  return Math.floor(Number(stx) * MICRO_STX);\n}\n\n', msg: 'feat: add STX and micro-STX conversion functions' },
            { file: 'src/utils/helpers.js', mode: 'append', content: 'export function truncateAddress(address, startChars = 6, endChars = 4) {\n  if (!address || address.length <= startChars + endChars) return address;\n  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;\n}\n\n', msg: 'feat: add address truncation utility' },
            { file: 'src/utils/helpers.js', mode: 'append', content: 'export function formatStx(microStx, decimals = 6) {\n  return microToStx(microStx).toFixed(decimals);\n}\n\n', msg: 'feat: add formatted STX display function' },
            { file: 'src/utils/helpers.js', mode: 'append', content: 'export function formatDate(isoString) {\n  return new Date(isoString).toLocaleDateString(\'en-US\', {\n    year: \'numeric\', month: \'short\', day: \'numeric\',\n    hour: \'2-digit\', minute: \'2-digit\',\n  });\n}\n\n', msg: 'feat: add locale-aware date formatter' },
            { file: 'src/utils/helpers.js', mode: 'append', content: 'export function debounce(fn, delayMs = 300) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delayMs);\n  };\n}\n\n', msg: 'feat: implement debounce utility for input handlers' },
            { file: 'src/utils/helpers.js', mode: 'append', content: 'export function generateId() {\n  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);\n}\n', msg: 'feat: add unique ID generator utility' },
        ]
    },
    {
        name: 'feature/validation-util',
        prTitle: 'feat: create input validation utility module',
        prBody: 'Implements validation functions for all user inputs: STX addresses (format and checksum), tip amounts (within bounds), memo length, creator names, and general string sanitization. Returns structured validation results with error messages for direct use in form components.',
        commits: [
            { file: 'src/utils/validation.js', mode: 'create', content: '// Input validation utilities\n\nimport { MIN_TIP_MICRO, MAX_TIP_MICRO } from \'./constants.js\';\n\n', msg: 'feat: create validation utility with imports' },
            { file: 'src/utils/validation.js', mode: 'append', content: 'export function validateStxAddress(address) {\n  if (!address) return { valid: false, error: \'Address is required\' };\n  if (!address.startsWith(\'ST\') && !address.startsWith(\'SP\')) return { valid: false, error: \'Address must start with ST or SP\' };\n  if (address.length < 30 || address.length > 42) return { valid: false, error: \'Invalid address length\' };\n  return { valid: true, error: null };\n}\n\n', msg: 'feat: implement STX address validation function' },
            { file: 'src/utils/validation.js', mode: 'append', content: 'export function validateTipAmount(amountMicro) {\n  if (isNaN(amountMicro) || amountMicro <= 0) return { valid: false, error: \'Amount must be positive\' };\n  if (amountMicro < MIN_TIP_MICRO) return { valid: false, error: \'Amount below minimum tip\' };\n  if (amountMicro > MAX_TIP_MICRO) return { valid: false, error: \'Amount exceeds maximum tip\' };\n  return { valid: true, error: null };\n}\n\n', msg: 'feat: implement tip amount bounds validation' },
            { file: 'src/utils/validation.js', mode: 'append', content: 'export function validateMemo(memo) {\n  if (memo && memo.length > 34) return { valid: false, error: \'Memo must be 34 characters or less\' };\n  return { valid: true, error: null };\n}\n\n', msg: 'feat: add memo length validation' },
            { file: 'src/utils/validation.js', mode: 'append', content: 'export function validateCreatorName(name) {\n  if (!name || name.trim().length === 0) return { valid: false, error: \'Name is required\' };\n  if (name.length > 64) return { valid: false, error: \'Name must be 64 characters or less\' };\n  return { valid: true, error: null };\n}\n\n', msg: 'feat: add creator name validation function' },
            { file: 'src/utils/validation.js', mode: 'append', content: 'export function sanitizeInput(input) {\n  if (typeof input !== \'string\') return \'\';\n  return input.replace(/[<>\"\\\\]/g, \'\').trim();\n}\n', msg: 'feat: add input sanitization utility' },
        ]
    },
    {
        name: 'feature/type-definitions',
        prTitle: 'feat: add TypeScript type definitions for project entities',
        prBody: 'Creates TypeScript type definitions and interfaces for all core data structures: Tip, Creator, UserProfile, TipStats, TransactionResult, WalletState, and Notification. These types enable IDE autocompletion and serve as documentation for the data models used throughout the app.',
        commits: [
            { file: 'src/types/index.ts', mode: 'create', content: '// Type definitions for Tipjar project\n\n', msg: 'feat: create type definitions file' },
            { file: 'src/types/index.ts', mode: 'append', content: 'export interface Tip {\n  id: string;\n  sender: string;\n  recipient: string;\n  amount: number;\n  memo: string;\n  timestamp: string;\n  txId: string | null;\n  status: \'pending\' | \'confirmed\' | \'failed\';\n}\n\n', msg: 'feat: define Tip interface' },
            { file: 'src/types/index.ts', mode: 'append', content: 'export interface Creator {\n  address: string;\n  name: string;\n  description: string;\n  category: string;\n  active: boolean;\n  totalReceived: number;\n  tipCount: number;\n}\n\n', msg: 'feat: define Creator interface' },
            { file: 'src/types/index.ts', mode: 'append', content: 'export interface TipStats {\n  totalTips: number;\n  totalAmount: number;\n  uniqueRecipients: number;\n  averageTip: number;\n}\n\n', msg: 'feat: define TipStats interface' },
            { file: 'src/types/index.ts', mode: 'append', content: 'export interface WalletState {\n  connected: boolean;\n  address: string | null;\n  provider: \'hiro\' | \'walletconnect\' | null;\n}\n\n', msg: 'feat: define WalletState interface' },
            { file: 'src/types/index.ts', mode: 'append', content: 'export interface TransactionResult {\n  txId: string;\n  status: string;\n  blockHeight?: number;\n}\n\n', msg: 'feat: define TransactionResult interface' },
            { file: 'src/types/index.ts', mode: 'append', content: 'export interface Notification {\n  type: \'success\' | \'info\' | \'error\' | \'warning\';\n  title: string;\n  message: string;\n  timestamp: number;\n}\n\n', msg: 'feat: define Notification interface' },
            { file: 'src/types/index.ts', mode: 'append', content: 'export interface Proposal {\n  id: number;\n  title: string;\n  proposer: string;\n  votesFor: number;\n  votesAgainst: number;\n  startBlock: number;\n  executed: boolean;\n}\n', msg: 'feat: define Proposal governance interface' },
        ]
    },
];
