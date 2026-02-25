;; tip-treasury.clar
;; Multi-signature treasury for platform fee management
;; Clarity version 4, epoch 3.3

;; Error constants
(define-constant ERR-NOT-SIGNER (err u801))
(define-constant ERR-ALREADY-SIGNED (err u802))
(define-constant ERR-THRESHOLD-NOT-MET (err u803))
(define-constant ERR-PROPOSAL-NOT-FOUND (err u804))
(define-constant ERR-ALREADY-EXECUTED (err u805))
(define-constant ERR-INSUFFICIENT-BALANCE (err u806))
(define-constant ERR-AMOUNT-TOO-LARGE (err u807))
(define-constant ERR-TIME-LOCK-ACTIVE (err u808))

;; Configuration
(define-constant THRESHOLD u2) ;; 2-of-3 multi-sig
(define-constant MAX-WITHDRAWAL uint u10000000000) ;; 10,000 STX max
(define-constant TIME-LOCK-BLOCKS uint u144) ;; ~1 day for large amounts
(define-constant LARGE-AMOUNT-THRESHOLD uint u1000000000) ;; 1,000 STX

;; State
(define-data-var next-proposal-id uint u1)
(define-data-var treasury-balance uint u0)
(define-data-var total-received uint u0)
(define-data-var total-disbursed uint u0)

;; Spending proposal structure
(define-map spending-proposals
  { proposal-id: uint }
  {
    proposer: principal,
    recipient: principal,
    amount: uint,
    description: (string-ascii 256),
    approvals: uint,
    executed: bool,
    created-block: uint
  }
)

;; Track signer approvals
(define-map proposal-signers
  { proposal-id: uint, signer: principal }
  { approved: bool }
)

;; Receive platform fees
(define-public (deposit-fee (amount uint))
  (begin
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (var-set treasury-balance (+ (var-get treasury-balance) amount))
    (var-set total-received (+ (var-get total-received) amount))
    (ok true)
  )
)

;; Create spending proposal
(define-public (create-spending-proposal (recipient principal) (amount uint) (description (string-ascii 256)))
  (let
    (
      (proposal-id (var-get next-proposal-id))
    )
    (asserts! (<= amount (var-get treasury-balance)) ERR-INSUFFICIENT-BALANCE)
    (asserts! (<= amount MAX-WITHDRAWAL) ERR-AMOUNT-TOO-LARGE)
    (map-set spending-proposals
      { proposal-id: proposal-id }
      {
        proposer: tx-sender,
        recipient: recipient,
        amount: amount,
        description: description,
        approvals: u1,
        executed: false,
        created-block: block-height
      }
    )
    (map-set proposal-signers
      { proposal-id: proposal-id, signer: tx-sender }
      { approved: true }
    )
    (var-set next-proposal-id (+ proposal-id u1))
    (ok proposal-id)
  )
)

;; Approve spending proposal
(define-public (approve-proposal (proposal-id uint))
  (let
    (
      (proposal (unwrap! (map-get? spending-proposals { proposal-id: proposal-id }) ERR-PROPOSAL-NOT-FOUND))
    )
    (asserts! (not (get executed proposal)) ERR-ALREADY-EXECUTED)
    (asserts! (is-none (map-get? proposal-signers { proposal-id: proposal-id, signer: tx-sender })) ERR-ALREADY-SIGNED)
    (map-set proposal-signers
      { proposal-id: proposal-id, signer: tx-sender }
      { approved: true }
    )
    (map-set spending-proposals
      { proposal-id: proposal-id }
      (merge proposal { approvals: (+ (get approvals proposal) u1) })
    )
    (ok (+ (get approvals proposal) u1))
  )
)

;; Read-only: get treasury balance
(define-read-only (get-treasury-balance)
  (var-get treasury-balance)
)

;; Read-only: get proposal details
(define-read-only (get-proposal (proposal-id uint))
  (map-get? spending-proposals { proposal-id: proposal-id })
)

;; Read-only: get treasury stats
(define-read-only (get-treasury-stats)
  {
    balance: (var-get treasury-balance),
    total-received: (var-get total-received),
    total-disbursed: (var-get total-disbursed),
    pending-proposals: (- (var-get next-proposal-id) u1)
  }
)
