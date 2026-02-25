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

