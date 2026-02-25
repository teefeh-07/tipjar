;; Tip Registry - Creator directory on-chain
;; Manages creator profiles that accept tips

(define-constant ERR-ALREADY-REGISTERED (err u300))
(define-constant ERR-NOT-REGISTERED (err u301))
(define-constant ERR-INVALID-NAME (err u302))

(define-map creators principal
  {
    name: (string-utf8 64),
    description: (string-utf8 256),
    category: (string-utf8 32),
    active: bool
  }
)

(define-data-var creator-count uint u0)

(define-public (register (name (string-utf8 64)) (description (string-utf8 256)) (category (string-utf8 32)))
  (begin
    (asserts! (is-none (map-get? creators tx-sender)) ERR-ALREADY-REGISTERED)
    (asserts! (> (len name) u0) ERR-INVALID-NAME)
    (map-set creators tx-sender { name: name, description: description, category: category, active: true })
    (var-set creator-count (+ (var-get creator-count) u1))
    (ok true)
  )
)

(define-public (update-profile (name (string-utf8 64)) (description (string-utf8 256)) (category (string-utf8 32)))
  (begin
    (asserts! (is-some (map-get? creators tx-sender)) ERR-NOT-REGISTERED)
    (map-set creators tx-sender { name: name, description: description, category: category, active: true })
    (ok true)
  )
)

