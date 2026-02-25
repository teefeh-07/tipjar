;; Tipjar - Core tipping smart contract
;; Built with Clarity 4, epoch 3.3

;; Error constants
(define-constant ERR-INVALID-AMOUNT (err u100))
(define-constant ERR-TRANSFER-FAILED (err u101))
(define-constant ERR-NOT-AUTHORIZED (err u102))
(define-constant ERR-CREATOR-NOT-FOUND (err u103))

;; Data variables
(define-data-var contract-owner principal tx-sender)
(define-data-var total-tips-sent uint u0)
(define-data-var total-tip-count uint u0)

;; Maps
(define-map tips { sender: principal, recipient: principal } { amount: uint, timestamp: uint })
(define-map creator-totals { creator: principal } { total-received: uint, tip-count: uint })
(define-map registered-creators principal bool)

;; Public functions
(define-public (send-tip (recipient principal) (amount uint))
  (begin
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (try! (stx-transfer? amount tx-sender recipient))
    (map-set tips { sender: tx-sender, recipient: recipient }
      { amount: amount, timestamp: stacks-block-height })
    (var-set total-tips-sent (+ (var-get total-tips-sent) amount))
    (var-set total-tip-count (+ (var-get total-tip-count) u1))
    (ok amount)
  )
)

(define-public (register-creator)
  (begin
    (map-set registered-creators tx-sender true)
    (map-set creator-totals { creator: tx-sender } { total-received: u0, tip-count: u0 })
    (ok true)
  )
)

;; Read-only functions
(define-read-only (get-tip (sender principal) (recipient principal))
  (map-get? tips { sender: sender, recipient: recipient })
)

(define-read-only (get-creator-totals (creator principal))
  (map-get? creator-totals { creator: creator })
)

(define-read-only (get-total-tips)
  (ok (var-get total-tips-sent))
)

(define-read-only (get-tip-count)
  (ok (var-get total-tip-count))
)

