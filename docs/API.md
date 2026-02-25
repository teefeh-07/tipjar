# API Reference

## Services

### stacksService

#### `sendTip(recipientAddress, amountInMicroStx)`
Sends an STX tip to the specified recipient.
- **recipientAddress** `string` - Stacks address of the recipient
- **amountInMicroStx** `string` - Amount in micro-STX
- **Returns** `Promise<TransactionResult>`

#### `registerCreator(name, description, category)`
Registers the current user as a creator in the tip registry.
- **name** `string` - Display name (max 64 chars)
- **description** `string` - Creator description (max 256 chars)
- **category** `string` - Creator category (max 32 chars)
- **Returns** `Promise<TransactionResult>`

#### `getTipAmount(sender, recipient)`
Queries the on-chain tip amount between two addresses.
- **Returns** `Promise<ClarityValue>`

### walletConnectService

#### `initWalletConnect()`
Initializes the WalletConnect SignClient and Modal.
- **Returns** `Promise<SignClient>`

#### `connectWallet()`
Opens the WalletConnect modal and returns the session.
- **Returns** `Promise<Session>`

#### `disconnectWallet()`
Disconnects the current WalletConnect session.

### chainhooksService

#### `initChainhooks()`
Initializes the Chainhooks client with API credentials.

#### `registerTipWebhook(contractAddress, contractName)`
Registers a webhook for tip contract call events.

#### `handleWebhookPayload(payload)`
Processes incoming webhook payloads from Chainhooks.

## Hooks

### `useWallet()`
Returns `{ connected, address, provider, connect, disconnect }`

### `useTransaction()`
Returns `{ txId, status, error, submit, checkStatus, reset }`

### `useTipHistory(refreshInterval?)`
Returns `{ history, loading, count }`

## Utilities

### helpers
- `microToStx(microStx)` - Convert micro-STX to STX
- `stxToMicro(stx)` - Convert STX to micro-STX
- `truncateAddress(address)` - Truncate address for display
- `formatStx(microStx)` - Format micro-STX as display string
- `debounce(fn, delayMs)` - Debounce function calls

### validation
- `validateStxAddress(address)` - Validate a Stacks address
- `validateTipAmount(amountMicro)` - Validate tip amount bounds
- `validateMemo(memo)` - Validate memo length
- `sanitizeInput(input)` - Strip dangerous characters
