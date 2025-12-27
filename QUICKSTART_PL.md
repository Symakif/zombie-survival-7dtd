🧟 ZOMBIE SURVIVAL - 7 DAYS TO DIE
═════════════════════════════════════════════

## ⚡ QUICK START (15 minut)

### 1️⃣ INSTALACJA (Windows)

```bash
# Otwórz PowerShell jako Administrator

# Zainstaluj Node.js (jeśli nie masz):
# https://nodejs.org (LTS wersja)

# Sklonuj projekt:
git clone https://github.com/yourusername/zombie-survival-7dtd.git
cd zombie-survival-7dtd

# Zainstaluj zależności:
npm install

# Utwórz bazę danych (PostgreSQL):
# Pobierz z: https://postgresql.org/download/windows/
# Lub użyj Docker:
docker run -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:15

# Utwórz plik konfiguracji:
# Edytuj .env.local
DATABASE_URL="postgresql://postgres:password@localhost:5432/zombie_db"
NEXTAUTH_SECRET="wygeneruj: openssl rand -base64 32"

# Setup bazy danych:
npx prisma migrate dev --name init

# Uruchom grę:
npm run dev

# Otwórz w przeglądarce:
# http://localhost:3000/game
```

### 2️⃣ STEROWANIE W GRZE

```
RUCH:
  W - Do przodu
  A - W lewo
  S - Do tyłu
  D - W prawo
  SPACE - Skok

PATRZENIE:
  Mysz - Patrzenie dookoła
  Kliknij - Lock cursor

AKCJE:
  E - Podnieś przedmiot / Wejdź do budynku
  B - Tryb budowania (ściany, drzwi)
  I - Otworzy ekwipunek
  R - Przeładuj broń
  F - Latarka (nocą)
  LPM - Atak
  PPM - Celowanie

EKWIPUNEK:
  1-9 - Szybkie sloty
```

### 3️⃣ GAMEPLAY LOOP

1. **Spawn w ruinach miasta**
   - Start z podstawowym wyposażeniem
   - Otoczenie: puste domy, rozbite okna, korupcja

2. **Eksploracja i Lootowanie**
   - Przeszukuj supermarkety (jedzenie, narzędzia)
   - Domy (ubranie, narzędzia, książki)
   - Szpitale (leki, bandaże, antybiotyki)
   - Policja (amunicja, broń, pancerz)

3. **Crafting**
   - Drewno + Kamień → Drewniany Kilof
   - Surowe Mięso → Gotowane Mięso
   - Drewno + Gwoździe → Blok drewniany
   - 50+ przepisów dostępnych!

4. **Building Base**
   - Postaw ściany do obrony
   - Umocnij drzwi
   - Stworz łapki/pułapki
   - Wzmocnij fundamenty (drewno → beton → stal)

5. **Survival Mechanics**
   - ❤️ Zdrowie: -1 HP/sec bez opieki
   - 🍖 Głód: -1 HP/min jeśli 0
   - 💧 Pragnienie: -2 HP/min jeśli 0
   - 🦠 Zarażenie: Ugryzienie zombie → infekacja → śmierć
   - ⚡ Zmęczenie: Sprint kosztuje staminkę

6. **Zombie Attack (Night Hordes)**
   - Co 7 dni: HORDA zombie!
   - Więcej zombie nocą
   - Różne typy: Walker, Runner, Cop, Spitter, Smutki
   - Bronimy bazę = survive!

7. **Progression**
   - Zabiń zombie → doświadczenie
   - Level up → perki
   - Research → nowe umiejętności
   - Ewentualnie: większe hord, boss zombies

### 4️⃣ ZOMBIE TYPES

| Typ | HP | Speed | Damage | Ability |
|-----|----|----|--------|---------|
| **Walker** | 50 | Powolny | 5 | Szuka jedzenia |
| **Runner** | 30 | Szybki | 8 | Sprinter |
| **Cop** | 100 | Średni | 15 | Kąsa na dystans |
| **Spitter** | 40 | Powolny | 12 | Pluje kwasem |
| **Smutki** | 80 | BARDZO szybki | 10 | Nocny śmieciarz |

### 5️⃣ CRAFTING RECIPES (Top 10)

