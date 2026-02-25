;; Tip Rewards - Streak and bonus management
;; Incentivizes consistent tipping behavior

(define-constant ERR-NO-STREAK (err u400))
(define-constant ERR-COOLDOWN (err u401))
(define-constant STREAK-THRESHOLD u5)
(define-constant REWARD-MULTIPLIER u2)

(define-map user-streaks principal
  { current-streak: uint, longest-streak: uint, last-tip-block: uint }
)

(define-map reward-claims principal { total-claimed: uint, last-claim-block: uint })

