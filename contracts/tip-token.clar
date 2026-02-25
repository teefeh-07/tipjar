;; Tip Token - SIP-010 Loyalty Token
;; Rewards users for tipping activity

(define-fungible-token tip-token)

(define-constant ERR-NOT-OWNER (err u200))
(define-constant ERR-INSUFFICIENT-BALANCE (err u201))
(define-constant CONTRACT-OWNER tx-sender)

(define-read-only (get-name)
  (ok "Tip Token")
)

(define-read-only (get-symbol)
  (ok "TIPT")
)

(define-read-only (get-decimals)
  (ok u6)
)

(define-read-only (get-token-uri)
  (ok (some u"https://tipjar.app/token-metadata.json"))
)

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance tip-token account))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply tip-token))
)

