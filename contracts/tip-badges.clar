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

;; Badge metadata storage
(define-map badge-metadata
  { badge-id: uint }
  {
    badge-type: uint,
    owner: principal,
    name: (string-ascii 64),
    description: (string-ascii 256),
    image-uri: (string-ascii 256),
    earned-at-block: uint
  }
)

;; Track which badges a user has earned
(define-map user-badges
  { user: principal, badge-type: uint }
  { badge-id: uint, earned: bool }
)

;; Mint achievement badge (admin only)
(define-public (mint-badge (recipient principal) (badge-type uint) (name (string-ascii 64)) (description (string-ascii 256)) (image-uri (string-ascii 256)))
  (let
    (
      (badge-id (var-get next-badge-id))
    )
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (asserts! (is-none (map-get? user-badges { user: recipient, badge-type: badge-type })) ERR-BADGE-EXISTS)
    (try! (nft-mint? tipjar-badge badge-id recipient))
    (map-set badge-metadata
      { badge-id: badge-id }
      {
        badge-type: badge-type,
        owner: recipient,
        name: name,
        description: description,
        image-uri: image-uri,
        earned-at-block: block-height
      }
    )
    (map-set user-badges
      { user: recipient, badge-type: badge-type }
      { badge-id: badge-id, earned: true }
    )
    (var-set next-badge-id (+ badge-id u1))
    (var-set total-badges-minted (+ (var-get total-badges-minted) u1))
    (ok badge-id)
  )
)

;; Read-only: check if user has specific badge
(define-read-only (has-badge (user principal) (badge-type uint))
  (is-some (map-get? user-badges { user: user, badge-type: badge-type }))
)

;; Read-only: get badge metadata
(define-read-only (get-badge-info (badge-id uint))
  (map-get? badge-metadata { badge-id: badge-id })
)

;; Read-only: get total badges minted
(define-read-only (get-total-badges)
  (var-get total-badges-minted)
)

;; Read-only: get badge URI for display
(define-read-only (get-token-uri (badge-id uint))
  (ok (get image-uri (unwrap! (map-get? badge-metadata { badge-id: badge-id }) ERR-BADGE-NOT-FOUND)))
)
