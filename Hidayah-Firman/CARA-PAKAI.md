# Cara Pakai Undangan Hidayah & Firman

## Struktur folder
```
index.html
assets/
  css/style.css      <- semua styling & warna
  js/script.js        <- logic reveal, musik, countdown, carousel, ucapan
  images/              <- foto & elemen floral
  audio/               <- taruh music.mp3 di sini
```

## 1. Nama tamu otomatis dari link
Cover mengambil nama tamu dari parameter URL `to`. Contoh link yang dibagikan
ke masing-masing tamu:

```
https://domainkamu.com/index.html?to=Bapak%20Budi%20Santoso
https://domainkamu.com/index.html?to=Keluarga+Besar+Wijaya
```

Spasi bisa pakai `%20` atau `+`. Kalau parameter `to` tidak diisi, otomatis
tampil "Tamu Undangan.".

## 2. Musik
Autoplay browser modern butuh interaksi user dulu — makanya musik baru mulai
diputar pas tombol **"Buka Undangan"** diklik. Tinggal taruh file mp3 kamu di
`assets/audio/music.mp3`. Ada tombol speaker kecil di pojok kanan atas untuk
mute/unmute kapan saja.

## 3. Ganti foto galeri
Ganti file `assets/images/gallery-1.jpg` s/d `gallery-4.jpg` dengan foto
kalian sendiri (nama file & rasio ±4:5 sebaiknya dipertahankan biar layoutnya
rapi). Foto profil di section Mempelai ada di `gallery-5.jpg` (Hidayah) dan
`gallery-6.jpg` (Firman).

## 4. Ucapan / wishes
Ucapan yang dikirim tamu disimpan di `localStorage` browser masing-masing
perangkat — jadi tampil langsung ke pengirimnya, tapi **belum otomatis
kebagikan ke semua tamu lain** karena situs ini murni statis (tanpa server).
Kalau nanti mau ucapan dari semua tamu muncul untuk semua orang, itu perlu
backend/database sederhana (misalnya Firebase, Supabase, atau Google Sheets
API) — tinggal bilang kalau mau dibantu sambungkan.

## 5. Hosting
File ini murni HTML/CSS/JS statis, jadi bisa langsung di-hosting gratis di:
- Netlify / Vercel (drag & drop folder ini)
- GitHub Pages
- Firebase Hosting

## 6. Ubah warna / font
Semua warna ada di bagian `:root { ... }` paling atas `assets/css/style.css`
(variabel `--navy`, `--gold`, `--cream`, dst) — diambil dari palet biru &
emas undangan referensi kamu.
