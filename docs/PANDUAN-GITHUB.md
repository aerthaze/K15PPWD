# Panduan Kolaborasi GitHub 4 Anggota - Synth & Spice (K15PPWD)

Dokumen ini menjelaskan alur kerja Git dan GitHub untuk seluruh anggota kelompok agar setiap orang dapat mengunggah bagian pekerjaannya ke branch masing-masing secara rapi tanpa saling menimpa kode.

- **Repository Utama**: `https://github.com/aerthaze/K15PPWD.git`
- **Branch Utama (Terintegrasi)**: `main`

---

## 1. Peta Branch Resmi Anggota

| Anggota | NIM | Tanggung Jawab | Branch | File Utama yang Dikelola |
|---|---|---|---|---|
| Chattama Albiantoro | H1101251069 | HTML &amp; Dokumentasi | `feature/html` | `index.html`, `assets/`, `docs/` |
| Muhammad Farras Haidar Revanezka | H1101251035 | CSS | `feature/css` | `css/style.css` |
| Muhammad Hafizh Alfitra | H1101251003 | JavaScript Vanilla | `feature/javascript` | `js/menu-data.js`, `js/script.js` |
| Dimas Lutfi Salim | H1101251004 | jQuery | `feature/jquery` | `js/jquery-interactions.js` |

> **Kebijakan `README.md`**: `README.md` utama hanya berada dan diperbarui di branch `main` (dimasukkan lewat seed awal `github-main-seed`). Branch `feature/*` tidak mengunggah file `README*` agar tidak terjadi duplikasi atau merge conflict saat Pull Request.

Diagram alur branch:

```text
                        main (kode terintegrasi & diuji)
                          |
        +-----------------+-----------------+-----------------+
        |                 |                 |                 |
  feature/html       feature/css   feature/javascript   feature/jquery
        |                 |                 |                 |
        +---- Pull Request + Review + Uji Regresi -> Merge ke main ----+
```

---

## 2. Inisialisasi Awal Jika Repository Masih Kosong

Saat pengecekan awal, repository `https://github.com/aerthaze/K15PPWD.git` masih kosong (belum memiliki commit maupun branch `main`). Oleh karena itu, **pemilik repository** (`aerthaze` / koordinator kelompok) harus membuat **commit awal pada `main`** terlebih dahulu sebelum keempat anggota membuat branch fitur.

Gunakan paket `handover/github-main-seed/` sebagai isi commit pertama pada `main` (berisi `README.md` dasar, `.gitignore`, kerangka folder, `INTEGRATION-CONTRACT.md`, `PEMBAGIAN-TUGAS.md`, dan `PANDUAN-GITHUB.md`):

```bash
git clone https://github.com/aerthaze/K15PPWD.git
cd K15PPWD
git switch -c main
# Salin isi folder handover/github-main-seed/ ke dalam folder K15PPWD/
git add .
git commit -m "chore(init): inisialisasi struktur dasar dan kontrak integrasi proyek K15"
git push -u origin main
```

Setelah branch `main` tersedia di GitHub, barulah setiap anggota membuat branch pekerjaannya masing-masing dari `main`.

---

## 3. Langkah Kerja Setiap Anggota

### A. Clone Repository & Sinkronkan `main`

```bash
git clone https://github.com/aerthaze/K15PPWD.git
cd K15PPWD
git checkout main
git pull origin main
```

### B. Buat Branch Sesuai Pembagian Tugas

Jalankan **hanya satu** perintah sesuai peran Anda:

- **Chattama (`feature/html`)**:
  ```bash
  git switch -c feature/html
  ```
- **Farras (`feature/css`)**:
  ```bash
  git switch -c feature/css
  ```
- **Hafizh (`feature/javascript`)**:
  ```bash
  git switch -c feature/javascript
  ```
- **Dimas (`feature/jquery`)**:
  ```bash
  git switch -c feature/jquery
  ```

### C. Salin File dari Paket Handover & Uji Bagian Sendiri

1. Ekstrak ZIP handover sesuai nama Anda (mis. `handover/02-CSS-Farras.zip`).
2. Salin file kode ke path yang tepat di dalam repo lokal (mis. `css/style.css`). Jangan memasukkan file `README*` ke branch fitur karena `README.md` khusus dikelola di `main`.
3. Uji aplikasi secara lokal dengan membuka `index.html` melalui server lokal (seperti Live Server di VS Code atau `python -m http.server`).

### D. Commit & Push ke Branch Masing-Masing

Contoh untuk masing-masing anggota:

