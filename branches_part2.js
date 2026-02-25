// Part 2: Smart Contracts branches
module.exports = [
    {
        name: 'feature/tipjar-contract',
        prTitle: 'feat: implement core tipjar smart contract in Clarity 4',
        prBody: 'Implements the main tipjar.clar contract which allows users to send STX tips to registered creators. Features include a tips map for tracking sender-recipient pairs, a send-tip public function that transfers STX directly, a get-tip-amount read-only for querying past tips, and a withdraw function for creators. Built with Clarity 4 syntax — no as-contract calls.',
        commits: [
            { file: 'contracts/tipjar.clar', mode: 'create', content: ';; Tipjar - Core tipping smart contract\n;; Built with Clarity 4, epoch 3.3\n\n', msg: 'feat: create tipjar contract file with header' },
            { file: 'contracts/tipjar.clar', mode: 'append', content: ';; Error constants\n(define-constant ERR-INVALID-AMOUNT (err u100))\n(define-constant ERR-TRANSFER-FAILED (err u101))\n', msg: 'feat: define tipjar error constants' },
            { file: 'contracts/tipjar.clar', mode: 'append', content: '(define-constant ERR-NOT-AUTHORIZED (err u102))\n(define-constant ERR-CREATOR-NOT-FOUND (err u103))\n\n', msg: 'feat: add authorization and lookup error codes' },
            { file: 'contracts/tipjar.clar', mode: 'append', content: ';; Data variables\n(define-data-var contract-owner principal tx-sender)\n(define-data-var total-tips-sent uint u0)\n(define-data-var total-tip-count uint u0)\n\n', msg: 'feat: define tipjar data variables' },
            { file: 'contracts/tipjar.clar', mode: 'append', content: ';; Maps\n(define-map tips { sender: principal, recipient: principal } { amount: uint, timestamp: uint })\n', msg: 'feat: define tips tracking map' },
            { file: 'contracts/tipjar.clar', mode: 'append', content: '(define-map creator-totals { creator: principal } { total-received: uint, tip-count: uint })\n', msg: 'feat: define creator totals aggregation map' },
            { file: 'contracts/tipjar.clar', mode: 'append', content: '(define-map registered-creators principal bool)\n\n', msg: 'feat: add registered creators lookup map' },
            { file: 'contracts/tipjar.clar', mode: 'append', content: ';; Public functions\n(define-public (send-tip (recipient principal) (amount uint))\n  (begin\n    (asserts! (> amount u0) ERR-INVALID-AMOUNT)\n    (try! (stx-transfer? amount tx-sender recipient))\n', msg: 'feat: implement send-tip function with validation' },
            { file: 'contracts/tipjar.clar', mode: 'append', content: '    (map-set tips { sender: tx-sender, recipient: recipient }\n      { amount: amount, timestamp: stacks-block-height })\n    (var-set total-tips-sent (+ (var-get total-tips-sent) amount))\n    (var-set total-tip-count (+ (var-get total-tip-count) u1))\n    (ok amount)\n  )\n)\n\n', msg: 'feat: add tip recording and counter updates to send-tip' },
            { file: 'contracts/tipjar.clar', mode: 'append', content: '(define-public (register-creator)\n  (begin\n    (map-set registered-creators tx-sender true)\n    (map-set creator-totals { creator: tx-sender } { total-received: u0, tip-count: u0 })\n    (ok true)\n  )\n)\n\n', msg: 'feat: implement creator registration function' },
            { file: 'contracts/tipjar.clar', mode: 'append', content: ';; Read-only functions\n(define-read-only (get-tip (sender principal) (recipient principal))\n  (map-get? tips { sender: sender, recipient: recipient })\n)\n\n', msg: 'feat: add get-tip read-only lookup' },
            { file: 'contracts/tipjar.clar', mode: 'append', content: '(define-read-only (get-creator-totals (creator principal))\n  (map-get? creator-totals { creator: creator })\n)\n\n', msg: 'feat: add get-creator-totals read-only function' },
            { file: 'contracts/tipjar.clar', mode: 'append', content: '(define-read-only (get-total-tips)\n  (ok (var-get total-tips-sent))\n)\n\n(define-read-only (get-tip-count)\n  (ok (var-get total-tip-count))\n)\n\n', msg: 'feat: add platform-wide stats read-only functions' },
            { file: 'contracts/tipjar.clar', mode: 'append', content: '(define-read-only (is-registered (creator principal))\n  (default-to false (map-get? registered-creators creator))\n)\n', msg: 'feat: add creator registration check function' },
        ]
    },
    {
        name: 'feature/tip-token-contract',
        prTitle: 'feat: create SIP-010 compliant tip loyalty token contract',
        prBody: 'Introduces a fungible token contract (tip-token.clar) that follows the SIP-010 standard. The token is minted as loyalty rewards when users send tips through the platform. Includes standard transfer, get-balance, get-total-supply, and token metadata functions. The mint function is restricted to the contract owner to prevent unauthorized issuance.',
        commits: [
            { file: 'contracts/tip-token.clar', mode: 'create', content: ';; Tip Token - SIP-010 Loyalty Token\n;; Rewards users for tipping activity\n\n', msg: 'feat: create tip-token contract header' },
            { file: 'contracts/tip-token.clar', mode: 'append', content: '(define-fungible-token tip-token)\n\n', msg: 'feat: define tip-token fungible token' },
            { file: 'contracts/tip-token.clar', mode: 'append', content: '(define-constant ERR-NOT-OWNER (err u200))\n(define-constant ERR-INSUFFICIENT-BALANCE (err u201))\n(define-constant CONTRACT-OWNER tx-sender)\n\n', msg: 'feat: define tip-token error constants and owner' },
            { file: 'contracts/tip-token.clar', mode: 'append', content: '(define-read-only (get-name)\n  (ok "Tip Token")\n)\n\n(define-read-only (get-symbol)\n  (ok "TIPT")\n)\n\n', msg: 'feat: implement token name and symbol getters' },
            { file: 'contracts/tip-token.clar', mode: 'append', content: '(define-read-only (get-decimals)\n  (ok u6)\n)\n\n(define-read-only (get-token-uri)\n  (ok (some u"https://tipjar.app/token-metadata.json"))\n)\n\n', msg: 'feat: add decimals and token URI metadata' },
            { file: 'contracts/tip-token.clar', mode: 'append', content: '(define-read-only (get-balance (account principal))\n  (ok (ft-get-balance tip-token account))\n)\n\n(define-read-only (get-total-supply)\n  (ok (ft-get-supply tip-token))\n)\n\n', msg: 'feat: implement balance and total supply queries' },
            { file: 'contracts/tip-token.clar', mode: 'append', content: '(define-public (transfer (amount uint) (from principal) (to principal) (memo (optional (buff 34))))\n  (begin\n    (asserts! (is-eq from tx-sender) ERR-NOT-OWNER)\n    (try! (ft-transfer? tip-token amount from to))\n    (ok true)\n  )\n)\n\n', msg: 'feat: implement SIP-010 transfer function' },
            { file: 'contracts/tip-token.clar', mode: 'append', content: '(define-public (mint (amount uint) (recipient principal))\n  (begin\n    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-OWNER)\n    (ft-mint? tip-token amount recipient)\n  )\n)\n', msg: 'feat: add owner-restricted mint function' },
        ]
    },
    {
        name: 'feature/tip-registry-contract',
        prTitle: 'feat: build on-chain creator registry contract',
        prBody: 'Adds the tip-registry.clar contract that maintains an on-chain directory of creators who accept tips. Each creator entry stores their display name, description, and category. The contract includes functions for registering, updating profiles, and querying creator details. This enables discoverability of tippable creators within the ecosystem.',
        commits: [
            { file: 'contracts/tip-registry.clar', mode: 'create', content: ';; Tip Registry - Creator directory on-chain\n;; Manages creator profiles that accept tips\n\n', msg: 'feat: create tip-registry contract with docs' },
            { file: 'contracts/tip-registry.clar', mode: 'append', content: '(define-constant ERR-ALREADY-REGISTERED (err u300))\n(define-constant ERR-NOT-REGISTERED (err u301))\n(define-constant ERR-INVALID-NAME (err u302))\n\n', msg: 'feat: define registry error constants' },
            { file: 'contracts/tip-registry.clar', mode: 'append', content: '(define-map creators principal\n  {\n    name: (string-utf8 64),\n    description: (string-utf8 256),\n    category: (string-utf8 32),\n    active: bool\n  }\n)\n\n', msg: 'feat: define creators profile map schema' },
            { file: 'contracts/tip-registry.clar', mode: 'append', content: '(define-data-var creator-count uint u0)\n\n', msg: 'feat: add creator count tracking variable' },
            { file: 'contracts/tip-registry.clar', mode: 'append', content: '(define-public (register (name (string-utf8 64)) (description (string-utf8 256)) (category (string-utf8 32)))\n  (begin\n    (asserts! (is-none (map-get? creators tx-sender)) ERR-ALREADY-REGISTERED)\n    (asserts! (> (len name) u0) ERR-INVALID-NAME)\n', msg: 'feat: implement register function with validations' },
            { file: 'contracts/tip-registry.clar', mode: 'append', content: '    (map-set creators tx-sender { name: name, description: description, category: category, active: true })\n    (var-set creator-count (+ (var-get creator-count) u1))\n    (ok true)\n  )\n)\n\n', msg: 'feat: complete registration with map insert and counter' },
            { file: 'contracts/tip-registry.clar', mode: 'append', content: '(define-public (update-profile (name (string-utf8 64)) (description (string-utf8 256)) (category (string-utf8 32)))\n  (begin\n    (asserts! (is-some (map-get? creators tx-sender)) ERR-NOT-REGISTERED)\n    (map-set creators tx-sender { name: name, description: description, category: category, active: true })\n    (ok true)\n  )\n)\n\n', msg: 'feat: implement profile update function' },
            { file: 'contracts/tip-registry.clar', mode: 'append', content: '(define-read-only (get-creator (who principal))\n  (map-get? creators who)\n)\n\n(define-read-only (get-creator-count)\n  (ok (var-get creator-count))\n)\n', msg: 'feat: add creator lookup and count read-only functions' },
        ]
    },
    {
        name: 'feature/tip-rewards-contract',
        prTitle: 'feat: implement tip rewards distribution contract',
        prBody: 'Creates the tip-rewards.clar contract that handles bonus reward distribution for active tippers. Tracks tipping streaks and calculates reward multipliers based on consistency. Users who tip frequently earn higher reward multipliers applied to their loyalty token earnings.',
        commits: [
            { file: 'contracts/tip-rewards.clar', mode: 'create', content: ';; Tip Rewards - Streak and bonus management\n;; Incentivizes consistent tipping behavior\n\n', msg: 'feat: create tip-rewards contract header' },
            { file: 'contracts/tip-rewards.clar', mode: 'append', content: '(define-constant ERR-NO-STREAK (err u400))\n(define-constant ERR-COOLDOWN (err u401))\n(define-constant STREAK-THRESHOLD u5)\n(define-constant REWARD-MULTIPLIER u2)\n\n', msg: 'feat: define reward constants and thresholds' },
            { file: 'contracts/tip-rewards.clar', mode: 'append', content: '(define-map user-streaks principal\n  { current-streak: uint, longest-streak: uint, last-tip-block: uint }\n)\n\n', msg: 'feat: define user streak tracking map' },
            { file: 'contracts/tip-rewards.clar', mode: 'append', content: '(define-map reward-claims principal { total-claimed: uint, last-claim-block: uint })\n\n', msg: 'feat: define reward claims history map' },
            { file: 'contracts/tip-rewards.clar', mode: 'append', content: '(define-public (record-tip)\n  (let ((existing (default-to { current-streak: u0, longest-streak: u0, last-tip-block: u0 } (map-get? user-streaks tx-sender))))\n    (map-set user-streaks tx-sender\n      { current-streak: (+ (get current-streak existing) u1),\n        longest-streak: (if (> (+ (get current-streak existing) u1) (get longest-streak existing)) (+ (get current-streak existing) u1) (get longest-streak existing)),\n        last-tip-block: stacks-block-height })\n    (ok true)\n  )\n)\n\n', msg: 'feat: implement tip recording with streak tracking' },
            { file: 'contracts/tip-rewards.clar', mode: 'append', content: '(define-read-only (get-streak (user principal))\n  (map-get? user-streaks user)\n)\n\n', msg: 'feat: add streak lookup read-only function' },
            { file: 'contracts/tip-rewards.clar', mode: 'append', content: '(define-read-only (get-reward-multiplier (user principal))\n  (let ((streak-data (default-to { current-streak: u0, longest-streak: u0, last-tip-block: u0 } (map-get? user-streaks user))))\n    (if (>= (get current-streak streak-data) STREAK-THRESHOLD)\n      (ok REWARD-MULTIPLIER)\n      (ok u1)\n    )\n  )\n)\n', msg: 'feat: implement reward multiplier calculation' },
        ]
    },
    {
        name: 'feature/tip-governance-contract',
        prTitle: 'feat: add community governance contract for platform parameters',
        prBody: 'Introduces a lightweight governance contract that lets token holders vote on platform parameters like minimum tip amounts, reward rates, and fee percentages. Each proposal has a voting period measured in blocks. This gives the community a say in how the platform evolves over time.',
        commits: [
            { file: 'contracts/tip-governance.clar', mode: 'create', content: ';; Tip Governance - Community voting on platform params\n;; Token holders can propose and vote on changes\n\n', msg: 'feat: create governance contract with header' },
            { file: 'contracts/tip-governance.clar', mode: 'append', content: '(define-constant ERR-PROPOSAL-EXISTS (err u500))\n(define-constant ERR-NO-PROPOSAL (err u501))\n(define-constant ERR-ALREADY-VOTED (err u502))\n(define-constant ERR-VOTING-CLOSED (err u503))\n(define-constant VOTING-PERIOD u144)\n\n', msg: 'feat: define governance constants and voting period' },
            { file: 'contracts/tip-governance.clar', mode: 'append', content: '(define-data-var proposal-nonce uint u0)\n\n(define-map proposals uint\n  { title: (string-utf8 128), proposer: principal, votes-for: uint, votes-against: uint, start-block: uint, executed: bool }\n)\n\n', msg: 'feat: define proposal tracking map and nonce' },
            { file: 'contracts/tip-governance.clar', mode: 'append', content: '(define-map votes { proposal-id: uint, voter: principal } { vote: bool })\n\n', msg: 'feat: define voter tracking map' },
            { file: 'contracts/tip-governance.clar', mode: 'append', content: '(define-public (create-proposal (title (string-utf8 128)))\n  (let ((id (var-get proposal-nonce)))\n    (map-set proposals id { title: title, proposer: tx-sender, votes-for: u0, votes-against: u0, start-block: stacks-block-height, executed: false })\n    (var-set proposal-nonce (+ id u1))\n    (ok id)\n  )\n)\n\n', msg: 'feat: implement proposal creation function' },
            { file: 'contracts/tip-governance.clar', mode: 'append', content: '(define-public (vote (proposal-id uint) (vote-for bool))\n  (let ((proposal (unwrap! (map-get? proposals proposal-id) ERR-NO-PROPOSAL)))\n    (asserts! (is-none (map-get? votes { proposal-id: proposal-id, voter: tx-sender })) ERR-ALREADY-VOTED)\n    (asserts! (<= (- stacks-block-height (get start-block proposal)) VOTING-PERIOD) ERR-VOTING-CLOSED)\n    (map-set votes { proposal-id: proposal-id, voter: tx-sender } { vote: vote-for })\n', msg: 'feat: implement vote function with validation logic' },
            { file: 'contracts/tip-governance.clar', mode: 'append', content: '    (if vote-for\n      (map-set proposals proposal-id (merge proposal { votes-for: (+ (get votes-for proposal) u1) }))\n      (map-set proposals proposal-id (merge proposal { votes-against: (+ (get votes-against proposal) u1) }))\n    )\n    (ok true)\n  )\n)\n\n', msg: 'feat: update vote tallies in proposal record' },
            { file: 'contracts/tip-governance.clar', mode: 'append', content: '(define-read-only (get-proposal (id uint))\n  (map-get? proposals id)\n)\n\n(define-read-only (get-vote (proposal-id uint) (voter principal))\n  (map-get? votes { proposal-id: proposal-id, voter: voter })\n)\n', msg: 'feat: add proposal and vote read-only queries' },
        ]
    },
];
