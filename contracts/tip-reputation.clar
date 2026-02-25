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

