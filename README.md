# Synth & Spice Restaurant Ordering System (K15PPWD)

Aplikasi web pemesanan makanan digital **Synth & Spice** untuk memenuhi Proyek UAS Mata Kuliah **Praktikum Pemrograman Web Dasar** (Studi Kasus **K15: Sistem Pemesanan Makanan Restoran**).

---

## 1. Identitas Proyek

- **Nomor Studi Kasus**: K15 - Sistem Pemesanan Makanan Restoran
- **Nama Sistem**: Synth & Spice Restaurant Ordering System
- **Jenis Restoran**: Fast food restaurant bertema Cyberpunk Futuristic
- **Sifat Aplikasi**: Frontend-only web application (tanpa backend dan tanpa database)
- **Dosen Pengampu**: SYAHRU RAHMAYUDA, S.Kom., M.Kom.
- **Asisten Dosen**:
  1. Aldinata Retnas
  2. Gian
- **Nomor Kelompok**: `[Belum terkonfirmasi - Diisi kelompok sesuai daftar resmi dari dosen]`
- **Repository GitHub**: `https://github.com/aerthaze/K15PPWD.git`

---

## 2. Deskripsi & Tujuan Aplikasi

**Synth & Spice** memungkinkan pelanggan restoran cepat saji menelusuri katalog menu digital, menyaring hidangan berdasarkan kategori (**Makanan**, **Minuman**, **Camilan**), mencari menu berdasarkan nama, mengelola keranjang pesanan dengan perhitungan harga otomatis dan validasi stok simulasi, serta mengisi form data pelanggan hingga mendapatkan ringkasan pesanan pada modal konfirmasi.

**Tujuan Pengembangan (CPMK011 & CPMK052)**:
Mengintegrasikan HTML5 semantik, CSS3 eksternal, Bootstrap 5, JavaScript Vanilla, jQuery, dan `localStorage` dalam satu proyek web yang fungsional, responsif (`375px` hingga `1440px`), terstruktur, dan mudah dikerjakan bersama oleh 4 anggota melalui feature branch GitHub.

> **Catatan Simulasi**: Seluruh harga menu, jumlah stok awal, dan nomor pesanan pada aplikasi ini merupakan **data simulasi frontend** untuk demonstrasi akademik dan bukan transaksi restoran sungguhan.

---

## 3. Teknologi yang Digunakan

- **HTML5**: Struktur semantik (`<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<footer>`) dan atribut validasi form.
- **CSS3 (`css/style.css`)**: Palet tema Cyberpunk Futuristic (`#05070D`, `#0B1220`, `#00E5FF`, `#1677FF`, `#FF2BD6`, `#FF3158`, `#F4F7FF`, `#9BA8BC`), layout responsif mobile-first, tanpa inline style.
- **Bootstrap 5.3.3**: Grid system (`container`, `row`, `col-12`, `col-md-6`, `col-lg-4`, `col-lg-8`) dan 7 komponen aktif (Navbar, Card, Modal, Button, Badge, Alert, Table).
- **JavaScript Vanilla (`js/menu-data.js`, `js/script.js`)**: Data array statis 9 menu, pengelolaan state keranjang melalui `window.SynthSpiceApp`, pengecekan stok, penghitungan total, nomor pesanan unik `SSP-YYYYMMDD-XXXX`, dan persistensi `localStorage`.
- **jQuery 3.7.1 (`js/jquery-interactions.js`)**: Selector `$()`, event handling (`click`, `input`, `mouseenter`/`mouseleave`, `blur`, `submit`), manipulasi DOM (`.html()`, `.text()`, `.val()`, `.addClass()`, `.removeClass()`, `.toggleClass()`), validasi form client-side, dan kendali modal Bootstrap.

---

## 4. Fitur Wajib & Fitur Bonus (K15)

### Fitur Wajib
1. Halaman katalog menu dalam grid card Bootstrap (**3 kolom desktop**, **2 kolom tablet**, **1 kolom mobile**).
2. Setiap menu tampil dalam card Bootstrap berisi gambar lokal, nama, kategori, deskripsi, stok simulasi, harga Rupiah, dan tombol **Tambah**.
3. Filter menu berdasarkan kategori (**Semua**, **Makanan**, **Minuman**, **Camilan**).
4. Keranjang pesanan di **sidebar kanan pada desktop** dan berpindah ke **bagian bawah pada mobile/tablet**.
5. Tombol **increment (`+`)** dan **decrement (`-`)** jumlah item dengan pembatasan stok simulasi.
6. Perhitungan **subtotal dan total pembayaran otomatis** setiap kali keranjang berubah.
7. Form data pelanggan (**Nama Pelanggan**, **Nomor Meja**, dan **Catatan** opsional) dengan **validasi jQuery** serta pembersihan pesan error langsung saat input diperbaiki.
8. **Modal konfirmasi pesanan Bootstrap** berisi nomor pesanan unik, waktu, data pelanggan, tabel ringkasan item, dan total yang harus dibayar, lalu mengosongkan keranjang dan `localStorage`.
9. **Tombol hapus item** (serta pengurangan item terakhir dan tombol kosongkan keranjang) dengan **modal konfirmasi Bootstrap**.

