/* =========================================================================
   KONFIGURASI UNDANGAN  —  cukup edit file ini saben undangan anyar.
   (index.html, style.css lan main.js ora perlu disenggol)

   Tips:  • Ganti isi neng njero tanda kutip "..." wae.
          • "\n" = pindah baris.
          • Aja ngapus koma (,) neng mburi baris.
   ========================================================================= */
window.INVITATION_CONFIG = {

  /* ---------------------------------------------------------------------
     1. IDENTITAS UNDANGAN
  --------------------------------------------------------------------- */
  slug: "ryan-tari",        // pengenal unik (huruf cilik + strip); beda saben undangan
  adminSecret: "151126",      // kode rahasia kanggo mbusak ucapan

  /* ---------------------------------------------------------------------
     2. ACARA
  --------------------------------------------------------------------- */
  event: {
    resepsi: "2026-11-15T13:00:00+07:00",   // target countdown (format: TAHUN-BULAN-TANGGALTJAM:MENIT:DETIK+07:00)
    mapsUrl: "https://maps.app.goo.gl/br9PtwzWhXJUjNuj8"   // link tombol "buka map"
  },

  /* ---------------------------------------------------------------------
     3. TEKS UNDANGAN  (kabeh tulisan sing katon neng undangan)
  --------------------------------------------------------------------- */
  teks: {
    cover: {
      nama1: "Ryan",                  // nama panggilan neng gunungan (baris 1)
      nama2: "Tari",                 // nama panggilan neng gunungan (baris 2)
      tanggal: "15.11.2026"
    },

    ayat: {
      teks: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri agar kamu merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa cinta dan kasih sayang. Sungguh pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.",
      sumber: "QS. Ar-Rum : 21"
    },

    mempelai: {
      pembuka: "Dengan menyebut nama Allah yang maha\npengasih lagi maha penyayang.\nYa Allah ijinkanlah kami melaksanakan\npernikahan kami:",
      dengan: "dengan",
      wanita: {
        nama: "Ryan\nDwi Saputra",
        ortu: "Putra dari Bapak Boiran & Ibu Ngadinem",
        alamat: ""
      },
      pria: {
        nama: "Sri\nLestari",
        ortu: "Putri dari Bapak Parno & Ibu Badriyah",
        alamat: ""
      }
    },

    acara: {
      akad:    { tanggal: "Minggu 15 November 2026", jam: "Pukul 10.00 WIB" },
      resepsi: { tanggal: "Minggu 15 November 2026", jam: "Pukul 13.00 WIB" },
      lokasi: "Rumah Makan Genduk Wulan"
    },

    tandaKasih: {
      catatan: "Apabila Bapak/Ibu/Saudara/i berhalangan hadir namun tetap ingin memberikan tanda kasih, kami senantiasa menerima dengan penuh rasa syukur"
    },

    penutup: "Merupakan suatu kehormatan dan kebahagiaan\nbagi kami apabila Bapak/Ibu/Saudara/i\nberkenan hadir dan memberikan doa restu\nkepada kami.",
    kredit: "neoma.my.id"
  },

  /* ---------------------------------------------------------------------
     4. TANDA KASIH  (maksimal 3 kartu)
        Rekening : { bank, nomor, an }            -> SALIN nyalin nomer rekening
        Alamat   : { judul, alamat }              -> SALIN nyalin judul + alamat
  --------------------------------------------------------------------- */
  rekening: [
    { bank: "BNI", nomor: "1439545440", an: "Ryan Dwi Saputra" },
    { bank: "BSI", nomor: "7362862455", an: "Sri Lestari" },
  ],

  /* ---------------------------------------------------------------------
     5. GALERI FOTO
        Foto dijupuk otomatis: assets/img/img1.webp, img2.webp, ... imgN.webp
        Tinggal ganti file-e, lan atur "jumlah" nek foto-ne luwih akeh / sithik.
  --------------------------------------------------------------------- */
  galeri: {
    jumlah: 4,
    folder: "assets/img/",
    awalan: "img",
    ekstensi: "webp"
  },

  /* ---------------------------------------------------------------------
     6. MUSIK
  --------------------------------------------------------------------- */
  musik: "assets/audio/music.mp3",

  /* ---------------------------------------------------------------------
     7. ANIMASI  (1 = standar; luwih gedhe = luwih cepet)
  --------------------------------------------------------------------- */
  cornerSpeed: 1.5,     // gambar corner neng cover
  gunungSpeed: 2,       // morphing gunungan neng section 1
  slideshowMs: 4800,    // jeda slideshow galeri (milidetik)

  /* ---------------------------------------------------------------------
     8. FIREBASE  (kanggo kolom Doa & Ucapan; ora perlu diganti)
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
