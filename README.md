# Synth & Spice Restaurant Ordering System (K15PPWD)

Aplikasi web pemesanan makanan digital **Synth & Spice** untuk Proyek UAS Mata Kuliah **Praktikum Pemrograman Web Dasar** (Studi Kasus **K15: Sistem Pemesanan Makanan Restoran**).

---

## 1. Identitas Proyek

- **Nomor Studi Kasus**: K15 (Sistem Pemesanan Makanan Restoran)
- **Nama Sistem**: Synth & Spice Restaurant Ordering System
- **Jenis Restoran**: Restoran cepat saji bertema gelap futuristik cyan-biru
- **Sifat Aplikasi**: Aplikasi web frontend-only (tanpa backend dan tanpa database)
- **Dosen Pengampu**: SYAHRU RAHMAYUDA, S.Kom., M.Kom.
- **Asisten Dosen**:
  1. Aldinata Retnas
  2. Gian
- **Repository GitHub**: `https://github.com/aerthaze/K15PPWD.git`

| No. | Nama Anggota | NIM | Tanggung Jawab | Branch GitHub | File Utama |
|---|---|---|---|---|---|
| 1 | Muhammad Hafizh Alfitra | H1101251003 | JavaScript Vanilla | `feature/javascript` | `js/menu-data.js`, `js/script.js` |
| 2 | Dimas Lutfi Salim | H1101251004 | jQuery | `feature/jquery` | `js/jquery-interactions.js` |
| 3 | Muhammad Farras Haidar Revanezka | H1101251035 | CSS | `feature/css` | `css/style.css` |
| 4 | Chattama Albiantoro | H1101251069 | HTML, Aset, dan Laporan | `feature/html` | `index.html`, `assets/`, `laporan.pdf`, `README.md` (`main`) |

---

## 2. Deskripsi dan Tujuan Aplikasi

**Synth & Spice** memungkinkan pelanggan menelusuri katalog menu digital, menyaring hidangan berdasarkan kategori (**Makanan**, **Minuman**, **Camilan**), mencari menu berdasarkan nama, mengelola keranjang pesanan dengan perhitungan subtotal per item serta total pembayaran otomatis, memvalidasi data pelanggan di `#form-pemesanan`, hingga melihat struk pada modal konfirmasi.

Seluruh harga menu, jumlah stok awal, dan nomor pesanan pada aplikasi ini merupakan **data simulasi frontend** untuk keperluan demonstrasi akademik dan bukan transaksi restoran sungguhan.

---

## 3. Teknologi yang Digunakan

- **HTML5 (`index.html`)**: Struktur semantik (`<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<footer>`) serta atribut validasi form native (`required`, `minlength`, `maxlength`, `pattern`).
- **CSS3 (`css/style.css`)**: Tema gelap cyan-biru (`#05070D`, `#0B1220`, `#00E5FF`, `#1677FF`, `#FF3158`, `#F4F7FF`, `#9BA8BC`), tipografi *Chakra Petch* dan *Plus Jakarta Sans*, layout responsif mobile-first (`@media (min-width: 992px)` untuk sticky sidebar), target sentuh tombol minimal `44px`, dukungan `prefers-reduced-motion`, dan nol inline style.
- **Bootstrap 5.3.3**: Sistem grid (`container`, `row`, `col-12`, `col-md-6`, `col-lg-4`, `col-lg-6`, `col-lg-8`) dan 6 komponen aktif (Navbar, Card, 4 Modal [`#modal-keranjang`, `#modal-ringkasan`, `#modal-konfirmasi`, `#modal-hapus`], Button, Badge, dan Alert).
- **JavaScript Vanilla (`js/menu-data.js`, `js/script.js`)**: Gaya ES5 (`var`, `function`, `for`) berisi 9 data menu statis `SYNTH_SPICE_MENU` serta fungsi global sederhana (`initApp()`, `getMenuList()`, `addToCart()`, `incrementItem()`, `decrementItem()`, `removeItem()`, `clearCart()`, `formatRupiah()`, `createOrder()`, dan persistensi `localStorage`).
- **jQuery 3.7.1 (`js/jquery-interactions.js`)**: Selektor `$()`, penanganan event (`click`, `input`, `mouseenter`/`mouseleave`, `blur`, `submit`), manipulasi DOM (`.html()`, `.text()`, `.val()`, `.addClass()`, `.removeClass()`, `.toggleClass()`), validasi form terpadu, serta kontrol empat Bootstrap Modal.

---

## 4. Fitur Wajib dan Fitur Bonus (K15)

