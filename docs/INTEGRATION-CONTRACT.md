# Integration Contract - Synth & Spice Ordering System

Dokumen ini mendefinisikan kontrak integrasi resmi antara keempat lapisan proyek (**HTML**, **CSS**, **JavaScript Vanilla**, dan **jQuery**) agar keempat anggota kelompok dapat mengembangkan file masing-masing secara paralel di branch terpisah tanpa tumpang tindih logika maupun konflik selector.

---

## 1. Urutan Pemuatan File (Dependency Load Order)

Seluruh file harus dimuat dalam urutan tepat berikut pada `index.html`:

### Di dalam `<head>`:
1. Google Fonts (`Chakra Petch` & `Plus Jakarta Sans`)
2. Bootstrap 5.3.3 CSS (`https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css`)
3. `css/style.css` *(overrides dan tema Cyberpunk berada setelah Bootstrap)*

### Di bagian akhir `<body>`:
4. jQuery 3.7.1 (`https://code.jquery.com/jquery-3.7.1.min.js`)
5. Bootstrap 5.3.3 JS Bundle (`https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js`, sudah termasuk Popper)
6. `js/menu-data.js` *(mendefinisikan `window.SYNTH_SPICE_CONFIG` dan `window.SYNTH_SPICE_MENU`)*
7. `js/script.js` *(mendefinisikan state inti, `localStorage`, dan mengekspor `window.SynthSpiceApp`)*
8. `js/jquery-interactions.js` *(memanggil `window.SynthSpiceApp.init()` pada `$(document).ready(...)` dan mengikat seluruh event UI)*

---

## 2. Pembagian Tanggung Jawab Lapisan

| Lapisan | Pemilik | Aturan Keras (Boundaries) |
|---|---|---|
| **HTML** (`index.html`) | Chattama Albiantoro (`H1101251069`) | Menyediakan struktur semantik, atribut form native, ID, dan class target. Dilarang menulis skrip logika bisnis JS atau inline `style="..."`. |
| **CSS** (`css/style.css`) | Muhammad Farras Haidar Revanezka (`H1101251035`) | Mengatur seluruh tampilan visual, warna, tipografi, animasi, efek neon, dan responsivitas berdasarkan selector kontrak. Dilarang mengubah ID atau menghapus class hook JS/jQuery. |
| **JavaScript Vanilla** (`js/menu-data.js`, `js/script.js`) | Muhammad Hafizh Alfitra (`H1101251003`) | Mengelola data statis, state keranjang, aturan stok, kalkulasi Rupiah/subtotal/total, nomor pesanan unik, dan persistensi `localStorage`. Dilarang mengakses DOM secara langsung atau memanggil `$()`. |
| **jQuery** (`js/jquery-interactions.js`) | Dimas Lutfi Salim (`H1101251004`) | Mengikat seluruh event UI (`click`, `input`, `submit`, `mouseenter`/`mouseleave`, `blur`), validasi form, render template HTML dinamis, dan kontrol Bootstrap Modal. Dilarang menduplikasi perhitungan harga atau mengakses `localStorage` secara langsung. |

---

## 3. Kontrak HTML Selector (`index.html` <-> `css` <-> `jQuery`)

### A. Navigasi & Hero
| ID / Selector | Jenis | Fungsi & Kontrak |
|---|---|---|
| `#top` | `<header>` | Landmark header sticky |
| `#mainNav` | `<div>` | Target collapse navbar Bootstrap di mobile |
| `#nav-cart-btn` | `<a href="#cart-panel">` | Tombol akses cepat ke area keranjang di navbar |
| `#cart-count` | `<span>` | Badge angka total kuantitas seluruh item di keranjang |
| `#hero-section` | `<section>` | Area hero pembuka Synth & Spice |
| `#menu-section` | `<section>` | Section utama katalog + sidebar keranjang |
| `#restaurant-info` | `<section>` | Section informasi operasional & proyek Synth & Spice |

