/* =========================================================================
   ⚙️ KONFIGURASI UNDANGAN — Arka & Ditha
   =========================================================================
   File iki nyambung menyang project Firebase sing padha karo undangan
   liyane (siji project Firebase dienggo bareng kanggo kabeh undangan),
   mung "slug" lan "adminSecret" sing beda supaya ucapan ora kecampur.
   ========================================================================= */

var INVITATION_CONFIG = {

  // Pengenal unik undangan iki. Kudu BEDA karo slug undangan liyane
  // sing nganggo project Firebase sing padha (yen padha, ucapan bakal
  // kecampur dadi siji).
  slug: "arka-ditha-2026",

  // Kode rahasia kanggo mbusak ucapan spam (dienggo pas mencet tombol ✕
  // ing daftar ucapan). Ganti karo kode bebas sadurunge undangan disebar,
  // banjur wenehke mung menyang sing duwe hajat.
  //
  // ⚠️ CATETAN: kode iki kesimpen ing kode situs (JavaScript) dadi wong
  // sing ngerti teknis lan buka "View Source" sacarane iso weruh. Kanggo
  // buku tamu pernikahan (resiko paling apes mung wong usil mbusak
  // ucapan) iki wis cukup.
  adminSecret: "101026",

  // Config Firebase — SIJI WAE, padha karo undangan liyane sing nganggo
  // project sing padha. Ora usah diganti kajaba pancen gawe project anyar.
  firebase: {
    apiKey: "AIzaSyC89017s4DzcsGDROhp5oqH_leuO9W9WI",
    authDomain: "neoma-query.firebaseapp.com",
    projectId: "neoma-query",
    storageBucket: "neoma-query.firebasestorage.app",
    messagingSenderId: "34923299362",
    appId: "1:34923299362:web:980168a766bbdec873807b"
  }
};