### Fitur Wajib
1. Katalog menu dalam grid card Bootstrap (3 kolom desktop, 2 kolom tablet, 1 kolom mobile).
2. Setiap kartu menu menampilkan gambar lokal, badge kategori, penanda andalan (`.is-featured`), nama, deskripsi, sisa stok simulasi, harga format `Rp XX.XXX`, dan tombol `+ Tambah`.
3. Filter menu berdasarkan kategori (**Semua**, **Makanan**, **Minuman**, **Camilan**).
4. Keranjang pesanan di sidebar kanan pada desktop dan berpindah ke bagian bawah pada tablet/mobile.
5. Tombol increment (`+`) dan decrement (`-`) berbatas stok simulasi dengan ukuran target sentuh minimal `44px`.
6. Perhitungan subtotal per item, total kuantitas, dan total pembayaran otomatis lewat `formatRupiah()`.
7. Form data pelanggan (`#form-pemesanan`: Nama Pelanggan, Nomor Meja, Catatan opsional) dengan validasi jQuery terpadu untuk submit sidebar maupun alur modal `#btn-keranjang`.
8. Modal konfirmasi pesanan (`#modal-konfirmasi`) berisi nomor pesanan unik `SSP-YYYYMMDD-XXXX`, waktu, nama dan nomor meja, catatan, rincian item beserta subtotal, dan total bayar, lalu mengosongkan keranjang dan `localStorage`.
9. Tombol hapus item, pengurangan item terakhir, dan tombol kosongkan keranjang dengan modal konfirmasi `#modal-hapus`.

### Fitur Bonus
1. **Pencarian Menu Real-Time**: Pencarian berdasarkan nama menu tanpa membedakan huruf kapital beserta pembaruan teks `#info-menu`, empty state, dan tombol reset.
2. **Badge Keranjang**: Indikator jumlah total seluruh unit item di tombol keranjang navbar (`#cart-count`) dan header panel keranjang (`#badge-keranjang-sidebar`).
3. **Persistensi `localStorage`**: Menyimpan pasangan `{ id, jumlah }` pada kunci `synth_spice_cart_v1` agar bertahan setelah refresh, lengkap dengan pemulihan otomatis apabila data JSON rusak.

---

## 5. Struktur Folder Proyek (Branch `main`)

```text
K15PPWD/
├── index.html
├── README.md
├── laporan.pdf
├── .gitignore
├── css/
│   └── style.css
├── js/
│   ├── menu-data.js
│   ├── script.js
│   └── jquery-interactions.js
└── assets/
    ├── ASSET-SOURCES.md
    ├── logo/
    │   ├── synth-spice-logo.svg
    │   └── favicon.svg
    ├── icons/
    │   ├── alert.svg
    │   ├── cart.svg
    │   ├── check-circle.svg
    │   ├── drink.svg
    │   ├── food.svg
    │   ├── search.svg
    │   ├── snack.svg
    │   └── trash.svg
    ├── backgrounds/
    │   └── hero-cyber-city.jpg
    └── images/
        ├── food/
        │   ├── hero-signature-combo.jpg
        │   ├── neon-smash-burger.jpg
        │   ├── cyber-spicy-ramen.jpg
        │   └── voltage-chicken-rice.jpg
        ├── drinks/
        │   ├── electric-citrus-fizz.jpg
        │   ├── magenta-berry-soda.jpg
        │   └── midnight-cold-brew.jpg
        └── snacks/
            ├── circuit-loaded-fries.jpg
            ├── crimson-spice-wings.jpg
            └── pulse-crispy-gyoza.jpg
```

---

## 6. Cara Menjalankan Aplikasi

1. Pastikan folder `K15PPWD/` berisi seluruh file proyek secara lengkap.
2. Jalankan salah satu server lokal berikut:
   - **VS Code Live Server**: Buka folder `K15PPWD`, klik kanan `index.html`, pilih **Open with Live Server**.
   - **Python HTTP Server**:
     ```bash
     cd K15PPWD
     python -m http.server 8080
     ```
     Lalu buka `http://127.0.0.1:8080` pada browser (Chrome, Edge, atau Firefox).
3. Catatan: Akses internet diperlukan saat membuka halaman karena Bootstrap 5.3.3, jQuery 3.7.1, dan Google Fonts dimuat dari CDN, sedangkan seluruh gambar menu, latar hero, logo, dan ikon SVG dimuat dari folder lokal `assets/`.

---

## 7. Cara Kerja `localStorage`

1. Saat halaman dimuat, `initApp()` memanggil `loadCartFromStorage()` untuk membaca kunci `synth_spice_cart_v1`.
2. Setiap entri `{ id, jumlah }` dicek ulang terhadap `SYNTH_SPICE_MENU` agar ID yang tidak valid terbuang dan jumlah tidak pernah melebihi stok simulasi. Apabila JSON rusak, keranjang dikosongkan otomatis dan aplikasi menampilkan notifikasi peringatan.
3. Setiap aksi tambah, `+`, `-`, hapus, atau kosongkan keranjang memanggil `saveCartToStorage()`.
4. Saat pesanan dikonfirmasi melalui `createOrder()`, keranjang dikosongkan dan `localStorage` diperbarui menjadi `[]`.
