# Image Sources - Business: JMW deep dive

Both images are JMW's own official product photography, per the 0차 manufacturer-first rule.
Editorial use for product identification; implies no sponsorship or endorsement.

- `jmw-air-collection-ms8001a.jpg` — JMW official shop product image for the AIR COLLECTION
  MS8001A flagship dryer. Source: http://www.jmwkorea.com/data/item/1901010059/MS8001A.png
  (500x500 original, trimmed and re-set on a white 1000px canvas).
- `jmw-airjet-turbo-ms6020b.jpg` — JMW official shop product image for the AIRJET Turbo MS6020B.
  Source: http://www.jmwkorea.com/data/item/1901010056/MS6020B.png (same treatment).

Note: jmwkorea.com serves a self-signed TLS certificate, so fetches used `curl -k` with a browser
UA. The site's full-size product images live at `/data/item/{id}/{MODEL}.png` — the `thumb-`
prefixed 270px versions 404 without the prefix pattern; the bare model-name path returns 500px.
