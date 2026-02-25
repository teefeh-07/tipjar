;; tip-escrow.clar
;; Conditional escrow tipping for Tipjar
;; Supports milestone, time-locked, and approval-based conditional tips
;; Clarity version 4, epoch 3.3

;; Error constants
(define-constant ERR-NOT-AUTHORIZED (err u701))
(define-constant ERR-ESCROW-NOT-FOUND (err u702))
(define-constant ERR-ALREADY-CLAIMED (err u703))
(define-constant ERR-CONDITIONS-NOT-MET (err u704))
(define-constant ERR-EXPIRED (err u705))
(define-constant ERR-NOT-EXPIRED (err u706))
(define-constant ERR-ZERO-AMOUNT (err u707))
(define-constant ERR-INVALID-TIMEOUT (err u708))

;; Escrow type constants
(define-constant ESCROW-TIME-LOCKED u1)
(define-constant ESCROW-MILESTONE u2)
(define-constant ESCROW-APPROVAL u3)

;; State variables
(define-data-var next-escrow-id uint u1)
(define-data-var total-escrowed uint u0)
(define-data-var total-released uint u0)
(define-data-var total-refunded uint u0)

;; Escrow data structure
(define-map escrows
  { escrow-id: uint }
  {
    sender: principal,
    recipient: principal,
    amount: uint,
    escrow-type: uint,
    memo: (string-ascii 128),
    created-block: uint,
    timeout-block: uint,
    claimed: bool,
    refunded: bool,
    condition-met: bool
  }
)

;; Create a new escrow tip
(define-public (create-escrow (recipient principal) (amount uint) (escrow-type uint) (memo (string-ascii 128)) (timeout-blocks uint))
  (let
    (
      (escrow-id (var-get next-escrow-id))
    )
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (asserts! (> timeout-blocks u0) ERR-INVALID-TIMEOUT)
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (map-set escrows
      { escrow-id: escrow-id }
      {
        sender: tx-sender,
        recipient: recipient,
        amount: amount,
        escrow-type: escrow-type,
        memo: memo,
        created-block: block-height,
        timeout-block: (+ block-height timeout-blocks),
        claimed: false,
        refunded: false,
        condition-met: false
      }
    )
    (var-set next-escrow-id (+ escrow-id u1))
    (var-set total-escrowed (+ (var-get total-escrowed) amount))
    (ok escrow-id)
  )
)

;; Mark condition as met (for milestone/approval types)
(define-public (mark-condition-met (escrow-id uint))
  (let
    (
      (escrow (unwrap! (map-get? escrows { escrow-id: escrow-id }) ERR-ESCROW-NOT-FOUND))
    )
    (asserts! (is-eq (get sender escrow) tx-sender) ERR-NOT-AUTHORIZED)
    (asserts! (not (get claimed escrow)) ERR-ALREADY-CLAIMED)
    (map-set escrows
      { escrow-id: escrow-id }
      (merge escrow { condition-met: true })
    )
    (ok true)
  )
)

;; Claim escrowed funds (recipient only)
(define-public (claim-escrow (escrow-id uint))
  (let
    (
      (escrow (unwrap! (map-get? escrows { escrow-id: escrow-id }) ERR-ESCROW-NOT-FOUND))
    )
    (asserts! (is-eq (get recipient escrow) tx-sender) ERR-NOT-AUTHORIZED)
    (asserts! (not (get claimed escrow)) ERR-ALREADY-CLAIMED)
    (asserts! (get condition-met escrow) ERR-CONDITIONS-NOT-MET)
    (map-set escrows
      { escrow-id: escrow-id }
      (merge escrow { claimed: true })
    )
    (var-set total-released (+ (var-get total-released) (get amount escrow)))
    (ok (get amount escrow))
  )
)

;; Refund expired escrow (sender only)
(define-public (refund-escrow (escrow-id uint))
  (let
    (
      (escrow (unwrap! (map-get? escrows { escrow-id: escrow-id }) ERR-ESCROW-NOT-FOUND))
    )
    (asserts! (is-eq (get sender escrow) tx-sender) ERR-NOT-AUTHORIZED)
    (asserts! (not (get claimed escrow)) ERR-ALREADY-CLAIMED)
    (asserts! (>= block-height (get timeout-block escrow)) ERR-NOT-EXPIRED)
    (map-set escrows
      { escrow-id: escrow-id }
      (merge escrow { refunded: true })
    )
    (var-set total-refunded (+ (var-get total-refunded) (get amount escrow)))
    (ok (get amount escrow))
  )
)

