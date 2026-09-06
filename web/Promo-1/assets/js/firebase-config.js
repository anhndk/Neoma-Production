/* =========================================================================
   ⚙️ KONFIGURASI KHUSUS SAK-UNDANGAN
   =========================================================================
   FILE IKI SIJI-SIJINE SING KUDU DIGANTI SABEN DUPLIKAT KANGGO PEMBELI ANYAR.
   File liyane (index.html, style.css, script.js) TETEP PODO, ora usah
   diowahi maneh.

   Backend (Firebase project) mung disetup SEPISAN wae kanggo kabeh
   pembeli. Saben undangan anyar mung ganti 2 baris ing ngisor iki:
   "slug" lan "adminSecret" — rasah bikin project Firebase anyar maneh.
   ========================================================================= */

var INVITATION_CONFIG = {

  // Pengenal unik undangan iki. KUDU BEDA kanggo saben pembeli/undangan,
  // supaya ucapan ora kecampur karo undangan liyane. Cukup nganggo
  // huruf cilik lan strip, conto: "hidayah-firman", "budi-sinta-2026"
  slug: "hidayah-firman",

  // Kode rahasia kanggo mbusak ucapan spam. Wenehke mung menyang
  // pembeli (tuan rumah), aja disebar. Ganti karo kode bebas.
  //
  // ⚠️ CATETAN JUJUR: kode iki kesimpen ing kode situs (JavaScript),
  // dadi wong sing pancen ngerti teknis lan buka "View Source"/Inspect
  // Element sacarane iso weruh kode iki. Kanggo buku tamu pernikahan
  // (data ora sensitif, resiko paling apes mung ana wong usil mbusak
  // ucapan) iki wis cukup aman. Yen pengen keamanan level "beneran"
  // (kaya nyimpen data pembayaran), kudu nganggo Firebase Auth utawa
  // Cloud Functions — luwih rumit setup-e, tak jelasake yen dibutuhake.
  adminSecret: "060926",

  // Kode konfigurasi Firebase — dijupuk seko Firebase Console
  // (Project Settings > Your apps > SDK setup and configuration).
  // Iki SIJI WAE kanggo kabeh undangan (project Firebase sing padha),
  // ora usah diganti saben duplikat, KECUALI panjenengan pancen bikin
  // project Firebase anyar.
  firebase: {
    apiKey: "AIzaSyC89017s4DzcsGDROhp5oqH_leuO9W9WI",
    authDomain: "neoma-query.firebaseapp.com",
    projectId: "neoma-query",
    storageBucket: "neoma-query.firebasestorage.app",
    messagingSenderId: "34923299362",
    appId: "1:34923299362:web:980168a766bbdec873807b"
  }
};
