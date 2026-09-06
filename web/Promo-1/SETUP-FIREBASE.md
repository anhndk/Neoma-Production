# Setup Firebase — Ucapan Bisa Diwaca Kabeh Tamu

Panduan iki mung perlu ditindakake **SEPISAN** wae kanggo kabeh produk undangan
sing bakal didol. Sabanjure, saben ana pembeli anyar, cukup tindakna bagian
"Kanggo Undangan Anyar (Saben Laku)" ing ngisor — ora perlu bola-bali bikin
project Firebase.

---

## A. Setup Sepisan (kanggo panjenengan, seller)

### 1. Bikin akun Google
Cukup akun Gmail biasa. Yen wis duwe, langsung skip.

### 2. Bikin Project Firebase
1. Bukak **firebase.google.com/console**
2. Klik **Add project**, wenehi jeneng bebas (mis. `neoma-undangan`)
3. Paket gratis **Spark** wis cukup — situs undangan pernikahan adoh
   banget seko limit gratis-e Firebase.

### 3. Aktifake Firestore Database
1. Ing menu kiri, pilih **Firestore Database** → **Create database**
2. Pilih lokasi server sing paling cedhak (mis. `asia-southeast1`)
3. Pilih mode **production**

### 4. Pasang Security Rules
1. Ing Firestore, bukak tab **Rules**
2. Copy kabeh isi file `firestore.rules` (siji folder karo file iki)
3. Tempel, ganti rules default, klik **Publish**

### 5. Daftarake Web App & Jupuk Config
1. Bukak **Project Settings** (icon gear) → gulung nganti **Your apps**
2. Klik icon **`</>`** (Web)
3. Wenehi jeneng bebas, **ora usah** centhang Firebase Hosting
4. Firebase bakal ngekei kode kaya iki:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "neoma-undangan.firebaseapp.com",
  projectId: "neoma-undangan",
  storageBucket: "neoma-undangan.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

5. Copy angka/tulisan kasebut siji-siji menyang `assets/js/firebase-config.js`,
   bagian `firebase: { ... }`.

Rampung. Bagian iki ora bakal diulang maneh kanggo pembeli sabanjure.

---

## B. Kanggo Undangan Anyar (Saben Laku)

Saben ana pembeli anyar, panjenengan mung kudu:

1. **Duplikat folder situs** iki kanggo pembeli anyar
2. Bukak `assets/js/firebase-config.js`, ganti **rong baris iki wae**:
   - `slug:` — ganti karo pengenal unik (mis. `"budi-sinta"`), KUDU BEDA
     karo undangan liyane supaya ucapane ora kecampur
   - `adminSecret:` — ganti karo kode rahasia anyar, kirim kode iki
     menyang pembeli (tuan rumah) lewat chat pribadi
3. Bagean `firebase: { ... }` **ora usah diganti** — tetep nganggo
   project Firebase sing padha kanggo kabeh pembeli.
4. Upload/hosting kaya biasane.

Pembeli (tuan rumah undangan) ora perlu bikin akun apa-apa. Cukup dikandhani
kode rahasiane, terus dheweke iso mbusak ucapan spam lewat tombol 🗑
ing situse dhewe.

---

## Cathetan Keamanan (jujur, ben ora kaget)

Kode rahasia (`adminSecret`) kesimpen ing file JavaScript situs, dadi
sacarane bisa diweruhi wong sing pancen ngerti teknis banget (liwat
"View Page Source"). Kanggo buku tamu pernikahan — data ora sensitif,
paling apes mung ana ucapan sing ilang — iki resiko sing bisa ditolerir.

Yen mbesuk pengin proteksi level luwih dhuwur (mis. situs kanggo transaksi
utawa data pribadi), kudu nambah **Firebase Authentication** utawa
**Cloud Functions** kanggo mriksa kode ing sisih server, dudu sisih klien.
Iki bisa ditambahke mbesuk yen dibutuhake — ora kudu saiki.
