;; tip-recurring.clar
;; Recurring tip subscription contract for Tipjar
;; Clarity version 4, epoch 3.3

;; Error constants
(define-constant ERR-NOT-AUTHORIZED (err u401))
(define-constant ERR-TIER-EXISTS (err u402))
(define-constant ERR-TIER-NOT-FOUND (err u403))
(define-constant ERR-ALREADY-SUBSCRIBED (err u404))
(define-constant ERR-NOT-SUBSCRIBED (err u405))
(define-constant ERR-INSUFFICIENT-FUNDS (err u406))
(define-constant ERR-INVALID-EPOCHS (err u407))
(define-constant ERR-SUBSCRIPTION-EXPIRED (err u408))

;; Data variables
(define-data-var next-tier-id uint u1)
(define-data-var total-subscriptions uint u0)
(define-data-var total-recurring-volume uint u0)
(define-data-var platform-fee-bps uint u100) ;; 1% platform fee

