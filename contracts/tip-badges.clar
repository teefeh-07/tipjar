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

