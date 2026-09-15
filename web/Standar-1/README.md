# README — Panduan Styling Undangan Arka & Ditha

File ini nerangke (1) apa sing sakdurunge salah karo ukuran font/elemen, apa
sing wis dibenerke, lan (2) peta lengkap per-section: baris pira nggo ngganti
warna, ukuran font, spasi, ukuran gambar/icon — kabeh sing sithik akeh
"visual", ora mung font.

Referensi baris ing ngisor iki cocok karo file `css/style.css` lan
`index.html` sing melu diuploadke bareng README iki (style.css wis dibenerke,
index.html ora diowahi babar pisan — mung dadi referensi konten).

---

## 1. Root cause: kenapa font-e bisa "kegedean" di PC lan "kekeciliken" di mobile-inspect

Diagnosa saka Gemini wis bener kabeh, iki ringkesane:

- Kabeh `--fs-*` (lan sawetara ukuran liyane kaya logo splash, item timeline,
  kembang penutup) nganggo unit `vw` — `vw` iku persen saka **lebar browser
  window**, dudu lebar `#stage` (panggung sing dikunci rasio 9:16 kaya HP).
- `#stage` dikunci `max-width: calc(var(--stage-h) * 0.5625)` supaya ing
  desktop katon kaya pigura HP. Nanging `vw` tetep ngetung 100% saka lebar
  BROWSER (misal 1920px), dudu lebar `#stage` sing mung ~500–600px. Dadi
  angka "preferred value" clamp() dadi ora nyambung karo lebar panggung sing
  bener-bener katon → proporsi rusak (kadang katon gedhe amarga preferred
  value langsung nabrak nilai maksimal clamp, kadang katon ora proporsional
  karo lebar panel/kolom sing sakjane luwih ciyut).
- Ing mode inspect mobile sing paling ciyut (320–360px), nilai `vw` cilik
  banget nganti clamp() kejiret ing angka minimum (`rem`) sing pancen wis
  ditata rada cilik — dadi katon "kekeciliken" tinimbang seimbang.

### Solusi sing dipasang

1. **`#stage` didadekke "size query container"** — `css/style.css` baris
   **100** (`container-type: inline-size;`, ing njero rule `#stage` baris
   83–108).
2. **Kabeh unit `vw` ing skala font lan ukuran elemen diganti dadi `cqi`**
   (container query inline size) — `cqi` iku persen saka lebar `#stage`
   dhewe, dudu lebar browser. Efek: ing desktop, font/elemen saiki ngetung
   proporsi marang kolom ~500–600px sing pancen katon (mirip lebar HP
   gedhe), dudu marang lebar layar 1920px. Ing HP asli, `#stage` = lebar
   viewport, dadi tampilane PERSIS padha kaya sakdurunge (ora ana owahan
   sing kudu mbok cek maneh ing HP).
3. **Batas rem minimum ing skala font dinaikke sethithik** (~0.02–0.06rem
   saben tingkat) supaya ora kejiret kekeciliken ing lebar inspect sing
   ekstrem ciyut (320–360px), tanpa ngganti tampilan ing lebar normal.

Ganti unit iki kelakon ing baris **34–41** (skala `--fs-*`), **153**
(`.splash-logo`), **229** (`.the-date`), **522** (`.s3-item`), lan **742**
(`.s6-flower`) ing `css/style.css`.

> Browser support: `cqi`/container query wis Baseline (didhukung Chrome,
> Firefox, Safari, Edge kabeh versi modern wiwit 2022–2023), dadi aman
> dianggo kanggo tamu sing mbukak saka link chat ing 2026.

> Catetan cilik: variabel `--stage-w: 100vw;` ing baris **44** ora
> dianggo ing endi-endi (dead code) — aman dibiarke utawa dibusak, ora
> pengaruh apa-apa marang bug iki.

---

## 2. Variabel global (baris 14–51, `css/style.css`)

Iki "panel kontrol" utama — ngganti ing kene otomatis nyebar menyang kabeh
section sing nganggo variabel sing padha.

