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
  slug: "utari-bagus",        // pengenal unik (huruf cilik + strip); beda saben undangan
  adminSecret: "101026",      // kode rahasia kanggo mbusak ucapan

  /* ---------------------------------------------------------------------
     2. ACARA
  --------------------------------------------------------------------- */
  event: {
    resepsi: "2026-10-10T10:00:00+07:00",   // target countdown (format: TAHUN-BULAN-TANGGALTJAM:MENIT:DETIK+07:00)
    mapsUrl: "https://maps.app.goo.gl/YvtMCmvHx25R56Br9"   // link tombol "buka map"
  },

  /* ---------------------------------------------------------------------
     3. TEKS UNDANGAN  (kabeh tulisan sing katon neng undangan)
  --------------------------------------------------------------------- */
  teks: {
    cover: {
      nama1: "Tari",                  // nama panggilan neng gunungan (baris 1)
      nama2: "Wicak",                 // nama panggilan neng gunungan (baris 2)
      tanggal: "10.10.2026"
    },

    ayat: {
      teks: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri agar kamu merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa cinta dan kasih sayang. Sungguh pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.",
      sumber: "QS. Ar-Rum : 21"
    },

    mempelai: {
      pembuka: "Dengan menyebut nama Allah yang maha\npengasih lagi maha penyayang.\nYa Allah ijinkanlah kami melaksanakan\npernikahan kami:",
      dengan: "dengan",
      wanita: {
        nama: "Utari\nCahyaningrum",
        ortu: "Putri dari Bapak Giyanto & Ibu Siti Ambarwati",
        alamat: "Mulungan Wetan RT 03 RW 16, Sendangadi,\nMlati, Sleman, Yogyakarta"
      },
      pria: {
        nama: "Bagus Pangestu\nWicaksana",
        ortu: "Putra dari Bapak Eko Susilo & Ibu Tri Watini",
        alamat: "Karang Kembang RT01, RW.05, Pucang Gading,\nNgluwar, Magelang"
      }
    },

    acara: {
      akad:    { tanggal: "Sabtu 10 Oktober 2026", jam: "Pukul 08.00 WIB" },
      resepsi: { tanggal: "Sabtu 10 Oktober 2026", jam: "Pukul 10.00 - 12.00 WIB" },
      lokasi: "Resto Taman Pringsewu"
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
    { bank: "BCA", nomor: "1234567890", an: "Utari Cahyaningrum" },
    { bank: "BCA", nomor: "1234567890", an: "Bagus Pangestu Wicaksana" },
    { judul: "Utari Cahyaningrum", alamat: "Mulungan Wetan RT 03 RW 16, Sendangadi, Mlati, Sleman, Yogyakarta" }
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
