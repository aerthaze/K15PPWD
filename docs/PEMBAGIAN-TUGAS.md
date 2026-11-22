# Pembagian Tugas Anggota Kelompok - Synth & Spice (K15PPWD)

## 1. Identitas Akademik

- **Mata Kuliah**: Praktikum Pemrograman Web Dasar
- **Studi Kasus**: K15 - Sistem Pemesanan Makanan Restoran (*Synth & Spice Restaurant Ordering System*)
- **Nomor Kelompok**: `[BELUM TERKONFIRMASI - Diisi kelompok sesuai daftar resmi dari dosen]`
- **Dosen Pengampu**: SYAHRU RAHMAYUDA, S.Kom., M.Kom.
- **Asisten Dosen**:
  1. Aldinata Retnas
  2. Gian
- **Repository GitHub**: `https://github.com/aerthaze/K15PPWD.git`

---

## 2. Tabel Pembagian Resmi Empat Anggota

| No. | Nama Anggota | NIM | Tanggung Jawab | Branch GitHub | File Utama yang Dikelola |
|---|---|---|---|---|---|
| 1 | Muhammad Hafizh Alfitra | H1101251003 | JavaScript Vanilla | `feature/javascript` | `js/menu-data.js`, `js/script.js` |
| 2 | Dimas Lutfi Salim | H1101251004 | jQuery | `feature/jquery` | `js/jquery-interactions.js` |
| 3 | Muhammad Farras Haidar Revanezka | H1101251035 | CSS | `feature/css` | `css/style.css` |
| 4 | Chattama Albiantoro | H1101251069 | HTML &amp; Dokumentasi Koordinator | `feature/html` | `index.html`, `assets/`, `docs/` |

> **Aturan `README.md` Khusus `main`**: Sesuai kesepakatan tim, `README.md` hanya disimpan pada branch `main` (diinisialisasi bersama `github-main-seed`), sehingga keempat branch fitur (`feature/*`) tidak menyimpan file `README*`.
> **Catatan Kontribusi Final**: Pembagian beban rencana awal adalah setara (25% per anggota), namun persentase kontribusi aktual untuk tabel laporan UAS wajib dievaluasi kembali oleh kelompok berdasarkan riwayat PR/commit masing-masing anggota sebelum pengumpulan final.

---

## 3. Rincian Tugas & Relasi Komponen Per Anggota

### Anggota 1: Muhammad Hafizh Alfitra (`H1101251003`) - JavaScript Vanilla
- **Branch**: `feature/javascript`
- **Cakupan Kerja**:
  - Menyusun array data simulasi `SYNTH_SPICE_MENU` (9 produk pada kategori `makanan`, `minuman`, `camilan`).
  - Membangun modul state dan logika inti `window.SynthSpiceApp` di `js/script.js`.
  - Mengimplementasikan pengecekan stok, penambahan item, increment/decrement, penghapusan, subtotal, total pembayaran, dan nomor pesanan unik `SSP-YYYYMMDD-XXXX`.
  - Mengelola persistensi `localStorage` beserta pemulihan defensif ketika data korup atau ID menu sudah tidak valid.
- **Relasi Integrasi**: Menyediakan API `window.SynthSpiceApp` yang dikonsumsi oleh `js/jquery-interactions.js`.
- **Panduan Uji Mandiri**: Buka browser console dan uji metode `SynthSpiceApp.getMenuList()`, `SynthSpiceApp.addToCart('MKN-01', 1)`, `SynthSpiceApp.getTotalPrice()`, `SynthSpiceApp.createOrder(...)`, serta reload halaman untuk verifikasi `localStorage`.