| Baris | Variabel | Fungsi |
|---|---|---|
| 15 | `--ink: #f5f3ee` | Warna teks/elemen "terang" (dianggo ing meh kabeh section, background peteng) |
| 16 | `--void: #0a0a0a` | Warna background utama (peteng) + warna teks ing section terang (section5) |
| 17 | `--void-soft: #111111` | Varian peteng sithik luwih murup (cadangan, saiki durung dianggo langsung) |
| 18 | `--line: rgba(245,243,238,0.35)` | Warna garis tipis (hairline, timeline, border badge IG) |
| 19 | `--line-dark: rgba(10,10,10,0.25)` | Varian garis kanggo background terang (cadangan) |
| 21 | `--font-script: 'High Empathy', cursive` | Font kursif kanggo judul/nama gedhe (Arka, Ditha, "Kisah Kami", dst) |
| 22 | `--font-sans: 'Montserrat', sans-serif` | Font utama kanggo teks body |
| 34 | `--fs-xs` | Ukuran font paling cilik (alamat, IG badge, tombol salin, dll) |
| 35 | `--fs-sm` | Ukuran font cilik-sedheng (venue, form, gift card) |
| 36 | `--fs-base` | Ukuran font body normal (ayat Alkitab section 1) |
| 37 | `--fs-md` | Ukuran font sedheng (nama lengkap, guest name, tanda tangan) |
| 38 | `--fs-lg` | Ukuran font gedhe ("Undangan" ing cover) |
| 39 | `--fs-xl` | Ukuran font ekstra gedhe (durung dianggo langsung ing HTML saiki, cadangan) |
| 40 | `--fs-script` | Ukuran judul kursif utama (nama cilik Arka/Ditha, judul tiap section) |
| 41 | `--fs-script-lg` | Ukuran judul kursif paling gedhe ("Terima Kasih" ing section 6) |
| 8 | `src` font file | Ganti file font kursif (`High-Empathy.otf`) yen arep ganti font |
| 44 | `--stage-w` | **Ora dianggo** — aman diabaikan |
| 50 | `--stage-h: 100svh` | Dhasar ngitung lebar maksimal `#stage` (jaga rasio 9:16) |

**Cara ganti warna kabeh app sekaligus:** ganti hex/rgba ing baris 15–19.
**Cara ganti skala font kabeh app sekaligus:** ganti angka ing baris 34–41
(format: `clamp(minimum, preferensi-cqi, maksimum)`).

---

## 3. `#stage` — panggung utama (baris 83–119)

| Baris | Apa iku |
|---|---|
| 86 | `max-width: calc(var(--stage-h) * 0.5625)` — ngunci lebar panggung supaya rasio ~9:16 (kaya layar HP). Ganti `0.5625` (= 9/16) yen pengin rasio liya. |
| 100 | `container-type: inline-size` — kunci sing ndadekke unit `cqi` mlaku (aja dibusak!). |
| 110–119 | Aturan khusus pas layar "wide"/desktop (letterbox + bayangan `box-shadow`). Ganti `rgba(0,0,0,0.6)` ing baris 117 kanggo ngganti intensitas bayangan pinggir. |

---

## 4. Splash screen (baris 137–159)

| Baris | Apa iku |
|---|---|
| 144 | Background splash (`var(--void)`) |
| 153 | Ukuran logo (`26cqi`, max `110px`) — gedhekke/cilikke angka `26` utawa `110` |
| 149, 156 | Durasi fade (`transition`) |

---

## 5. Cover / halaman pertama (baris 161–256) — teks ing `index.html` baris 27–50

| Baris CSS | Elemen | Ukuran/warna |
|---|---|---|
| 202 | `.cover-scrim` gradient gelap ing ndhuwur foto | ganti angka `rgba(0,0,0,x)` per titik gradient |
| 222–227 | `.kicker` ("Undangan") | font `var(--fs-lg)`, letter-spacing baris 225 |
| 228–232 | `.the-date` ("10.10.2026") | ukuran custom `clamp(1.95rem, 8cqi, 2.6rem)` — ganti langsung ing kene, ora lewat variabel |
| 242 | `.to-label` ("Kepada Yth.") | `var(--fs-md)` |
| 243 | `.guest-name` (jeneng tamu) | `var(--fs-md)`, bold |
| 244 | `.at-place` ("di tempat") | `var(--fs-md)` |
| 246–256 | `.open-btn` (tombol "Buka Undangan") | font `var(--fs-sm)`, warna border/isi baris 247–250, padding baris 251 (ngatur ukuran tombol) |
| 212 | Padding kabeh konten cover (`8.5% 8% 6%`) | ngatur jarak konten menyang pinggir layar |

Teks "Undangan", tanggal, "Kepada Yth.", lsp ana ing `index.html` baris
**38–48**.

---

## 6. Section 1 — Ayat & Identitas Mempelai (baris 306–414)

Teks jeneng/alamat ana ing `index.html` baris **58–131** (panel Arka baris
66–97, panel Ditha baris 100–131).

