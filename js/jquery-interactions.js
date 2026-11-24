$(document).ready(function () {
    'use strict';

    if (!window.SynthSpiceApp) {
        return;
    }

    var uiState = {
        activeCategory: 'semua',
        searchQuery: '',
        pendingDeleteAction: null,
        feedbackTimer: null
    };

    var deleteModalEl = document.getElementById('modal-hapus');
    var cartModalEl = document.getElementById('modal-keranjang');
    var reviewModalEl = document.getElementById('modal-ringkasan');
    var orderModalEl = document.getElementById('modal-konfirmasi');

    var deleteModalInstance = deleteModalEl && window.bootstrap ? window.bootstrap.Modal.getOrCreateInstance(deleteModalEl) : null;
    var cartModalInstance = cartModalEl && window.bootstrap ? window.bootstrap.Modal.getOrCreateInstance(cartModalEl) : null;
    var reviewModalInstance = reviewModalEl && window.bootstrap ? window.bootstrap.Modal.getOrCreateInstance(reviewModalEl) : null;
    var orderModalInstance = orderModalEl && window.bootstrap ? window.bootstrap.Modal.getOrCreateInstance(orderModalEl) : null;
    var pendingDeleteModalHide = false;

    if (deleteModalEl) {
        deleteModalEl.addEventListener('shown.bs.modal', function () {
            if (pendingDeleteModalHide && deleteModalInstance) {
                pendingDeleteModalHide = false;
                deleteModalInstance.hide();
            }
        });
    }

    var CATEGORY_LABELS = {
        makanan: 'Makanan',
        minuman: 'Minuman',
        camilan: 'Camilan'
    };

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function formatPlainNumber(amount) {
        var rounded = Math.round(Number(amount) || 0);
        return String(Math.abs(rounded));
    }

    function showFeedbackAlert(message, variant) {
        var alertType = variant || 'info';
        var $alert = $('#alert-notifikasi');

        $alert
            .removeClass('d-none alert-info alert-warning alert-success alert-danger')
            .addClass('alert-' + alertType)
            .text(message);

        if (uiState.feedbackTimer) {
            clearTimeout(uiState.feedbackTimer);
        }

        uiState.feedbackTimer = setTimeout(function () {
            $alert.addClass('d-none');
        }, 4000);
    }

    function buildMenuCardHtml(item) {
        var stockInfo = window.SynthSpiceApp.checkStock(item.id, 1);
        var isMaxed = !stockInfo.available;
        var isFeatured = item.badgeLabel === 'Andalan';
        var formattedPrice = window.SynthSpiceApp.formatRupiah(item.harga);

        return '' +
            '<div class="col-12 col-md-6 col-lg-4 menu-col">' +
                '<article class="card h-100 menu-card' + (isFeatured ? ' is-featured' : '') + (isMaxed ? ' is-at-stock-limit' : '') + '" data-menu-id="' + escapeHtml(item.id) + '">' +
                    '<div class="menu-card-media">' +
                        '<img src="' + escapeHtml(item.gambar) + '" class="card-img-top menu-card-img" width="800" height="600" loading="lazy" alt="' + escapeHtml(item.nama) + '">' +
                    '</div>' +
                    '<div class="card-body d-flex flex-column">' +
                        '<h3 class="card-title menu-card-title h5 mb-2">' + escapeHtml(item.nama) + '</h3>' +
                        '<p class="card-text menu-card-desc mb-3">' + escapeHtml(item.deskripsi) + '</p>' +
                        '<div class="mt-auto">' +
                            '<div class="d-flex justify-content-between align-items-baseline gap-2 mb-2">' +
                                '<span class="menu-price">' + escapeHtml(formattedPrice) + '</span>' +
                                '<span class="menu-stock' + (isMaxed ? ' is-low' : '') + '">Stok: ' + escapeHtml(stockInfo.remaining) + ' porsi</span>' +
                            '</div>' +
                            '<button type="button" class="btn btn-tambah-menu btn-add-to-cart" data-id="' + escapeHtml(item.id) + '"' + (isMaxed ? ' disabled' : '') + '>' +
                                (isMaxed ? 'Batas Stok' : '+ Tambah') +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                '</article>' +
            '</div>';
    }

    function renderMenuGrid() {
        var filteredMenus = window.SynthSpiceApp.getMenuList({
            category: uiState.activeCategory,
            search: uiState.searchQuery
        });

        var $menuContainer = $('#daftar-menu');
        var $emptyState = $('#menu-kosong');

        if (filteredMenus.length === 0) {
            $menuContainer.html('');
            $emptyState.removeClass('d-none');
            return;
        }

        $emptyState.addClass('d-none');

        var html = '';
        if (uiState.activeCategory === 'semua' && uiState.searchQuery.trim() === '') {
            var orderedCategories = ['makanan', 'minuman', 'camilan'];
            for (var c = 0; c < orderedCategories.length; c += 1) {
                var catKey = orderedCategories[c];
                var groupItems = [];
                for (var j = 0; j < filteredMenus.length; j += 1) {
                    if (filteredMenus[j].kategori === catKey) {
                        groupItems.push(filteredMenus[j]);
                    }
                }
                if (groupItems.length > 0) {
                    html += '' +
                        '<div class="col-12">' +
                            '<div class="menu-category-group-header">' +
                                '<h3 class="menu-category-heading">' + escapeHtml(CATEGORY_LABELS[catKey]) + '</h3>' +
                                '<span class="menu-category-line"></span>' +
                            '</div>' +
                        '</div>';
                    for (var k = 0; k < groupItems.length; k += 1) {
                        html += buildMenuCardHtml(groupItems[k]);
                    }
                }
            }
        } else {
            for (var i = 0; i < filteredMenus.length; i += 1) {
                html += buildMenuCardHtml(filteredMenus[i]);
            }
        }

        $menuContainer.html(html);
    }

    function renderCartSection() {
        var snapshot = window.SynthSpiceApp.getStateSnapshot();
        var cartItems = snapshot.cart;
        var totalQty = snapshot.totalQuantity;

        $('#cart-count').text(totalQty);
        $('#badge-keranjang-sidebar').text(totalQty);
        $('#total-item-keranjang').text(totalQty + ' item');
        $('#total-harga-keranjang').text('Rp ' + formatPlainNumber(snapshot.totalPrice));

        // Update data modal keranjang dan ringkasan
        $('#modal-keranjang-qty, #modal-ringkasan-qty').text(totalQty);
        $('#modal-keranjang-total, #modal-ringkasan-total').text(formatPlainNumber(snapshot.totalPrice));

        var $cartContainer = $('#list-keranjang');
        var $cartEmptyState = $('#keranjang-kosong');
        var $cartModalItems = $('#modal-keranjang-list');
        var $cartModalEmpty = $('#modal-keranjang-kosong');
        var $reviewModalItems = $('#modal-ringkasan-list');

        if (cartItems.length === 0) {
            $cartContainer.html('');
            $cartEmptyState.removeClass('d-none');
            $cartModalItems.html('');
            $cartModalEmpty.removeClass('d-none');
            $reviewModalItems.html('');
            $('#btn-kosongkan-keranjang').addClass('d-none');
            return;
        }

        $cartEmptyState.addClass('d-none');
        $cartModalEmpty.addClass('d-none');
        $('#btn-kosongkan-keranjang').removeClass('d-none');
        $('#alert-form-pemesanan').addClass('d-none').text('');

        var sidebarRowsHtml = '';
        var cartModalRowsHtml = '';
        var reviewModalRowsHtml = '';

        for (var i = 0; i < cartItems.length; i += 1) {
            var item = cartItems[i];
            var plainUnit = 'Rp ' + formatPlainNumber(item.harga);
            var reachedMax = item.jumlah >= item.stok;

            // Baris keranjang sidebar
            sidebarRowsHtml += '' +
                '<div class="cart-item-row" data-menu-id="' + escapeHtml(item.id) + '">' +
                    '<div>' +
                        '<h4 class="cart-item-title h6 mb-1">' + escapeHtml(item.nama) + '</h4>' +
                        '<span class="cart-item-unit">' + escapeHtml(plainUnit) + '</span>' +
                    '</div>' +
                    '<div class="d-flex align-items-center gap-2">' +
                        '<div class="qty-control-group" role="group" aria-label="Atur jumlah ' + escapeHtml(item.nama) + '">' +
                            '<button type="button" class="btn btn-sm btn-qty btn-qty-dec" data-id="' + escapeHtml(item.id) + '" aria-label="Kurangi jumlah">-</button>' +
                            '<span class="cart-item-qty">' + escapeHtml(item.jumlah) + '</span>' +
                            '<button type="button" class="btn btn-sm btn-qty btn-qty-inc" data-id="' + escapeHtml(item.id) + '"' + (reachedMax ? ' disabled' : '') + ' aria-label="Tambah jumlah">+</button>' +
                        '</div>' +
                        '<button type="button" class="btn btn-sm btn-trash-item btn-delete-cart-item" data-id="' + escapeHtml(item.id) + '" data-name="' + escapeHtml(item.nama) + '" aria-label="Hapus ' + escapeHtml(item.nama) + ' dari keranjang" title="Hapus item">' +
                            '<img src="assets/icons/trash.svg" width="13" height="13" alt="">' +
                        '</button>' +
                    '</div>' +
                '</div>';

            // Baris modal keranjang
            cartModalRowsHtml += '' +
                '<div class="modal-item-row">' +
                    '<div class="d-flex align-items-center gap-3">' +
                        '<img src="' + escapeHtml(item.gambar) + '" class="modal-item-thumb" alt="' + escapeHtml(item.nama) + '">' +
                        '<div>' +
                            '<div class="modal-item-nama">' + escapeHtml(item.nama) + '</div>' +
                            '<div class="modal-item-harga">' + escapeHtml(plainUnit) + ' per porsi</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="d-flex align-items-center gap-2">' +
                        '<div class="qty-control-group">' +
                            '<button type="button" class="btn btn-sm btn-qty btn-qty-dec" data-id="' + escapeHtml(item.id) + '">-</button>' +
                            '<span class="cart-item-qty">' + escapeHtml(item.jumlah) + '</span>' +
                            '<button type="button" class="btn btn-sm btn-qty btn-qty-inc" data-id="' + escapeHtml(item.id) + '"' + (reachedMax ? ' disabled' : '') + '>+</button>' +
                        '</div>' +
                        '<button type="button" class="btn btn-sm btn-trash-item btn-delete-cart-item" data-id="' + escapeHtml(item.id) + '" data-name="' + escapeHtml(item.nama) + '" aria-label="Hapus item" title="Hapus item">' +
                            '<img src="assets/icons/trash.svg" width="13" height="13" alt="">' +
                        '</button>' +
                    '</div>' +
                '</div>';

            // Baris modal ringkasan
            reviewModalRowsHtml += '' +
                '<div class="modal-item-row">' +
                    '<div class="d-flex align-items-center gap-3">' +
                        '<img src="' + escapeHtml(item.gambar) + '" class="modal-item-thumb" alt="' + escapeHtml(item.nama) + '">' +
                        '<div>' +
                            '<div class="modal-item-nama">' + escapeHtml(item.nama) + '</div>' +
                            '<div class="modal-item-harga">' + escapeHtml(plainUnit) + ' per porsi</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="modal-review-qty">' +
                        '<span>&times;</span>' +
                        '<span class="cart-item-qty">' + escapeHtml(item.jumlah) + '</span>' +
                    '</div>' +
                '</div>';
        }

        $cartContainer.html(sidebarRowsHtml);
        $cartModalItems.html(cartModalRowsHtml);
        $reviewModalItems.html(reviewModalRowsHtml);
    }

    function refreshAllViews() {
        renderMenuGrid();
        renderCartSection();
    }

    function openDeleteConfirmModal(action) {
        uiState.pendingDeleteAction = action;
        $('#pesan-modal-hapus').text('Anda yakin ingin menghapus menu berikut dari keranjang?');
        $('#nama-item-hapus').text(action.nama || action.id);

        if (deleteModalInstance) {
            deleteModalInstance.show();
        }
    }

    function setFieldError($input, $feedback, message) {
        $input.removeClass('is-valid').addClass('is-invalid');
        $feedback.text(message);
    }

    function clearFieldError($input, $feedback, markValid) {
        $input.removeClass('is-invalid');
        $feedback.text('');
        if (markValid) {
            $input.addClass('is-valid');
        } else {
            $input.removeClass('is-valid');
        }
    }

    function validateCustomerName() {
        var $input = $('#nama-pelanggan');
        var $feedback = $('#error-nama-pelanggan');
        var rawValue = String($input.val() || '').trim();

        if (rawValue.length === 0) {
            setFieldError($input, $feedback, 'Nama pelanggan wajib diisi.');
            return false;
        }
        if (rawValue.length < 2) {
            setFieldError($input, $feedback, 'Nama pelanggan minimal 2 karakter.');
            return false;
        }
        if (!/[A-Za-zÀ-ÿ]/.test(rawValue)) {
            setFieldError($input, $feedback, 'Nama pelanggan harus mengandung huruf.');
            return false;
        }

        clearFieldError($input, $feedback, true);
        return true;
    }

    function validateTableNumber() {
        var $input = $('#nomor-meja');
        var $feedback = $('#error-nomor-meja');
        var rawValue = String($input.val() || '').trim();

        if (rawValue.length === 0) {
            setFieldError($input, $feedback, 'Nomor meja wajib diisi.');
            return false;
        }

        if (!/^[A-Za-z]?[0-9]{1,2}$/.test(rawValue)) {
            setFieldError($input, $feedback, 'Format nomor meja tidak valid. Gunakan angka 1-99 atau kode seperti A5.');
            return false;
        }

        var numericPart = parseInt(rawValue.replace(/^[A-Za-z]/, ''), 10);
        if (isNaN(numericPart) || numericPart < 1 || numericPart > 99) {
            setFieldError($input, $feedback, 'Nomor meja harus bernilai antara 1 sampai 99.');
            return false;
        }

        clearFieldError($input, $feedback, true);
        return true;
    }

    function validateOrderNote() {
        var $input = $('#catatan-pesanan');
        var $feedback = $('#error-catatan-pesanan');
        var rawValue = String($input.val() || '');

        if (rawValue.length > 150) {
            setFieldError($input, $feedback, 'Catatan maksimal 150 karakter.');
            return false;
        }

        clearFieldError($input, $feedback, rawValue.trim().length > 0);
        return true;
    }

    // Buka modal keranjang
    $('#btn-keranjang').on('click', function (e) {
        e.preventDefault();
        if (cartModalInstance) {
            cartModalInstance.show();
        }
    });

    function updateReviewModalInfo() {
        var note = String($('#catatan-pesanan').val() || '').trim();
        var now = new Date();
        var dd = String(now.getDate()).padStart(2, '0');
        var mm = String(now.getMonth() + 1).padStart(2, '0');
        var yyyy = now.getFullYear();
        var hh = String(now.getHours()).padStart(2, '0');
        var min = String(now.getMinutes()).padStart(2, '0');
        var timeStr = dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + min + ' WIB';

        $('#modal-ringkasan-waktu').text(timeStr);
        $('#modal-ringkasan-catatan').text(note || '-');
    }

    function switchModal(fromEl, fromInstance, toInstance) {
        if (!fromEl || !fromInstance || !fromEl.classList.contains('show')) {
            if (toInstance) {
                toInstance.show();
            }
            return;
        }
        fromEl.addEventListener('hidden.bs.modal', function () {
            if (toInstance) {
                toInstance.show();
            }
        }, { once: true });
        if (fromInstance._isTransitioning) {
            fromEl.addEventListener('shown.bs.modal', function () {
                fromInstance.hide();
            }, { once: true });
        } else {
            fromInstance.hide();
        }
    }

    // Tinjau pesanan
    $('#btn-tinjau-pesanan').on('click', function () {
        if (window.SynthSpiceApp.getCart().length === 0) {
            return;
        }
        updateReviewModalInfo();
        switchModal(cartModalEl, cartModalInstance, reviewModalInstance);
    });

    // Kembali ke modal keranjang
    $('#btn-ubah-pesanan').on('click', function () {
        switchModal(reviewModalEl, reviewModalInstance, cartModalInstance);
    });

    // Konfirmasi pesanan
    $('#btn-konfirmasi-pesanan').on('click', function () {
        var customerName = String($('#nama-pelanggan').val() || '').trim() || 'Pelanggan Meja';
        var tableNumber = String($('#nomor-meja').val() || '').trim() || '1';
        var orderNote = String($('#catatan-pesanan').val() || '').trim();

        var orderResult = window.SynthSpiceApp.createOrder({
            customerName: customerName,
            tableNumber: tableNumber,
            orderNote: orderNote
        });

        if (!orderResult.ok) {
            showFeedbackAlert(orderResult.message, 'warning');
            return;
        }

        // Tampilkan detail pesanan di modal konfirmasi
        $('#nomor-pesanan-sukses').text(orderResult.data.orderNumber);
        $('#waktu-pesanan-sukses').text(orderResult.data.createdAt);
        $('#pemesan-pesanan-sukses').text(customerName + ' (Meja ' + tableNumber + ')');
        $('#catatan-pesanan-sukses').text(orderResult.data.orderNote);
        $('#total-pesanan-sukses').text(orderResult.data.totalPriceFormatted);

        // Render rincian apa yang dipesan
        var itemsHtml = '';
        var items = orderResult.data.items || [];
        for (var i = 0; i < items.length; i += 1) {
            var it = items[i];
            itemsHtml += '<div class="receipt-item-row">' +
                '<span>' + escapeHtml(it.nama) + ' &times; ' + escapeHtml(it.jumlah) + '</span>' +
                '<span class="text-secondary">' + escapeHtml(window.SynthSpiceApp.formatRupiah(it.subtotal)) + '</span>' +
            '</div>';
        }
        $('#item-pesanan-sukses').html(itemsHtml);

        var formEl = document.getElementById('form-pemesanan');
        if (formEl) {
            formEl.reset();
        }
        $('#nama-pelanggan, #nomor-meja, #catatan-pesanan').removeClass('is-valid is-invalid');
        $('#error-nama-pelanggan, #error-nomor-meja, #error-catatan-pesanan').text('');

        refreshAllViews();
        switchModal(reviewModalEl, reviewModalInstance, orderModalInstance);
    });

    $('#filter-kategori').on('click', '.btn-filter-category', function () {
        var $clicked = $(this);
        uiState.activeCategory = String($clicked.data('category') || 'semua');

        $('#filter-kategori .btn-filter-category')
            .removeClass('is-active')
            .attr('aria-pressed', 'false');
        $clicked
            .addClass('is-active')
            .attr('aria-pressed', 'true');

        renderMenuGrid();
    });

    $('#search-menu').on('input', function () {
        var query = String($(this).val() || '');
        uiState.searchQuery = query;
        $('#btn-clear-search').toggleClass('d-none', query.trim() === '');
        renderMenuGrid();
    });

    $('#btn-clear-search').on('click', function () {
        $('#search-menu').val('');
        uiState.searchQuery = '';
        $(this).addClass('d-none');
        renderMenuGrid();
        $('#search-menu').trigger('focus');
    });

    $('#btn-reset-filter').on('click', function () {
        uiState.activeCategory = 'semua';
        uiState.searchQuery = '';
        $('#search-menu').val('');
        $('#btn-clear-search').addClass('d-none');
        $('#filter-kategori .btn-filter-category')
            .removeClass('is-active')
            .attr('aria-pressed', 'false')
            .filter('[data-category="semua"]')
            .addClass('is-active')
            .attr('aria-pressed', 'true');
        renderMenuGrid();
    });

    $('#daftar-menu').on('mouseenter', '.menu-card', function () {
        $(this).addClass('is-hovered');
    }).on('mouseleave', '.menu-card', function () {
        $(this).removeClass('is-hovered');
    });

    $('#daftar-menu').on('click', '.btn-add-to-cart', function () {
        var menuId = String($(this).data('id') || '');
        var result = window.SynthSpiceApp.addToCart(menuId, 1);

        if (!result.ok) {
            showFeedbackAlert(result.message, 'warning');
            return;
        }

        refreshAllViews();
    });

    // Tombol tambah dan kurang kuantitas
    $(document).on('click', '.btn-qty-inc', function () {
        var menuId = String($(this).data('id') || '');
        var result = window.SynthSpiceApp.incrementItem(menuId);
        if (!result.ok) {
            showFeedbackAlert(result.message, 'warning');
            return;
        }
        refreshAllViews();
    });

    $(document).on('click', '.btn-qty-dec', function () {
        var menuId = String($(this).data('id') || '');
        var result = window.SynthSpiceApp.decrementItem(menuId);

        if (!result.ok && result.code === 'CONFIRM_REMOVE') {
            openDeleteConfirmModal({
                type: 'item',
                id: result.data.id,
                nama: result.data.nama
            });
            return;
        }

        if (result.ok) {
            refreshAllViews();
        }
    });

    // Tombol hapus item dari keranjang dengan modal konfirmasi
    $(document).on('click', '.btn-delete-cart-item', function () {
        var menuId = String($(this).data('id') || '');
        var menuName = String($(this).data('name') || '');
        openDeleteConfirmModal({
            type: 'item',
            id: menuId,
            nama: menuName
        });
    });

    // Tombol kosongkan keranjang di header sidebar
    $('#btn-kosongkan-keranjang').on('click', function () {
        if (window.SynthSpiceApp.getCart().length === 0) {
            return;
        }
        openDeleteConfirmModal({
            type: 'all',
            id: 'ALL',
            nama: 'Semua item di keranjang'
        });
    });

    $('#btn-ya-hapus').on('click', function () {
        if (!uiState.pendingDeleteAction) {
            return;
        }

        var action = uiState.pendingDeleteAction;
        uiState.pendingDeleteAction = null;

        if (action.type === 'all') {
            window.SynthSpiceApp.clearCart();
        } else {
            window.SynthSpiceApp.removeItem(action.id);
        }

        if (deleteModalInstance) {
            if (deleteModalEl && deleteModalEl.classList.contains('show')) {
                deleteModalInstance.hide();
            } else {
                pendingDeleteModalHide = true;
            }
        }

        refreshAllViews();
    });

    if (deleteModalEl) {
        deleteModalEl.addEventListener('hidden.bs.modal', function () {
            uiState.pendingDeleteAction = null;
        });
    }

    $('#nama-pelanggan').on('blur', function () {
        validateCustomerName();
    }).on('input', function () {
        $('#alert-form-pemesanan').addClass('d-none').text('');
        if ($(this).hasClass('is-invalid') || String($(this).val() || '').trim().length >= 2) {
            validateCustomerName();
        }
    });

    $('#nomor-meja').on('blur', function () {
        validateTableNumber();
    }).on('input', function () {
        $('#alert-form-pemesanan').addClass('d-none').text('');
        if ($(this).hasClass('is-invalid') || String($(this).val() || '').trim().length >= 1) {
            validateTableNumber();
        }
    });

    $('#catatan-pesanan').on('input', function () {
        validateOrderNote();
    });

    // Validasi dan submit form pemesanan
    $('#form-pemesanan').on('submit', function (event) {
        event.preventDefault();

        var $formAlert = $('#alert-form-pemesanan');
        if (window.SynthSpiceApp.getCart().length === 0) {
            $formAlert
                .removeClass('d-none')
                .text('Keranjang masih kosong. Tambahkan minimal satu menu terlebih dahulu.');
            return;
        }

        var isNameValid = validateCustomerName();
        var isTableValid = validateTableNumber();
        var isNoteValid = validateOrderNote();

        if (!isNameValid || !isTableValid || !isNoteValid) {
            $formAlert
                .removeClass('d-none')
                .text('Periksa kembali data pelanggan yang masih bertanda merah.');
            return;
        }

        $formAlert.addClass('d-none').text('');
        updateReviewModalInfo();
        if (reviewModalInstance) {
            reviewModalInstance.show();
        }
    });

    window.SynthSpiceApp.init();
    $('#loading-menu').addClass('d-none');
    refreshAllViews();
});
