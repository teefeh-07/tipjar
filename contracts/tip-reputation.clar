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

