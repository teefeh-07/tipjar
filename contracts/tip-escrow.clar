;; tip-escrow.clar
;; Conditional escrow tipping for Tipjar
;; Supports milestone, time-locked, and approval-based conditional tips
;; Clarity version 4, epoch 3.3

;; Error constants
(define-constant ERR-NOT-AUTHORIZED (err u701))
(define-constant ERR-ESCROW-NOT-FOUND (err u702))
(define-constant ERR-ALREADY-CLAIMED (err u703))
(define-constant ERR-CONDITIONS-NOT-MET (err u704))
(define-constant ERR-EXPIRED (err u705))
(define-constant ERR-NOT-EXPIRED (err u706))
(define-constant ERR-ZERO-AMOUNT (err u707))
(define-constant ERR-INVALID-TIMEOUT (err u708))

;; Escrow type constants
(define-constant ESCROW-TIME-LOCKED u1)
(define-constant ESCROW-MILESTONE u2)
(define-constant ESCROW-APPROVAL u3)

