;; Tip Governance - Community voting on platform params
;; Token holders can propose and vote on changes

(define-constant ERR-PROPOSAL-EXISTS (err u500))
(define-constant ERR-NO-PROPOSAL (err u501))
(define-constant ERR-ALREADY-VOTED (err u502))
(define-constant ERR-VOTING-CLOSED (err u503))
(define-constant VOTING-PERIOD u144)

(define-data-var proposal-nonce uint u0)

(define-map proposals uint
  { title: (string-utf8 128), proposer: principal, votes-for: uint, votes-against: uint, start-block: uint, executed: bool }
)

(define-map votes { proposal-id: uint, voter: principal } { vote: bool })

(define-public (create-proposal (title (string-utf8 128)))
  (let ((id (var-get proposal-nonce)))
    (map-set proposals id { title: title, proposer: tx-sender, votes-for: u0, votes-against: u0, start-block: stacks-block-height, executed: false })
    (var-set proposal-nonce (+ id u1))
    (ok id)
  )
)

(define-public (vote (proposal-id uint) (vote-for bool))
  (let ((proposal (unwrap! (map-get? proposals proposal-id) ERR-NO-PROPOSAL)))
    (asserts! (is-none (map-get? votes { proposal-id: proposal-id, voter: tx-sender })) ERR-ALREADY-VOTED)
    (asserts! (<= (- stacks-block-height (get start-block proposal)) VOTING-PERIOD) ERR-VOTING-CLOSED)
    (map-set votes { proposal-id: proposal-id, voter: tx-sender } { vote: vote-for })
    (if vote-for
      (map-set proposals proposal-id (merge proposal { votes-for: (+ (get votes-for proposal) u1) }))
      (map-set proposals proposal-id (merge proposal { votes-against: (+ (get votes-against proposal) u1) }))
    )
    (ok true)
  )
)

(define-read-only (get-proposal (id uint))
  (map-get? proposals id)
)

(define-read-only (get-vote (proposal-id uint) (voter principal))
  (map-get? votes { proposal-id: proposal-id, voter: voter })
)