```
🛠️ TOOLS:
  - Drewniany Kilof: 15 drewna + 5 kamień + 2 lina
  - Kamień Kilof: 20 kamień + 10 drewna + 3 lina
  - Warsztat: 30 drewna + 20 gwoździ + 10 żelaza

⚔️ WEAPONS:
  - Drewniany Klub: 10 drewna + 2 lina (start!)
  - Maczeta: 30 żelaza + 5 drewna
  - Karabin Myśliwski: 50 żelaza + 20 drewna + 15 prochu

🛡️ ARMOR:
  - Zbroja Skórzana: 30 skóry + 10 lin + 20 gwoździ
  - Zbroja Stalowa: 80 żelaza + 20 skóry + 40 gwoździ

⚕️ MEDICAL:
  - Bandaż: 3 tkanina + 2 włókno roślinne
  - Antybiotyki: 5 ziół + 2 węgiel + 1 szkło (ważne!)

🍖 FOOD:
  - Gotowane Mięso: 1 surowe mięso (szybko!)
  - Chleb: 3 mąka + 1 sól + 2 woda
```

### 6️⃣ BUILDING BLOCKS

```
Drewniany Blok (2 HP): Start obrony
  - 5 drewna + 5 gwoździ
  - Łatwo niszczyć

Blok Betonowy (50 HP): Średnia obrona
  - 5 cement + 10 żwir + 2 woda
  - Solidny i trwały

Stalowy Blok (100 HP): Końcowa obrona!
  - 15 żelaza + 5 węgla
  - Prawie nie do zniszczenia
```

### 7️⃣ TIPS & TRICKS

✅ **Przetrwaj noce:**
  - Zbuduj bazę defensywną
  - Umieść pułapki wokół
  - Zapalaj latarkę w ciemności
  - Nie wychodzę nocą z bazy

✅ **Zbierz zasoby:**
  - Eksploruj całą mapę
  - Szukaj rzadkich itemów w szpitalach
  - Pozbieraj gruz do budowy

✅ **Leczenie:**
  - Bandaż zatrzyma krwawienie
  - Antybiotyki leczą zarażenie (!!!WAŻNE!!!)
  - Jedzenie regeneruje HP powoli

✅ **Combat:**
  - Atakuj z dystansu jak możesz
  - Kroćć się po ścianach bazy
  - Nie pozwalaj zombie ci ich zaatakować

### 8️⃣ DEPLOYMENT (Production)

```bash
# 1. Utwórz repo GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# 2. Utwórz PostgreSQL (Neon):
# https://console.neon.tech
# Skopiuj DATABASE_URL

# 3. Deploy na Vercel:
# https://vercel.com/new
# Połącz GitHub repo
# Dodaj env vars:
#   - DATABASE_URL (z Neon)
#   - NEXTAUTH_SECRET
# Kliknij Deploy!

# 4. Run migrations:
npx prisma migrate deploy

# DONE! 🎉
# Gra live: yourdomain.vercel.app/game
```

### 9️⃣ TROUBLESHOOTING

**❌ Baza danych nie łączy:**
```bash
# Sprawdź PostgreSQL:
psql -U postgres

# Utwórz bazę:
CREATE DATABASE zombie_db;

# Resetuj migrations:
npx prisma migrate reset
```

**❌ Game nie ładuje:**
```bash
# Clear cache:
rm -rf .next node_modules
npm install
npm run build
npm run dev
```

**❌ Zombie nie się poruszają:**
- Sprawdź browser console (F12)
- Upewni się że Three.js załadował
- Restart aplikacji

### 🔟 NEXT STEPS

1. **Dodaj 3D modele** (Blender exports):
   - Zombie modele
   - Building tekstury
   - Weapon meshes

2. **Sound effects**:
   - Zombie groaning
   - Gunshots
   - Crafting sounds
   - Ambient music

3. **Weapons expansion**:
   - Shotgun
   - Crossbow
   - Grenades
   - Explosives

4. **Vehicles**:
   - Samochód
   - Motocykl
   - Helikopter (escape?)

5. **Multiplayer** (Socket.io):
   - 4+ players na jednej mapie
   - Co-op base building
   - PvP regions

---

## 📞 SUPPORT

❓ Problemy?
- Sprawdź konsoli (F12)
- Czytaj error messages
- Restart browser'a
- Wyczyszcz cache

💬 Feedback?
- GitHub Issues
- Discord
- Email

🚀 Ready to survive?
Powodzenia w przetrwaniu! 🧟‍♂️

═════════════════════════════════════════════
Made with Three.js + React + Love ❤️