### B. Katalog, Filter & Search
| ID / Selector | Jenis | Fungsi & Kontrak |
|---|---|---|
| `#category-filter` | `<div>` | Container tombol filter kategori (`.btn-filter-category`) |
| `.btn-filter-category` | `<button data-category="...">` | Nilai `data-category`: `"semua"`, `"makanan"`, `"minuman"`, `"camilan"` |
| `#menu-search` | `<input type="search">` | Kolom pencarian real-time nama produk |
| `#clear-search-btn` | `<button type="button">` | Tombol bersihkan teks pencarian |
| `#menu-result-info` | `<p>` | Ringkasan jumlah menu yang sedang tampil |
| `#app-feedback-alert` | `<div>` | Bootstrap Alert untuk umpan balik stok/keranjang |
| `#menu-loading-state` | `<div>` | Indikator muat awal (disembunyikan via `.d-none` setelah render pertama) |
| `#menu-container` | `<div class="row g-3">` | Target render Bootstrap Card menu (`.menu-col` > `.menu-card`) |
| `#menu-empty-state` | `<div>` | Tampilan saat filter/search tidak menemukan menu |
| `#reset-filter-btn` | `<button type="button">` | Mengembalikan kategori ke `semua` dan mengosongkan `#menu-search` |

### C. Sidebar Keranjang & Form Pemesanan
| ID / Selector | Jenis | Fungsi & Kontrak |
|---|---|---|
| `#cart-panel` | `<aside>` | Kolom sidebar kanan di desktop (`col-lg-4`), di bawah menu pada mobile |
| `#cart-sidebar-badge` | `<span>` | Badge status jumlah item di header panel keranjang |
| `#clear-cart-btn` | `<button type="button">` | Membuka modal konfirmasi untuk mengosongkan seluruh keranjang |
| `#cart-empty-state` | `<div>` | Pesan saat keranjang kosong |
| `#cart-container` | `<div>` | Container daftar item keranjang (`.cart-item-row`) |
| `#cart-total-qty` | `<span>` | Menampilkan total kuantitas item (mis. `3 item`) |
| `#cart-total` | `<span>` | Menampilkan total harga terformat (mis. `Rp 115.000`) |
| `#checkout-form` | `<form novalidate>` | Form data pelanggan |
| `#customer-name` | `<input type="text" required minlength="2" maxlength="60">` | Input nama pelanggan |
| `#customer-name-error` | `<div class="invalid-feedback">` | Pesan error validasi nama pelanggan |
| `#table-number` | `<input type="text" required pattern="^[A-Za-z]?[0-9]{1,2}$" minlength="1" maxlength="3">` | Input nomor meja (contoh: `1`, `12`, `A5`) |
| `#table-number-error` | `<div class="invalid-feedback">` | Pesan error validasi nomor meja |
| `#order-note` | `<textarea maxlength="150">` | Catatan opsional pesanan |
| `#order-note-error` | `<div class="invalid-feedback">` | Pesan error jika panjang catatan melebihi batas |
| `#checkout-form-alert` | `<div class="alert ... d-none">` | Alert error tingkat form (mis. keranjang masih kosong) |
| `#submit-order-btn` | `<button type="submit">` | Tombol konfirmasi pesanan |

### D. Modal Bootstrap
| ID / Selector | Fungsi & Kontrak |
|---|---|
| `#delete-confirm-modal` | Modal konfirmasi penghapusan item atau pengosongan keranjang |
| `#delete-modal-message` | Deskripsi aksi penghapusan pada modal |
| `#delete-item-name` | Elemen highlight nama produk yang akan dihapus |
| `#confirm-delete-btn` | Tombol konfirmasi hapus akhir |
| `#order-confirmation-modal` | Modal ringkasan pesanan berhasil |
| `#modal-order-number` | Nomor pesanan unik (`SSP-YYYYMMDD-XXXX`) |
| `#modal-order-time` | Waktu pemesanan terformat lokal |
| `#modal-customer-name` | Nama pelanggan |
| `#modal-table-number` | Nomor meja |
| `#modal-order-note` | Catatan pesanan (atau `"-"`) |
| `#modal-order-items` | `<tbody>` tabel Bootstrap berisi rincian menu, qty, dan subtotal |
| `#modal-order-total` | Total pembayaran terformat Rupiah |

---

## 4. Kontrak Data & API JavaScript (`window.SynthSpiceApp`)

### A. Sumber Data (`js/menu-data.js`)
- `window.SYNTH_SPICE_CONFIG`:
  - `storageKey`: `'synth_spice_cart_v1'`
  - `orderPrefix`: `'SSP'`
  - `isSimulationData`: `true`
