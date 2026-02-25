;; tip-treasury.clar
;; Multi-signature treasury for platform fee management
;; Clarity version 4, epoch 3.3

;; Error constants
(define-constant ERR-NOT-SIGNER (err u801))
(define-constant ERR-ALREADY-SIGNED (err u802))
(define-constant ERR-THRESHOLD-NOT-MET (err u803))
(define-constant ERR-PROPOSAL-NOT-FOUND (err u804))
(define-constant ERR-ALREADY-EXECUTED (err u805))
(define-constant ERR-INSUFFICIENT-BALANCE (err u806))
(define-constant ERR-AMOUNT-TOO-LARGE (err u807))
(define-constant ERR-TIME-LOCK-ACTIVE (err u808))

;; Configuration
(define-constant THRESHOLD u2) ;; 2-of-3 multi-sig
(define-constant MAX-WITHDRAWAL uint u10000000000) ;; 10,000 STX max
(define-constant TIME-LOCK-BLOCKS uint u144) ;; ~1 day for large amounts
(define-constant LARGE-AMOUNT-THRESHOLD uint u1000000000) ;; 1,000 STX

