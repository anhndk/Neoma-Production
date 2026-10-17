/* =========================================================================
   KONFIGURASI UNDANGAN  —  cukup edit file ini saben undangan anyar.
   (index.html, style.css lan main.js ora perlu disenggol)

   Tips:  • Ganti isi neng njero tanda kutip "..." wae.
          • "\n" = pindah baris. Baris neng undangan WAJIB manut "\n" iki
            (supaya line break-e podo karo PDF acuan), dadi aja ngetik dowo
            tanpa "\n" nek teks-e pancen kudu mecah baris.
          • Aja ngapus koma (,) neng mburi baris.
   ========================================================================= */
window.INVITATION_CONFIG = {

  /* ---------------------------------------------------------------------
     1. IDENTITAS UNDANGAN
  --------------------------------------------------------------------- */
  slug: "nisa-rio",          // pengenal unik (huruf cilik + strip); beda saben undangan
  adminSecret: "101026",     // password kanggo mbusak ucapan (tombol × neng saben ucapan)

  /* ---------------------------------------------------------------------
     2. ACARA
  --------------------------------------------------------------------- */
  event: {
    // target countdown neng cover (format: TAHUN-BULAN-TANGGALTJAM:MENIT:DETIK+07:00)
    akad: "2026-10-10T09:00:00+07:00",
    // link tombol "BUKA MAP"
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Isvara+Riverside+Tlogoadi+Mlati+Sleman",
    // link tombol "LIVE STREAMING" (sementara neng IG @neomaprod; kosongke "" nek ora ono)
    liveUrl: "https://www.instagram.com/neomaprod"
  },

  /* ---------------------------------------------------------------------
     3. TEKS UNDANGAN  (kabeh tulisan sing katon neng undangan)
  --------------------------------------------------------------------- */
  teks: {

    /* --- Section 0 : kunci (halaman 1) --- */
    cover: {
      judul: "UNDANGAN",
      tanggal: "10.10.2026",
      yth: "Kepada Yth",
      tamuDefault: "Nama Tamu Undangan",   // dipakai nek link ora ono ?to=
      ketuk: "ketuk lentera untuk membuka undangan"
    },

    /* --- Section 0 : kunci (halaman 2, lentera urip) --- */
    pembuka: "Dengan menyebut nama Allah\nyang Maha Pengasih & Maha Penyayang,\nYa Allah perkenankanlah kami melaksanakan\npernikahan kami",
    nama: "NISA & RIO",
    labelCountdown: { hari: "HARI", jam: "JAM", menit: "MENIT", detik: "DETIK" },
    tanggal: "10.10.2026",
    lokasiSingkat: "Gedung Serbaguna Isvara",

    /* --- Section 1 : ayat --- */
    ayat: {
      judul: "AR\nRUM\n21",
      teks: "Dan di antara tanda-tanda (kebesaran)-Nya ialah\nDia menciptakan pasangan-pasangan untukmu dari\njenismu sendiri agar kamu merasa tenteram\nkepadanya, dan Dia menjadikan di antaramu\nrasa cinta dan kasih sayang. Sungguh pada yang\ndemikian itu benar-benar terdapat tanda-tanda\n(kebesaran Allah) bagi kaum yang berpikir."
    },

    /* --- Section 2 : mempelai wanita --- */
    wanita: {
      panggilan: "NISA",
      nama: "Annisa Putri Isnaini",
      ortu: "Putri dari Bapak Yudi Kurniawan\n& Ibu Indri Lestari",
      ig: "@_annisaptr1"
    },

    /* --- Section 3 : mempelai pria --- */
    pria: {
      panggilan: "RIO",
      nama: "Mohammad Rio Syafrudin",
      ortu: "Putra dari Bapak Danang Syafrudin\n& Ibu Yuliana Prihartati",
      ig: "@mohriosyfr_"
    },

    /* --- Section 4 : acara --- */
    acara: {
      tanggal: "10\nOKTOBER\n2026",
      akad:    { judul: "AKAD NIKAH", jam: "09.00 WIB", live: "LIVE STREAMING" },
      resepsi: { judul: "RESEPSI",    jam: "10.00 -\n12.00 WIB" },
      lokasi: "Bertempat di\nGedung Serbaguna Isvara",
      alamat: "Isvara Riverside, Tlogoadi, Mlati, Sleman",
      tombolMap: "BUKA MAP"
    },

    /* --- Section 5 : doa & ucapan --- */
    doa: {
      judul: "DOA &\nUCAPAN",
      placeholderNama: "Nama Kamu",
      placeholderPesan: "Tulis doa & ucapan untuk kedua mempelai",
      tombol: "KIRIM DOA",
      kosong: "Jadilah yang pertama mengirim doa"
    },

    /* --- Section 6 : tanda kasih --- */
    tandaKasih: {
      judul: "TANDA\nKASIH",
      catatan: "Apabila Bapak/Ibu/Saudara/i berhalangan\nhadir, namun tetap ingin memberikan\ntanda kasih, kami senantiasa menerima\ndengan penuh rasa syukur.",
      salin: "SALIN",
      tersalin: "TERSALIN"
    },

    /* --- Section 7 : penutup --- */
    penutup: {
      judul: "TERIMA\nKASIH",
      teks: "Kehadiran dan doa restu\ndari Bapak/Ibu/Saudara/i\nmerupakan suatu kehormatan\n& kebahagiaan bagi kami",
      kreditAtas: "undangan digital oleh",
      kredit: "neoma.my.id"
    }
  },

  /* ---------------------------------------------------------------------
     4. INSTAGRAM  (teks neng tombol diganti neng "teks.wanita.ig" / "teks.pria.ig")
        Sementara kabeh tombol diarahke neng @neomaprod.
  --------------------------------------------------------------------- */
  instagram: {
    wanita: "https://www.instagram.com/neomaprod",
    pria:   "https://www.instagram.com/neomaprod"
  },

  /* ---------------------------------------------------------------------
     5. TANDA KASIH  (maksimal 3 kartu)
        { bank, nomor, an }  -> SALIN nyalin nomer rekening
  --------------------------------------------------------------------- */
  rekening: [
    { bank: "BCA", nomor: "1234567890", an: "Annisa Putri Isnaini" },
    { bank: "BCA", nomor: "1234567890", an: "Mohammad Rio Syafrudin" }
  ],

  /* ---------------------------------------------------------------------
     6. SLIDESHOW BACKGROUND SECTION 1 (ayat)
        Kabeh foto kajaba lentera + foto section 2 & 3 (potret mempelai).
  --------------------------------------------------------------------- */
  slideshow: {
    folder: "assets/img/",
    gambar: ["section_1.webp", "section_4.webp", "section_5.webp", "section_6.webp", "section_7.webp"],
    jedaMs: 5200      // jeda ganti foto (milidetik)
  },

  /* ---------------------------------------------------------------------
     6b. SLIDESHOW BACKGROUND SECTION 7 (penutup)
         Foto pertama tetep section_7.webp, sakwise iku bebas urutane.
  --------------------------------------------------------------------- */
  slideshowPenutup: {
    folder: "assets/img/",
    gambar: ["section_7.webp", "section_6.webp", "section_5.webp", "section_4.webp", "section_1.webp"],
    jedaMs: 5200
  },

  /* ---------------------------------------------------------------------
     7. MUSIK  (nek file-e ora ono, tombol musik otomatis ora muncul)
  --------------------------------------------------------------------- */
  musik: "assets/audio/music.mp3",

  /* ---------------------------------------------------------------------
     8. FIREBASE  (kanggo kolom Doa & Ucapan; ora perlu diganti)
        Ucapan disimpen neng Firestore: invitations/{slug}/wishes (manut firestore.rules)
  --------------------------------------------------------------------- */
  firebase: {
    apiKey: "AIzaSyC89017s4DzcsGDROhp5oqH_leuO9W9WI",
    authDomain: "neoma-query.firebaseapp.com",
    projectId: "neoma-query",
    storageBucket: "neoma-query.firebasestorage.app",
    messagingSenderId: "34923299362",
    appId: "1:34923299362:web:980168a766bbdec873807b"
  }
};
