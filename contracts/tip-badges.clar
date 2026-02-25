;; tip-badges.clar
;; NFT Achievement Badge System for Tipjar
;; Soulbound (non-transferable) achievement tokens
;; Clarity version 4, epoch 3.3

;; Define the NFT
(define-non-fungible-token tipjar-badge uint)

;; Error constants
(define-constant ERR-NOT-AUTHORIZED (err u501))
(define-constant ERR-BADGE-EXISTS (err u502))
(define-constant ERR-BADGE-NOT-FOUND (err u503))
(define-constant ERR-NOT-ELIGIBLE (err u504))
(define-constant ERR-TRANSFER-BLOCKED (err u505))
(define-constant CONTRACT-OWNER tx-sender)

;; Badge type definitions
(define-constant BADGE-FIRST-TIP u1)
(define-constant BADGE-GENEROUS-TIPPER u2)
(define-constant BADGE-WHALE-TIPPER u3)
(define-constant BADGE-STREAK-MASTER u4)
(define-constant BADGE-DIAMOND-HANDS u5)
(define-constant BADGE-TOP-CREATOR u6)

;; State variables
(define-data-var next-badge-id uint u1)
(define-data-var total-badges-minted uint u0)

