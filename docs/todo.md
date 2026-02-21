# TODO – Chiropraxia Košice

## 🔴 PRIORITA #1 (kritické)

- [ ] Oživiť booking flow end-to-end (`/rezervacia`) tak, aby bol funkčný v produkcii.
- [ ] Dokončiť Keystatic GitHub auth flow (login, callback, edit + publish).

## Booking – konkrétne kroky

- [ ] Overiť vytvorenie rezervácie cez API (`/api/book`) bez chýb.
- [ ] Overiť potvrdenie rezervácie v UI (success stav + validácie formulára).
- [ ] Overiť notifikácie (email) po rezervácii.
- [ ] Otestovať minimálne 1 kompletný E2E scenár pre booking (pass).

## Keystatic – konkrétne kroky

- [ ] Potvrdiť OAuth callback URL pre local aj production.
- [ ] Overiť, že `/api/keystatic/github/login` presmeruje správne na GitHub.
- [ ] Prihlásiť sa do Keystatic a overiť editáciu obsahu.
- [ ] Overiť publish/commit flow do repozitára.

## Stabilizácia po dokončení priority #1

- [ ] Spustiť `npm run check` a opraviť prípadné nové chyby.
- [ ] Spustiť `npm run build` a potvrdiť úspešný produkčný build.
- [ ] Aktualizovať deploy checklist podľa reálneho stavu.
