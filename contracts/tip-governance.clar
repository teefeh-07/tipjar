;; Tip Governance - Community voting on platform params
;; Token holders can propose and vote on changes

(define-constant ERR-PROPOSAL-EXISTS (err u500))
(define-constant ERR-NO-PROPOSAL (err u501))
(define-constant ERR-ALREADY-VOTED (err u502))
(define-constant ERR-VOTING-CLOSED (err u503))
(define-constant VOTING-PERIOD u144)

