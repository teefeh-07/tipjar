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

