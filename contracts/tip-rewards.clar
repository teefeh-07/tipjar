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

(define-public (record-tip)
  (let ((existing (default-to { current-streak: u0, longest-streak: u0, last-tip-block: u0 } (map-get? user-streaks tx-sender))))
    (map-set user-streaks tx-sender
      { current-streak: (+ (get current-streak existing) u1),
        longest-streak: (if (> (+ (get current-streak existing) u1) (get longest-streak existing)) (+ (get current-streak existing) u1) (get longest-streak existing)),
        last-tip-block: stacks-block-height })
    (ok true)
  )
)

(define-read-only (get-streak (user principal))
  (map-get? user-streaks user)
)