### Anggota 2: Dimas Lutfi Salim (`H1101251004`) - jQuery
- **Branch**: `feature/jquery`
- **Cakupan Kerja**:
  - Menginisialisasi aplikasi saat `$(document).ready(...)` dan mengikat seluruh event UI melalui `$()`.
  - Mengimplementasikan minimal 3+ event nyata (`click`, `input`, `submit`, `mouseenter`/`mouseleave`, `blur`).
  - Memanipulasi DOM dengan `.html()`, `.text()`, `.val()`, `.addClass()`, `.removeClass()`, dan `.toggleClass()`.
  - Menghubungkan filter kategori dan search menu ke `SynthSpiceApp.getMenuList(...)`.
  - Mengelola validasi form checkout (nama pelanggan, nomor meja, catatan opsional, dan cek keranjang non-kosong), menampilkan error spesifik, dan menghapus error secara langsung saat pengguna memperbaiki input.
  - Mengelola dua Bootstrap Modal: `#delete-confirm-modal` (sebelum menghapus item atau mengosongkan keranjang) dan `#order-confirmation-modal` (ringkasan pesanan berhasil).
- **Relasi Integrasi**: Mengikat selector HTML milik Chattama, memicu class state CSS milik Farras, dan memanggil API `window.SynthSpiceApp` milik Hafizh.
- **Panduan Uji Mandiri**: Klik filter kategori, ketik pencarian huruf besar/kecil, tambah item, klik `+`/`-`/`Hapus`, uji form kosong/salah/benar, lalu periksa modal konfirmasi.

### Anggota 3: Muhammad Farras Haidar Revanezka (`H1101251035`) - CSS
- **Branch**: `feature/css`
- **Cakupan Kerja**:
  - Menerapkan tema Cyberpunk Futuristic (palet `#05070D`, `#0B1220`, `#00E5FF`, `#1677FF`, `#FF2BD6`, `#FF3158`, `#F4F7FF`, `#9BA8BC`) di `css/style.css` tanpa inline style di HTML.
  - Menata typografi (`Chakra Petch` + `Plus Jakarta Sans`), kontras teks WCAG AA, hero banner, card menu 3 kolom/1 kolom, sticky cart sidebar kanan pada desktop dan bawah pada mobile, form dark-mode, modal, serta animasi transisi hover dan `prefers-reduced-motion`.
  - Memastikan responsivitas bersih tanpa horizontal overflow pada lebar `375px` hingga `1440px`.
- **Relasi Integrasi**: Men-style ID/class dari `index.html` dan state class `.is-active`, `.is-hovered`, `.is-at-stock-limit` dari `js/jquery-interactions.js`.
- **Panduan Uji Mandiri**: Gunakan DevTools Responsive Mode pada `375px`, `425px`, `768px`, `1024px`, dan `1440px`; pastikan tidak ada scrollbar horizontal, tombol minimal setinggi target nyaman sentuh di mobile, dan teks terbaca jelas.

### Anggota 4: Chattama Albiantoro (`H1101251069`) - HTML & Dokumentasi
- **Branch**: `feature/html`
- **Cakupan Kerja**:
  - Membangun struktur semantik HTML5 pada `index.html` (`<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<footer>`).
  - Menyediakan elemen form checkout dengan atribut validasi HTML5 (`required`, `type`, `minlength`, `maxlength`, `pattern`).
  - Memasang komponen Bootstrap 5 (Navbar, Card container, Modal, Button, Badge, Alert, Table) dan urutan load script yang tepat.
  - Mengelola aset lokal (`assets/logo/`, `assets/icons/`, `assets/images/`, `assets/backgrounds/`) dan mengkoordinasikan dokumentasi bersama (`README.md`, `docs/`, `laporan.pdf`).
- **Relasi Integrasi**: Menjadi rangka dasar seluruh selector yang ditata CSS dan dimanipulasi jQuery.
- **Panduan Uji Mandiri**: Pastikan semua gambar lokal tampil (`naturalWidth > 0`), tidak ada tautan navigasi buntu, atribut form lengkap, dan seluruh landmark HTML valid.

---

## 4. Tanggung Jawab Integrasi Bersama

Sebelum merge Pull Request apa pun ke `main`:
1. Pastikan hanya file milik branch bersangkutan yang diubah (kecuali perubahan kontrak yang telah disepakati bersama).
2. Periksa urutan `<script>` dan ID selector sesuai `docs/INTEGRATION-CONTRACT.md`.
3. Jalankan uji regresi penuh sesuai `docs/TEST-PLAN.md` setelah semua branch digabungkan ke `main`.
