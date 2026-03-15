# 💎 Project Crystal Roadmap

Tento dokument definuje plán na transformáciu projektu na "Luxury" úroveň a kompletné prekopanie Admin sekcie.

## 🏗 Fáza 1: Admin Sekcia 2.0 (The "200%" Overhaul)

Cieľ: Profesionálny, rýchly a intuitívny dashboard.

### 1.1 Architektúra & Refactoring

- [ ] **Rozbitie Monolitu**: Rozdeliť `AdminDashboard.tsx` na:
  - `BookingManager` (Manažment rezervácií)
  - `StaffManager` (Tím)
  - `SettingsManager` (Nastavenia)
  - `LinksManager` (Nová sekcia)
- [ ] **Layout**: Vytvoriť `AdminLayout` so sidebarom a breadcrumbs navigáciou.

### 1.2 Nové Funkcie

- [ ] **Kalendár**: Implementovať `react-big-calendar` pre vizuálny prehľad týždňa/mesiaca.
- [ ] **Filtrovanie**: Pridať "Date Range Picker" a vyhľadávanie podľa mena/emailu.
- [ ] **Externé Odkazy (Nová Sekcia)**: Pridať sekciu/tab "Užitočné Odkazy", ktorá bude obsahovať karty s odkazmi na:
  - Keystatic (CMS pre Blog/Služby)
  - Supabase Dashboard
  - Analytics

### 1.3 Testovanie (200% Coverage)

- [ ] **E2E Scenáre**:
  - CRUD operácie zamestnancov (Lifecycle).
  - Editácia rezervácie (Time/Date/Service zmena).
  - Validácia nastavenia otváracích hodín.
- [ ] **Mobile Testing**: Overiť responzivitu tabuliek a modálov na mobile.

---

## ✨ Fáza 2: Premium & Luxury UI Polish

Cieľ: Aplikácia musí pôsobiť "dravo" a exkluzívne.

### 2.1 Atmosféra & Efekty

- [ ] **Aurora Borealis 2.0**: Vylepšiť existujúce pozadia o jemnejšie, pomalšie animácie (znížiť rýchlosť, zvýšiť blur).
- [ ] **Glassmorphism**: Zjednotiť "sklenené" karty. Pridať jemný `border-white/10` a `backdrop-blur-xl` všade.
- [ ] **Typografia**: Zvýšiť letter-spacing pre nadpisy (tracking-wide) pre "luxury" feel.

### 2.2 Mikro-interakcie (Framer Motion)

- [ ] **Tlačidlá**: Pridať `scale` efekt pri hoveri a jemný `glow` efekt.
- [ ] **Prechody stránok**: Implementovať `AnimatePresence` pre plynulé prechody medzi tabmi v Admine a stránkami webu.
- [ ] **Scroll Reveal**: Pridať jemné odhalenie prvkov (`y: 20 -> 0`, `opacity: 0 -> 1`) pri scrollovaní.

### 2.3 Detaily

- [ ] **Loading States**: Vymeniť "Loading..." texty za skeleton animácie (`pulse`).
- [ ] **Interaktívne elementy**: Pridať magnetický efekt na dôležité CTA tlačidlá.

---

## 🚀 Fáza 3: Finálne Ladenie

- [ ] **Performance Audit**: Lighthouse skóre 95+ (SEO, Accessibility).
- [ ] **Bug Hunting**: Prejsť celú flow aplikácie a opraviť vizuálne glitche.
