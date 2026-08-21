# 2026-08-21_194 — Korean gift etiquette, image sources

Visual system: **swap-card** (`render-swapcard.py`), new for this batch. Every card is a pair — the
thing not to give above, the thing to give instead below, on a contrasting band. A reader who takes
only the bottom half has still taken the useful half.

Not a repeat: `ticket-stub` leads on a date, `location-slate` on a place plus its transit line,
`spec-split` on a product and its numbers. None of them is a paired opposite, and none divides the
card into two halves that mean different things. The structure also carries the tone — a taboo list
can read as scolding, and giving every "do not" an immediate "instead" keeps it useful, which is how
the source article frames it.

## Cards

| Card | File | What is in it | Source |
|---|---|---|---|
| 01 | wrapped-gift-boxes.jpg | Wrapped gift boxes with ribbon | Pexels 5402562, via post 194 |
| 02 | card_02-shoes.jpg | A pair of brown leather dress shoes | Pexels 33039735, Ermin Ribić |
| 03 | card_03-red-pen.jpg | A red pen beside a lined notepad | Pexels 7334777, Soumith Soman |
| 04 | card_04-knives.jpg | Two kitchen knives, wooden handles | Pexels 16457340, Sternsteiger Stahlwaren |
| 05 | seoul-market-stalls.jpg | A Seoul market street of produce stalls with Korean signage | Pexels 37785270, via post 194 |
| 06 | card_06-two-hands.jpg | Two people exchanging a wrapped box, both using both hands | Pexels 5493207, Adventure Studio |
| 07 | ikseondong-shopping-street.jpg | A hanok-lined alley of shops in Ikseon-dong | via post 194 |

All four new Pexels IDs were checked with `audit-image-uniqueness --check-id` before download; none
appears elsewhere on the site.

**Cards 02–04 declare `subject_note`.** The object in frame is the one the card tells you *not* to
give, which is the inverse of the usual contract, so the exemption is claimed explicitly rather than
letting the gate pass it silently.

**Cards 02, 03, 04 and 06 are culturally neutral close-ups** rather than Korean scenes. That is the
sanctioned fallback: shoes, a red pen and knives are the subjects themselves, and a Korean-specific
frame would add nothing a reader needs. Cards 01, 05 and 07 carry the Korean setting.

## A mislabelled image found in the source post, and removed

Post 194's ogImage was `seoul-outdoor-gift-shop.jpg`, captioned "a Seoul outdoor shop, the kind of
place travellers browse for small gifts, snacks, and practical souvenirs."

**The photograph is a machine-parts street.** 모타·전동공구 signage, scrap machinery stacked on the
pavement, a man standing among it. Nothing in the frame is a gift. So the caption contradicted the
picture, and because it was the ogImage, the article's card on the home grid advertised a gift guide
with a photograph of a hardware alley.

It has been deleted from the post and from disk, and the ogImage moved to `wrapped-gift-boxes.jpg`.
Post 194 still reviews at 100/100 with three body images. Recorded in the post's own
`image-sources.md` as well, since that is where the next person will look.

## Rejected
- **Museum bojagi (보자기) textiles from Commons.** Visually lovely and genuinely Korean, and rejected:
  they are Joseon-era and museum-held, so using one on a card about how to present a gift today would
  imply people wrap presents in antique cloth. They do not.
- **Christmas-themed gift photography.** Several of the best-composed "two hands giving" results carry
  holly, red-and-green wrapping or a tree. Korea's gift occasions are Chuseok, Seollal, housewarmings
  and visits; a Christmas frame would date and mislocate the whole carousel.
