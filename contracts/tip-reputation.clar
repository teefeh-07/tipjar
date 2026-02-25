;; tip-reputation.clar
;; On-chain reputation scoring for Tipjar platform
;; Clarity version 4, epoch 3.3

;; Error constants
(define-constant ERR-NOT-AUTHORIZED (err u601))
(define-constant ERR-SCORE-OVERFLOW (err u602))
(define-constant ERR-COOLDOWN-ACTIVE (err u603))
(define-constant ERR-USER-NOT-FOUND (err u604))
(define-constant MAX-SCORE uint u1000)
(define-constant DECAY-RATE uint u10) ;; 1% per 1000 blocks
(define-constant DECAY-INTERVAL uint u1000)

;; Reputation score storage
(define-map reputation-scores
  { user: principal }
  {
    total-score: uint,
    tip-score: uint,
    consistency-score: uint,
    receiving-score: uint,
    governance-score: uint,
    badge-score: uint,
    last-activity-block: uint,
    last-updated-block: uint
  }
)

;; Activity cooldown to prevent gaming
(define-map activity-cooldown
  { user: principal }
  { last-action-block: uint, actions-this-block: uint }
)

;; Data variables for global tracking
(define-data-var total-scored-users uint u0)
(define-data-var highest-score uint u0)
(define-data-var max-actions-per-block uint u5)

;; Record tipping activity (called by tipjar contract)
(define-public (record-tip-activity (user principal))
  (let
    (
      (existing (default-to
        { total-score: u0, tip-score: u0, consistency-score: u0, receiving-score: u0, governance-score: u0, badge-score: u0, last-activity-block: u0, last-updated-block: u0 }
        (map-get? reputation-scores { user: user })
      ))
      (new-tip-score (+ (get tip-score existing) u1))
      (capped-tip (if (> new-tip-score u100) u100 new-tip-score))
      (new-total (+ capped-tip (get consistency-score existing) (get receiving-score existing) (get governance-score existing) (get badge-score existing)))
    )
    (map-set reputation-scores
      { user: user }
      (merge existing {
        tip-score: capped-tip,
        total-score: new-total,
        last-activity-block: block-height,
        last-updated-block: block-height
      })
    )
    (if (> new-total (var-get highest-score))
      (var-set highest-score new-total)
      true
    )
    (ok new-total)
  )
)

;; Record governance participation
(define-public (record-governance-activity (user principal))
  (let
    (
      (existing (default-to
        { total-score: u0, tip-score: u0, consistency-score: u0, receiving-score: u0, governance-score: u0, badge-score: u0, last-activity-block: u0, last-updated-block: u0 }
        (map-get? reputation-scores { user: user })
      ))
      (new-gov-score (+ (get governance-score existing) u10))
      (capped-gov (if (> new-gov-score u50) u50 new-gov-score))
      (new-total (+ (get tip-score existing) (get consistency-score existing) (get receiving-score existing) capped-gov (get badge-score existing)))
    )
    (map-set reputation-scores
      { user: user }
      (merge existing {
        governance-score: capped-gov,
        total-score: new-total,
        last-activity-block: block-height,
        last-updated-block: block-height
      })
    )
    (ok new-total)
  )
)