| Baris CSS | Elemen | Ukuran/warna |
|---|---|---|
| 333–338 | `.s1-verse blockquote` (ayat Alkitab) | `var(--fs-base)`, `line-height: 1.55` (jarak antar baris) |
| 339–344 | `.s1-verse cite` (sumber ayat, "Matius 19:6") | `var(--fs-base)`, bold |
| 351–352 | `.s1-panel` lebar panel jeneng (`width: 55%`) + warna latar (`var(--void)`) | gedhekke `55%` yen pengin panel luwih lebar |
| 360 | Padding njero panel (`12% 9%`) — iki sing ngatur "space" antar elemen ing panel jeneng | gedhekke persen kanggo jarak luwih lapang |
| 364 | `gap: 1.1em` — jarak vertikal antar baris (nama cilik → nama lengkap → garis → wong tuwa → alamat → IG) | ganti angka `1.1em` iki yen jarak antar elemen krasa mepet/kejarang |
| 366–372 | `.s1-first-name` (jeneng cilik "Arka"/"Ditha") | `var(--fs-script)` — paling gedhe ing section iki |
| 373–379 | `.s1-full-name` (jeneng lengkap) | `var(--fs-md)` |
| 380–383 | `.s1-rule` (garis pemisah cilik) | warna `var(--line)`, lebar `46px` |
| 384–390 | `.s1-parents` (jeneng wong tuwa) | `var(--fs-xs)` |
| 392–398 | `.s1-address` (alamat) | `var(--fs-xs)` |
| 399–410 | `.s1-ig` (badge Instagram) | `var(--fs-xs)`, border `var(--line)`, padding baris 405 ngatur ukuran badge |

---

## 7. Section 2 — Acara / Pemberkatan & Resepsi (baris 416–463)

Teks tanggal/jam/lokasi ana ing `index.html` baris **145–167**.

| Baris CSS | Elemen | Ukuran/warna |
|---|---|---|
| 428 | `.s2-bg` posisi foto latar (`object-position: center 30%`) | ganti persen kanggo geser fokus foto |
| 432 | `.s2-scrim` gradient gelap ing ndhuwur foto | ganti angka `rgba(0,0,0,x)` |
| 438, 441 | Padding & jarak antar blok "Pemberkatan"/"Resepsi" (`gap: 7%`) | gedhekke `7%` kanggo jarak luwih lapang antar blok |
| 444–449 | `.s2-title` ("Pemberkatan"/"Resepsi") | `var(--fs-script)` |
| 450 | `.s2-when` (tanggal) | `var(--fs-sm)`, bold |
| 451 | `.s2-time` (jam) | `var(--fs-sm)`, bold |
| 452 | `.s2-venue` (alamat lokasi) | `var(--fs-sm)`, light |
| 453–463 | `.s2-map-btn` (tombol "Buka Map") | font `var(--fs-xs)`, warna latar `var(--ink)`, warna teks `var(--void)`, padding baris 462 |

---

## 8. Section 3 — Kisah Kami / timeline (baris 476–539)

Teks tahun/deskripsi ana ing `index.html` baris **180–246** (saben item
`.s3-item`, ganti tahun/teks langsung ing kono).

| Baris CSS | Elemen | Ukuran/warna |
|---|---|---|
| 490 | Padding konten section (`9% 8%`) | |
| 494–502 | `.s3-title` ("Kisah Kami") | `var(--fs-script)`, margin-bawah baris 500 ngatur jarak menyang timeline |
| 507 | Lebar garis timeline (`width: 2px`) | |
| 515 | Warna garis timeline (`var(--line)`) | |
| 519–523 | `.s3-item` lebar kotak item (`width: 42cqi`, max `220px`) | gedhekke `42` yen kotak isih kesempitan |
| 529–531 | `.s3-dot` (bunderan cilik ing garis) | ukuran `6px`, warna `var(--ink)` |
| 538 | `.s3-year` (judul tahun, mis. "Pertama Jumpa 2019") | `var(--fs-sm)`, bold |
| 539 | `.s3-desc` (deskripsi) | `var(--fs-xs)`, `margin-top: 0.3em` (jarak menyang judul tahun ing ndhuwure) |

---

## 9. Section 4 — Momen Kami / carousel foto (baris 541–607)

Gambar-gambar ana ing `index.html` baris **262–280** (ganti `src`/`alt`
kanggo ganti foto).

| Baris CSS | Elemen | Ukuran/warna |
|---|---|---|
| 558 | Padding konten (`11% 8% 8%`) | |
| 560–568 | `.s4-title` ("Momen Kami") | `var(--fs-script)` |
| 581 | `.s4-track` (bingkai carousel) — `border-radius: 18px` | gedhekke/cilikke kanggo pojok luwih tumpul/lancip |
| 596–601 | `.s4-dots` (titik-titik indikator slide) — jarak `margin-top: 4%` | |
| 603 | Ukuran titik dots (`6px`) | |
| 587 | Warna titik dot aktif (`var(--ink)`) vs non-aktif (`var(--line)`, baris 604) | |

