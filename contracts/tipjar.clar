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
