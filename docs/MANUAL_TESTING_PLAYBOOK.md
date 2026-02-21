# 🧪 Manuálny Testovací Scenár (User Acceptance Testing)

Tento dokument slúži na **finálne overenie funkčnosti** celého webu v produkčnom prostredí (na Verceli). Prejdite tieto body krok po kroku.

---

## 🛑 1. Testovanie Rezervačného Systému (Booking Widget)

*Toto je najkritickejšia časť. Testujte ako bežný zákazník.*

### Scenár A: Úspešná rezervácia (Happy Path)

1. Otvorte stránku `/rezervacia`.
2. Vyberte službu **"Vstupná konzultácia"**.
3. V kalendári nájdite **voľný termín** (biely, klikateľný) a kliknite naň.
4. Vyplňte formulár:
   * Meno: `Test Testovač`
   * Email: `vas.osobny.email@gmail.com` (aby ste videli, či príde správa)
   * Tel: `0900 000 000`
   * Zaškrtnite **GDPR súhlas**.
5. Kliknite **"Potvrdiť rezerváciu"**.
6. **Očakávaný výsledok:**
   * ✅ Zobrazí sa hláška "Rezervácia úspešná!".
   * ✅ Do 2 minút vám príde **potvrdzovací email** (ak sú SMTP údaje vo Verceli správne).
   * ✅ V Supabase (tabuľka `bookings`) pribudne nový riadok.

### Scenár B: Validácia chýb (Negative Testing)

1. Znovu otvorte `/rezervacia`.
2. Vyberte službu a čas.
3. **Nevyplňte** Meno ani Email.
4. Skúste kliknúť **"Potvrdiť rezerváciu"**.
5. **Očakávaný výsledok:**
   * ✅ Systém vás nepustí ďalej.
   * ✅ Políčka s chybou sa zvýraznia (červený rámik alebo hláška).

### Scenár C: Konflikt termínov (Double Booking)

*Na tento test potrebujete dve okná prehliadača (alebo mobil a počítač).*

1. V okne A vyberte termín (napr. Pondelok 10:00) ale **ešte nepotvrdzujte**.
2. V okne B (iný prehliadač) vyberte **ten istý termín** (Pondelok 10:00) a rýchlo ho **potvrďte**.
3. Vráťte sa do okna A a skúste potvrdiť tiež.
4. **Očakávaný výsledok:**
   * ✅ Okno A vyhodí chybu "Termín je už obsadený" (alebo podobnú).
   * ✅ V databáze je len jedna rezervácia na tento čas.

---

## 📝 2. Testovanie Obsahu (CMS)

*Overenie, že viete meniť texty a blogy bez programátora.*

1. Choďte na adresu `/keystatic` (na vašom webe).
2. Prihláste sa (keďže je to lokálne/git based, na produkcii to môže fungovať inak v závislosti od nastavenia Keystatic Cloud, alebo len lokálne commitujete zmeny).
   * *Poznámka: Ak nemáte nastavený GitHub OAuth, Keystatic beží najlepšie lokálne (`npm run dev`), kde upravíte článok a tie zmeny sa pushnú na GitHub.*
3. Skúste upraviť **titulok** niektorého článku.
4. Uložte zmeny.
5. **Očakávaný výsledok:**
   * ✅ Zmena sa prejaví v súbore `.mdx`.
   * ✅ Po nasadení (deploy) sa zmení text na webe.

---

## 📱 3. Testovanie Responzivity (Mobil)

1. Otvorte web na svojom **mobile** (iPhone/Android).
2. Skontrolujte:
   * ✅ Hamburger menu (tri čiarky vpravo hore) funguje a otvára sa.
   * ✅ Rezervačný formulár sa zmestí na obrazovku (neuchádza do strany).
   * ✅ Tlačidlá sú dosť veľké na kliknutie prstom.
   * ✅ Pätička (Footer) s mapou vyzerá dobre.

---

## 🗄️ 4. Kontrola Dát (Admin Pohľad)

1. Prihláste sa do **Supabase Dashboard**.
2. Otvorte **Table Editor** -> **bookings**.
3. **Očakávaný výsledok:**
   * ✅ Vidíte tam všetky testovacie rezervácie, ktoré ste práve spravili.
   * ✅ Skontrolujte stĺpec `client_email` a `booking_date`.

---

## 🧹 5. Upratovanie po teste

Keď všetko otestujete a funguje to:

1. V **Supabase** vymažte testovacie riadky z tabuľky `bookings` (označiť -> Delete), aby mal klient čistú databázu.
2. Hotovo! Web je pripravený pre klientov. 🥂