---

## 10. Section 5 — Do'a & Ucapan + Tanda Kasih (baris 609–717)

Teks form/nomor rekening ana ing `index.html` baris **304–386**.

| Baris CSS | Elemen | Ukuran/warna |
|---|---|---|
| 625–629 | `.s5-overlay` gradient putih ing ndhuwur foto latar | ganti angka `rgba(255,255,255,x)` kanggo transparansi |
| 635, 641 | Padding konten (`9% 8%`) | |
| 644–649 | `.s5-title` ("Do'a & Ucapan" / "Tanda Kasih") | `var(--fs-script)` |
| 652–663 | `.s5-field` (input nama + textarea pesen) | font `var(--fs-sm)`, border baris 654 (`rgba(10,10,10,0.35)` — **hardcode, ora lewat variabel**), background baris 656 |
| 664 | Tinggi textarea (`height: 6.5em`) | gedhekke yen pengin kolom pesen luwih dhuwur |
| 666–677 | `.s5-submit` (tombol "Kirim Ucapan") | font `var(--fs-xs)`, warna latar `var(--void)`, teks `var(--ink)` |
| 678–684 | `.s5-toast` (pesen konfirmasi sakwise kirim) | `var(--fs-xs)` |
| 687–693 | `.s5-note` (kalimat pengantar "Tanda Kasih") | `var(--fs-sm)`, `line-height: 1.6` |
| 694–704 | `.s5-gift-card` (kotak rekening/alamat) | border baris 695 (`rgba(10,10,10,0.3)` hardcode), `border-radius: 14px` baris 696, jarak antar kartu `margin-bottom: 3.5%` baris 702 |
| 705 | Nomor rekening/nama pemilik (`<b>`) | `var(--fs-sm)` |
| 706 | Keterangan (`<span>`) | `var(--fs-xs)` |
| 707–717 | `.s5-copy-btn` (tombol "Salin") | `var(--fs-xs)`, warna latar `var(--void)`, teks `var(--ink)`, warna pas wis disalin `#3a3a3a` (baris 717) |

---

## 11. Section 6 — Penutup (baris 719–774)

Teks ucapan penutup ana ing `index.html` baris **398–434**.

| Baris CSS | Elemen | Ukuran/warna |
|---|---|---|
| 737, 739 | Padding & jarak antar elemen (`padding: 0 12%`, `gap: 1.4em`) — iki sing ngatur spasi antara kembang → judul → teks → tanda tangan | gedhekke `gap` yen kroso mepet |
| 741–744 | `.s6-flower` (icon kembang SVG) | ukuran `22cqi`, max `100px` |
| 746–751 | `.s6-title` ("Terima Kasih") | `var(--fs-script-lg)` — paling gedhe sak-app |
| 752–758 | `.s6-text` (kalimat ucapan) | `var(--fs-sm)`, `line-height: 1.7` |
| 759–765 | `.s6-signature` ("Arka & Ditha") | `var(--fs-md)` |
| 767–774 | `footer.s6-credit` (baris kredit paling ngisor) | ukuran tetep `0.62rem` (statis, ora fluid — sengaja cilik lan konstan), warna `rgba(245,243,238,0.35)` |

---

## 12. Ringkesan: kepenginan-kepenginan umum

- **"Font kabeh kegedhen/kekeciliken sethithik nyeluruh"** → ganti angka
  ing skala `--fs-*` baris **34–41** (kabeh section melu owah proporsional).
- **"Warna dhasar arep diganti"** → baris **15–19**.
- **"Jarak antar elemen ing panel jeneng section 1 kurang lapang"** →
  baris **364** (`gap`) lan **360** (`padding`).
- **"Jarak antar kartu rekening ing section 5 kesempitan"** → baris **702**
  (`margin-bottom`).
- **"Kembang penutup pengin luwih gedhe"** → baris **742** (angka `22cqi`
  lan/utawa batas `max-width: 100px`).
- **Sakwise ngganti CSS, sok mesthi tes ing (a) desktop nganggo browser
  normal — tanpa buka DevTools, (b) DevTools mode HP paling ciyut (~320px),
  lan (c) HP asli** — telu-telune saiki kudu katon proporsional amarga wis
  ngacu marang lebar `#stage`, dudu lebar layar mentah.