- `window.SYNTH_SPICE_MENU`: Array objek dengan properti:
  `{ id: string, nama: string, kategori: 'makanan'|'minuman'|'camilan', harga: number, deskripsi: string, stok: number, gambar: string, badgeLabel: string }`

### B. Metode Publik `window.SynthSpiceApp` (`js/script.js`)
Seluruh metode mutasi mengembalikan objek hasil standar:
`{ ok: boolean, code: string, message: string, data?: any }`

| Metode | Parameter | Return / Perilaku |
|---|---|---|
| `init()` | - | Memuat `SYNTH_SPICE_MENU`, memulihkan & memvalidasi keranjang dari `localStorage`, mengembalikan snapshot awal |
| `getMenuList(filters)` | `{ category?: string, search?: string }` | Mengembalikan array menu terfilter (tanpa memodifikasi sumber asli) |
| `getMenuById(menuId)` | `string` | Mengembalikan salinan objek menu atau `null` |
| `getCart()` | - | Mengembalikan array item keranjang: `{ id, nama, kategori, harga, jumlah, stok, subtotal, gambar }` |
| `addToCart(menuId, qty)` | `string`, `number` (default `1`) | Menambah item ke keranjang sambil mengecek batas `stok` simulasi dan menyimpan ke `localStorage` |
| `incrementItem(menuId)` | `string` | Menambah kuantitas item sebesar 1 jika belum melebihi `stok` |
| `decrementItem(menuId)` | `string` | Mengurangi kuantitas sebesar 1; jika kuantitas saat ini `1`, mengembalikan `{ ok: false, code: 'CONFIRM_REMOVE', ... }` tanpa menghapus agar UI menampilkan modal konfirmasi |
| `removeItem(menuId)` | `string` | Menghapus item dari keranjang dan memperbarui `localStorage` |
| `clearCart()` | - | Mengosongkan seluruh isi keranjang dan memperbarui `localStorage` |
| `getTotalPrice()` | - | Mengembalikan angka total pembayaran seluruh item di keranjang |
| `getTotalQuantity()` | - | Mengembalikan total unit kuantitas seluruh produk di keranjang (dasar penghitungan badge keranjang) |
| `checkStock(menuId, requestedQty)` | `string`, `number` | Mengembalikan `{ available: boolean, maxStock: number, currentInCart: number, remaining: number }` |
| `generateOrderNumber()` | - | Menghasilkan string unik format `SSP-YYYYMMDD-XXXX` |
| `createOrder(customerData)` | `{ customerName, tableNumber, orderNote }` | Memvalidasi keranjang non-kosong & stok, mengunci klik ganda sesaat, menyusun ringkasan pesanan, mengosongkan keranjang & `localStorage`, lalu mengembalikan `{ ok: true, data: orderRecord }` |
| `getStateSnapshot()` | - | Mengembalikan `{ menuCount, cart, totalQty, totalPrice, lastOrderNumber, isSimulationData }` |
| `formatRupiah(amount)` | `number` | Mengembalikan format konsisten, mis. `'Rp 45.000'` |
| `saveCartToStorage()` | - | Menyimpan ringkasan `{ id, jumlah }` ke `localStorage` dengan `try/catch` |
| `loadCartFromStorage()` | - | Membaca & menormalkan data `localStorage` secara defensif saat data tidak valid/korup |

---

## 5. Kontrak Kelas Status CSS (`css/style.css` <-> `jQuery`)

Kelas berikut dikelola secara dinamis oleh `js/jquery-interactions.js` dan di-styling di `css/style.css`:
- `.is-active` pada `.btn-filter-category` untuk menandai kategori aktif.
- `.is-hovered` pada `.menu-card` saat event `mouseenter` / `mouseleave`.
- `.is-featured` pada `.menu-card` dan `.is-featured-tag` pada `.menu-tag-badge` untuk menyorot menu andalan (`badgeLabel === 'Andalan'`).
- `.is-at-stock-limit` pada `.menu-card` ketika jumlah di keranjang telah mencapai batas stok simulasi.
- `.is-invalid` & `.is-valid` milik Bootstrap pada input form validasi.
- `.d-none` milik Bootstrap untuk visibilitas alert, loading state, empty state, dan tombol reset.
