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

;; Subscription tier data structure
(define-map subscription-tiers
  { tier-id: uint }
  {
    creator: principal,
    name: (string-ascii 64),
    amount-per-epoch: uint,
    perks: (string-ascii 256),
    subscriber-count: uint,
    active: bool
  }
)

;; Active subscription data structure
(define-map active-subscriptions
  { subscriber: principal, tier-id: uint }
  {
    start-block: uint,
    end-block: uint,
    epochs-remaining: uint,
    last-processed-block: uint,
    total-paid: uint
  }
)

;; Creator earnings tracker
(define-map creator-recurring-earnings
  { creator: principal }
  { total-earned: uint, active-subscribers: uint }
)

;; Create a new subscription tier
(define-public (create-subscription-tier (name (string-ascii 64)) (amount uint) (perks (string-ascii 256)))
  (let
    (
      (tier-id (var-get next-tier-id))
    )
    (asserts! (> amount u0) ERR-INSUFFICIENT-FUNDS)
    (map-set subscription-tiers
      { tier-id: tier-id }
      {
        creator: tx-sender,
        name: name,
        amount-per-epoch: amount,
        perks: perks,
        subscriber-count: u0,
        active: true
      }
    )
    (var-set next-tier-id (+ tier-id u1))
    (ok tier-id)
  )
)

;; Subscribe to a creator tier
(define-public (subscribe (tier-id uint) (num-epochs uint))
  (let
    (
      (tier (unwrap! (map-get? subscription-tiers { tier-id: tier-id }) ERR-TIER-NOT-FOUND))
      (total-cost (* (get amount-per-epoch tier) num-epochs))
      (current-block block-height)
    )
    (asserts! (> num-epochs u0) ERR-INVALID-EPOCHS)
    (asserts! (is-none (map-get? active-subscriptions { subscriber: tx-sender, tier-id: tier-id })) ERR-ALREADY-SUBSCRIBED)
    (try! (stx-transfer? total-cost tx-sender (get creator tier)))
    (map-set active-subscriptions
      { subscriber: tx-sender, tier-id: tier-id }
      {
        start-block: current-block,
        end-block: (+ current-block (* num-epochs u2100)),
        epochs-remaining: num-epochs,
        last-processed-block: current-block,
        total-paid: total-cost
      }
    )
    (var-set total-subscriptions (+ (var-get total-subscriptions) u1))
    (var-set total-recurring-volume (+ (var-get total-recurring-volume) total-cost))
    (ok true)
  )
)

;; Cancel subscription and refund remaining epochs
(define-public (cancel-subscription (tier-id uint))
  (let
    (
      (sub (unwrap! (map-get? active-subscriptions { subscriber: tx-sender, tier-id: tier-id }) ERR-NOT-SUBSCRIBED))
      (tier (unwrap! (map-get? subscription-tiers { tier-id: tier-id }) ERR-TIER-NOT-FOUND))
      (refund-amount (* (get epochs-remaining sub) (get amount-per-epoch tier)))
    )
    (map-delete active-subscriptions { subscriber: tx-sender, tier-id: tier-id })
    (var-set total-subscriptions (- (var-get total-subscriptions) u1))
    (ok refund-amount)
  )
)