### Fitur Bonus
1. **Search Menu**: Pencarian real-time berdasarkan nama menu (tidak membedakan huruf kapital dan nonkapital) beserta empty state dan tombol reset.
2. **Badge Keranjang**: Badge jumlah item pada tombol keranjang di navbar dan header keranjang. Penghitungan dilakukan berdasarkan **total kuantitas seluruh unit item** di dalam keranjang (misal 2 burger + 1 minuman = `3`), bukan sekadar jumlah jenis menu.
3. **Persistensi `localStorage`**: Menyimpan isi keranjang (`{ id, jumlah }`) di kunci `synth_spice_cart_v1` agar tidak hilang saat halaman di-refresh, lengkap dengan pemulihan defensif jika data korup.

---

> **Aturan Repository**: File `README.md` ini hanya ditempatkan dan dikelola pada branch **`main`**. Branch fitur anggota (`feature/html`, `feature/css`, `feature/javascript`, `feature/jquery`) tidak menyimpan file `README*` tambahan agar merge ke `main` tetap bersih tanpa konflik dokumentasi.

---

## 5. Struktur Folder Proyek (Pada Branch `main` Terintegrasi)

```text
K15PPWD/
├── index.html
├── README.md                         # Khusus branch main
├── laporan.pdf
├── .gitignore
├── css/
│   └── style.css
├── js/
│   ├── menu-data.js
│   ├── script.js
│   └── jquery-interactions.js
├── assets/
│   ├── ASSET-SOURCES.md
│   ├── logo/
│   │   ├── synth-spice-logo.svg
│   │   └── favicon.svg
│   ├── icons/
│   │   ├── alert.svg, cart.svg, check-circle.svg, drink.svg,
│   │   └── food.svg, search.svg, snack.svg, trash.svg
│   ├── backgrounds/
│   │   └── hero-cyber-city.jpg
│   └── images/
│       ├── food/ (hero-signature-combo.jpg, neon-smash-burger.jpg, cyber-spicy-ramen.jpg, voltage-chicken-rice.jpg)
│       ├── drinks/ (electric-citrus-fizz.jpg, magenta-berry-soda.jpg, midnight-cold-brew.jpg)
│       └── snacks/ (circuit-loaded-fries.jpg, crimson-spice-wings.jpg, pulse-crispy-gyoza.jpg)
└── docs/
    ├── REQUIREMENT-MATRIX.md
    ├── PEMBAGIAN-TUGAS.md
    ├── PANDUAN-GITHUB.md
    ├── INTEGRATION-CONTRACT.md
    ├── TEST-PLAN.md
    ├── WIRE-FRAME.md
    ├── PERSIAPAN-PRESENTASI.md
    └── screenshots/
```

---

## 6. Cara Menjalankan Aplikasi

1. Pastikan folder `K15PPWD/` berisi seluruh file proyek secara lengkap.
2. Jalankan salah satu cara berikut:
   - **Menggunakan VS Code Live Server**: Buka folder `K15PPWD`, klik kanan `index.html`, pilih **Open with Live Server**.
   - **Menggunakan Python HTTP Server**:
     ```bash
     cd K15PPWD
     python -m http.server 8080
     ```
     Lalu buka `http://127.0.0.1:8080` pada browser (Chrome, Edge, atau Firefox).
3. Catatan: Akses internet diperlukan saat membuka aplikasi karena Bootstrap 5.3.3, jQuery 3.7.1, dan Google Fonts dimuat dari CDN resmi, sedangkan seluruh gambar menu dan ikon SVG dimuat dari folder lokal `assets/`.

---

## 7. Cara Kerja `localStorage`

1. Saat halaman dimuat, `window.SynthSpiceApp.init()` memanggil `loadCartFromStorage()` untuk membaca kunci `synth_spice_cart_v1`.
2. Setiap entri `{ id, jumlah }` dicek ulang terhadap katalog `SYNTH_SPICE_MENU` agar ID yang tidak valid terbuang dan jumlah tidak pernah melebihi stok simulasi. Jika JSON korup, keranjang otomatis di-reset dengan aman.
3. Setiap aksi tambah, increment, decrement, hapus, atau kosongkan keranjang langsung memanggil `saveCartToStorage()`.
4. Saat pesanan dikonfirmasi melalui `createOrder()`, keranjang dikosongkan dan `localStorage` diperbarui menjadi `[]`.

---

## 8. Pembagian Tugas & Informasi Repository

| No. | Nama Anggota | NIM | Tanggung Jawab | Branch GitHub | File Utama |
|---|---|---|---|---|---|
| 1 | Muhammad Hafizh Alfitra | H1101251003 | JavaScript Vanilla | `feature/javascript` | `js/menu-data.js`, `js/script.js` |
| 2 | Dimas Lutfi Salim | H1101251004 | jQuery | `feature/jquery` | `js/jquery-interactions.js` |
| 3 | Muhammad Farras Haidar Revanezka | H1101251035 | CSS | `feature/css` | `css/style.css` |
| 4 | Chattama Albiantoro | H1101251069 | HTML &amp; Dokumentasi | `feature/html` | `index.html`, `assets/`, `docs/` |

- `README.md` dikelola khusus di branch `main` (file ini tidak ditaruh di branch fitur).

- Rencana kontribusi awal setara (25% per anggota); persentase kontribusi final dicatat berdasarkan riwayat Pull Request aktual pada repository `https://github.com/aerthaze/K15PPWD.git`.
- Lihat panduan lengkap kolaborasi Git pada [docs/PANDUAN-GITHUB.md](docs/PANDUAN-GITHUB.md) dan rincian integrasi pada [docs/INTEGRATION-CONTRACT.md](docs/INTEGRATION-CONTRACT.md).