```bash
# Chattama (HTML, aset & docs; README.md tetap hanya di main)
git add index.html assets/ docs/
git commit -m "feat(html): susun struktur semantik, aset lokal, dan modal Bootstrap"
git push -u origin feature/html

# Farras (CSS)
git add css/style.css
git commit -m "feat(css): terapkan tema cyberpunk responsif 375px-1440px"
git push -u origin feature/css

# Hafizh (JavaScript Vanilla)
git add js/menu-data.js js/script.js
git commit -m "feat(js): implementasi data menu, state keranjang, order number, dan localStorage"
git push -u origin feature/javascript

# Dimas (jQuery)
git add js/jquery-interactions.js
git commit -m "feat(jquery): implementasi filter, search, manipulasi DOM, validasi form, dan modal"
git push -u origin feature/jquery
```

---

## 4. Membuat Pull Request, Review & Urutan Merge

1. Buka repository `https://github.com/aerthaze/K15PPWD` di GitHub.
2. Klik **Compare & pull request** pada branch Anda dengan target **`base: main`**.
3. Isi deskripsi PR dengan:
   - Ringkasan perubahan.
   - Daftar file yang diubah (pastikan tidak menyentuh file milik anggota lain tanpa koordinasi).
   - Checklist pengujian mandiri.
4. **Urutan merge yang disarankan** agar pengujian integrasi mulus:
   1. `feature/html` (rangka HTML, aset, dan urutan pemanggilan script).
   2. `feature/css` (styling seluruh komponen dan responsivitas).
   3. `feature/javascript` (data dan API `window.SynthSpiceApp`).
   4. `feature/jquery` (penghubung event dan validasi penuh).
5. Sebelum menekan **Merge pull request**, periksa tab **Files changed** untuk memastikan tidak ada file anggota lain yang ikut terubah atau terhapus.

---

## 5. Menyinkronkan Branch dengan `main` Terbaru

Jika anggota lain baru saja men-merge PR ke `main`, perbarui branch Anda sebelum mengajukan PR atau melanjutkan kerja:

```bash
git checkout main
git pull origin main
git checkout feature/<nama-branch-anda>
git merge main
```

Setelah `git merge main` selesai, jalankan kembali pengujian pada browser untuk memastikan tidak ada regresi.

---

## 6. Panduan Mengatasi Konflik Git & Masalah Integrasi

### Skenario 1: Merge Conflict pada File yang Sama (mis. `README.md` atau `index.html`)
1. Jalankan `git status` untuk melihat file berstatus `both modified`.
2. Buka file tersebut dan cari penanda `<<<<<<< HEAD`, `=======`, `>>>>>>> main`.
3. Gabungkan kedua perubahan sesuai `docs/INTEGRATION-CONTRACT.md`, lalu hapus ketiga baris penanda konflik.
4. Uji ulang halaman di browser, lalu selesaikan merge:
   ```bash
   git add <nama-file>
   git commit -m "fix: selesaikan konflik merge dengan main"
   git push
   ```

### Skenario 2: Perbedaan ID/Class antara HTML, CSS, dan jQuery
- **Gejala**: Tombol tidak merespons klik atau styling tidak muncul setelah merge.
- **Solusi**: Cocokkan seluruh ID dan class terhadap daftar resmi di `docs/INTEGRATION-CONTRACT.md` (mis. `#menu-container`, `#cart-count`, `.btn-filter-category`, `.btn-add-to-cart`, `#checkout-form`).

### Skenario 3: Perubahan Kontrak Fungsi `window.SynthSpiceApp`
- **Gejala**: Muncul error `TypeError: window.SynthSpiceApp.<fungsi> is not a function` di Console browser.
- **Solusi**: Periksa urutan tag `<script>` di `index.html` (`menu-data.js` -> `script.js` -> `jquery-interactions.js`) dan pastikan nama fungsi di `js/script.js` sesuai `docs/INTEGRATION-CONTRACT.md`.

### Skenario 4: Kesalahan Event Handler Ganda di jQuery
- **Gejala**: Satu kali klik "+ Tambah" menambahkan 2 item atau modal terbuka dua kali.
- **Solusi**: Pastikan `js/jquery-interactions.js` hanya dimuat **satu kali** di bagian bawah `index.html` dan jangan mengikat listener baru setiap kali fungsi `renderCartSection()` dipanggil (gunakan event delegation pada `#menu-container` dan `#cart-container`).

---

## 7. Uji Regresi Setelah Seluruh Branch Digabungkan ke `main`

Setelah semua branch (`feature/html`, `feature/css`, `feature/javascript`, `feature/jquery`) tergabung ke `main`:
1. Tarik versi terbaru `main`: `git checkout main && git pull origin main`.
2. Buka proyek lewat server lokal dan buka DevTools Console (pastikan **0 error**).
3. Jalankan seluruh skenario di `docs/TEST-PLAN.md`: filter, search, tambah/ubah/hapus item dengan modal konfirmasi, reload halaman (`localStorage`), validasi form, modal konfirmasi pesanan, serta uji ukuran `375px` hingga `1440px`.
