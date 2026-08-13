# Cara Pakai — Undangan Dewi & Bagas

## Struktur folder
```
index.html
assets/
  css/style.css        <- semua styling & warna
  js/script.js          <- logic scroll-zoom, musik, countdown, carousel, ucapan
  js/firebase-config.js <- slug undangan & kode rahasia hapus ucapan
  images/                <- semua gambar (sudah dikompres ke .webp)
  audio/                 <- taruh music.mp3 di sini
firestore.rules          <- rules Firestore (referensi, sudah aktif di project)
```

## 1. Cara kerja scroll-zoom
Situs ini dibuat pakai teknik "sticky canvas": satu panel dikunci di layar
(`position: sticky`) sementara halaman "discroll" di baliknya. Scroll itu
dipakai buat menghitung progress animasi zoom & fade antar scene, jadi
kesannya scroll = zoom, bukan geser turun.

Kalau mau mengatur **seberapa jauh** harus discroll untuk tiap bagian
(kecepatan transisi), buka `assets/js/script.js`, cari blok `PHASES` di
paling bawah — semua angkanya dalam satuan vh (tinggi layar), tinggal
diubah sesuai selera. Contoh: `s1to2: 100` artinya butuh scroll sejauh
100vh buat menyelesaikan transisi zoom dari scene 1 ke scene 2.

## 2. Nama tamu otomatis dari link
Cover mengambil nama tamu dari parameter URL `to`, contoh:
```
https://domainkamu.com/index.html?to=Bapak%20Budi%20Santoso
```
Kalau parameter `to` tidak diisi, otomatis tampil "Bapak/Ibu/Saudara/i".

## 3. Musik
Taruh file musik di `assets/audio/music.mp3`. Musik mulai muter otomatis
pas tombol "Buka Undangan" dipencet (butuh interaksi user dulu karena
kebijakan autoplay browser). Tombol pause/play kecil ada nempel di gambar
radio pada scene 1 — kalau mau geser posisinya, cari class
`.scene1__music-btn` di `assets/css/style.css` (posisinya pakai `left` &
`top` dalam persen).

## 4. Ganti tanggal, jam, lokasi acara
Semua ada di `index.html`, di dalam `<div class="batik-panel" id="panel3">`
— tidak perlu buka file JS:
- Tanggal & jam akad/resepsi: edit langsung teks di `<p class="event-date">`
  dan `<p class="event-time">`.
- Countdown: cari `<div class="countdown" id="countdown" data-target="...">`
  lalu ganti nilai `data-target`. Formatnya:
  `YYYY-MM-DDTHH:MM:SS+07:00` (contoh: `2026-10-10T07:00:00+07:00`).
- Nama lokasi: edit teks di `<p class="venue-name">`.
- Link Google Maps: cari `<a id="mapsLink" ... data-maps-url="...">` dan
  ganti isi `data-maps-url`. Cara paling akurat: buka lokasi di Google
  Maps → tombol "Bagikan" → "Salin link" → tempel di situ.

## 5. Ganti nama mempelai (scene 2)
Cari `<div class="scene2__names">` di `index.html`, edit teks di dalam
dua `<h2 class="scene2__name ...">`. Inisial di cover (huruf "B" & "D")
ada di `<div class="cover__initials">`.

## 6. Ganti foto carousel (scene 4)
Ganti file `assets/images/carousel-1.webp` s/d `carousel-5.webp` dengan
foto kalian sendiri (pertahankan nama file & rasio ±3:4 biar rapi). Kalau
jumlah fotonya beda dari 5, ubah juga angka `var total = 5;` di
`assets/js/script.js` bagian "8. CAROUSEL".

## 7. Ucapan / wishes (Firestore)
Ucapan yang dikirim tamu tersimpan di Firebase Firestore, jadi tampil
untuk *semua* tamu yang membuka undangan — bukan cuma di HP pengirim.
Konfigurasinya sudah aktif di `assets/js/firebase-config.js` (satu
project Firebase yang sama dipakai bareng untuk beberapa undangan,
dibedakan lewat `slug`).

- **Kode hapus ucapan**: ada di `adminSecret` pada
  `assets/js/firebase-config.js`. Ganti dengan kode bebas sebelum
  undangan disebar, lalu simpan sendiri (jangan disebar ke tamu).
- Kalau `firebase-config.js` belum diisi / Firestore lagi bermasalah,
  situs otomatis jatuh ke mode cadangan (`localStorage`) supaya tetap
  jalan normal.

## 8. Tutup undangan
Tombol bulat "×" di scene terakhir akan mematikan musik lalu me-refresh
halaman, balik ke cover dari awal.

## 9. Ubah warna / font
Semua warna ada di `:root { ... }` paling atas `assets/css/style.css`
(variabel `--maroon`, `--gold`, `--cream`, dst). Font judul pakai
**Cinzel**, font body pakai **Poppins** — kalau mau ganti, tinggal ubah
link Google Fonts di `<head>` `index.html` dan variabel `--font-display`
/ `--font-body` di CSS.

## 10. Hosting
File ini murni HTML/CSS/JS statis, bisa langsung di-hosting gratis di:
- Netlify / Vercel (drag & drop folder ini)
- GitHub Pages
- Firebase Hosting

## 11. Kalau efek zoom terasa terlalu cepat/lambat di HP kamu
Itu wajar — kecepatan scroll fisik beda-beda tiap device/trackpad. Untuk
menyeimbangkan, perbesar semua angka di `PHASES` (lihat poin 1) secara
proporsional, misal dikali 1.3, supaya transisi butuh scroll lebih jauh
(terasa lebih smooth/lambat).
