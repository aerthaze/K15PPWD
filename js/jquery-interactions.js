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

    var deleteModalEl = document.getElementById('delete-confirm-modal');
    var orderModalEl = document.getElementById('order-confirmation-modal');
    var deleteModalInstance = deleteModalEl && window.bootstrap ? window.bootstrap.Modal.getOrCreateInstance(deleteModalEl) : null;
    var orderModalInstance = orderModalEl && window.bootstrap ? window.bootstrap.Modal.getOrCreateInstance(orderModalEl) : null;
    var pendingDeleteModalHide = false;

    // Menangani kondisi ketika tombol hapus modal ditekan saat animasi buka Bootstrap masih berjalan.
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

    // Lindungi karakter HTML sebelum string disisipkan lewat .html().
    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function showFeedbackAlert(message, variant) {
        var alertType = variant || 'info';
        var $alert = $('#app-feedback-alert');

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

    function renderMenuGrid() {
        var filteredMenus = window.SynthSpiceApp.getMenuList({
            category: uiState.activeCategory,
            search: uiState.searchQuery
        });

        var totalMenus = window.SynthSpiceApp.getMenuList({ category: 'semua', search: '' }).length;
        var $menuContainer = $('#menu-container');
        var $emptyState = $('#menu-empty-state');
        var $resultInfo = $('#menu-result-info');

        if (uiState.searchQuery.trim() !== '') {
            $resultInfo.text('Menampilkan ' + filteredMenus.length + ' dari ' + totalMenus + ' menu untuk "' + uiState.searchQuery.trim() + '"');
        } else if (uiState.activeCategory !== 'semua') {
            $resultInfo.text('Menampilkan ' + filteredMenus.length + ' menu kategori ' + (CATEGORY_LABELS[uiState.activeCategory] || uiState.activeCategory));
        } else {
            $resultInfo.text('Menampilkan semua ' + filteredMenus.length + ' menu simulasi');
        }

        if (filteredMenus.length === 0) {
            $menuContainer.html('');
            $emptyState.removeClass('d-none');
            return;
        }

        $emptyState.addClass('d-none');

        var cardsHtml = '';
        for (var i = 0; i < filteredMenus.length; i += 1) {
            var item = filteredMenus[i];
            var stockInfo = window.SynthSpiceApp.checkStock(item.id, 1);
            var isMaxed = !stockInfo.available;
            var isFeatured = item.badgeLabel === 'Andalan';
            var categoryLabel = CATEGORY_LABELS[item.kategori] || item.kategori;
            var formattedPrice = window.SynthSpiceApp.formatRupiah(item.harga);
            var stockText = isMaxed
                ? 'Maksimal di keranjang (' + item.stok + ')'
                : 'Stok simulasi: ' + stockInfo.remaining + ' porsi';

            cardsHtml += '' +
                '<div class="col-12 col-md-6 col-lg-4 menu-col">' +
                    '<article class="card h-100 menu-card' + (isFeatured ? ' is-featured' : '') + (isMaxed ? ' is-at-stock-limit' : '') + '" data-menu-id="' + escapeHtml(item.id) + '">' +
                        '<div class="menu-card-media">' +
                            '<img src="' + escapeHtml(item.gambar) + '" class="card-img-top menu-card-img" width="800" height="600" loading="lazy" alt="' + escapeHtml(item.nama) + '">' +
                            '<span class="badge menu-category-badge">' + escapeHtml(categoryLabel) + '</span>' +
                        '</div>' +
                        '<div class="card-body d-flex flex-column">' +
                            '<div class="d-flex justify-content-between align-items-start gap-2 mb-2">' +
                                '<h3 class="card-title menu-card-title h5 mb-0">' + escapeHtml(item.nama) + '</h3>' +
                                '<span class="badge menu-tag-badge' + (isFeatured ? ' is-featured-tag' : '') + '">' + escapeHtml(item.badgeLabel) + '</span>' +
                            '</div>' +
                            '<p class="card-text menu-card-desc mb-3">' + escapeHtml(item.deskripsi) + '</p>' +
                            '<div class="mt-auto pt-2 border-top synth-card-divider">' +
                                '<div class="d-flex justify-content-between align-items-center mb-2">' +
                                    '<span class="menu-price">' + escapeHtml(formattedPrice) + '</span>' +
                                    '<span class="menu-stock-text' + (isMaxed ? ' is-limit' : '') + '">' + escapeHtml(stockText) + '</span>' +
                                '</div>' +
                                '<button type="button" class="btn synth-btn-add w-100 btn-add-to-cart" data-id="' + escapeHtml(item.id) + '"' + (isMaxed ? ' disabled' : '') + '>' +
                                    (isMaxed ? 'Batas Stok Tercapai' : '+ Tambah ke Keranjang') +
                                '</button>' +
                            '</div>' +
                        '</div>' +
                    '</article>' +
                '</div>';
        }

        $menuContainer.html(cardsHtml);
    }

    function renderCartSection() {
        var snapshot = window.SynthSpiceApp.getStateSnapshot();
        var cartItems = snapshot.cart;
        var totalQty = snapshot.totalQuantity;

        $('#cart-count').text(totalQty);
        $('#cart-sidebar-badge').text(totalQty + ' item');
        $('#cart-total-qty').text(totalQty + ' item');
        $('#cart-total').text(snapshot.totalPriceFormatted);

        var $cartContainer = $('#cart-container');
        var $cartEmptyState = $('#cart-empty-state');
        var $clearCartBtn = $('#clear-cart-btn');

        if (cartItems.length === 0) {
            $cartContainer.html('');
            $cartEmptyState.removeClass('d-none');
            $clearCartBtn.addClass('d-none');
            return;
        }

        $cartEmptyState.addClass('d-none');
        $clearCartBtn.removeClass('d-none');
        $('#checkout-form-alert').addClass('d-none').text('');

        var rowsHtml = '';
        for (var i = 0; i < cartItems.length; i += 1) {
            var item = cartItems[i];
            var unitPriceText = window.SynthSpiceApp.formatRupiah(item.harga);
            var subtotalText = window.SynthSpiceApp.formatRupiah(item.subtotal);
            var reachedMax = item.jumlah >= item.stok;

            rowsHtml += '' +
                '<div class="cart-item-row" data-menu-id="' + escapeHtml(item.id) + '">' +
                    '<div class="d-flex justify-content-between align-items-start gap-2 mb-2">' +
                        '<div>' +
                            '<h4 class="cart-item-title h6 mb-1">' + escapeHtml(item.nama) + '</h4>' +
                            '<span class="cart-item-unit">' + escapeHtml(unitPriceText) + ' / porsi</span>' +
                        '</div>' +
                        '<button type="button" class="btn btn-sm synth-btn-remove btn-remove-item" data-id="' + escapeHtml(item.id) + '" aria-label="Hapus ' + escapeHtml(item.nama) + '">Hapus</button>' +
                    '</div>' +
                    '<div class="d-flex justify-content-between align-items-center gap-2">' +
                        '<div class="qty-control-group" role="group" aria-label="Atur jumlah ' + escapeHtml(item.nama) + '">' +
                            '<button type="button" class="btn btn-sm synth-qty-btn btn-qty-dec" data-id="' + escapeHtml(item.id) + '" aria-label="Kurangi jumlah ' + escapeHtml(item.nama) + '">-</button>' +
                            '<span class="cart-item-qty" aria-live="polite">' + escapeHtml(item.jumlah) + '</span>' +
                            '<button type="button" class="btn btn-sm synth-qty-btn btn-qty-inc" data-id="' + escapeHtml(item.id) + '" aria-label="Tambah jumlah ' + escapeHtml(item.nama) + '"' + (reachedMax ? ' disabled' : '') + '>+</button>' +
                        '</div>' +
                        '<span class="cart-item-subtotal">' + escapeHtml(subtotalText) + '</span>' +
                    '</div>' +
                '</div>';
        }

        $cartContainer.html(rowsHtml);
    }

    function refreshAllViews() {
        renderMenuGrid();
        renderCartSection();
    }

    function openDeleteConfirmModal(action) {
        uiState.pendingDeleteAction = action;
        var $message = $('#delete-modal-message');
        var $targetName = $('#delete-item-name');

        if (action.type === 'clear') {
            $message.text('Anda yakin ingin mengosongkan seluruh pesanan dari keranjang?');
            $targetName.text('Semua item di keranjang');
        } else {
            $message.text('Anda yakin ingin menghapus menu berikut dari keranjang?');
            $targetName.text(action.nama || action.id);
        }

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
        var $input = $('#customer-name');
        var $feedback = $('#customer-name-error');
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

    // Terima angka meja 1-99 atau kode satu huruf diikuti angka (mis. A5), tolak angka 0/00.
    function validateTableNumber() {
        var $input = $('#table-number');
        var $feedback = $('#table-number-error');
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
        var $input = $('#order-note');
        var $feedback = $('#order-note-error');
        var rawValue = String($input.val() || '');

        if (rawValue.length > 150) {
            setFieldError($input, $feedback, 'Catatan maksimal 150 karakter.');
            return false;
        }

        clearFieldError($input, $feedback, rawValue.trim().length > 0);
        return true;
    }

    function showOrderConfirmationModal(orderRecord) {
        $('#modal-order-number').text(orderRecord.orderNumber);
        $('#modal-order-time').text(orderRecord.createdAt);
        $('#modal-customer-name').text(orderRecord.customerName);
        $('#modal-table-number').text(orderRecord.tableNumber);
        $('#modal-order-note').text(orderRecord.orderNote);
        $('#modal-order-total').text(orderRecord.totalPriceFormatted);

        var rowsHtml = '';
        for (var i = 0; i < orderRecord.items.length; i += 1) {
            var item = orderRecord.items[i];
            rowsHtml += '' +
                '<tr>' +
                    '<td>' + escapeHtml(item.nama) + '</td>' +
                    '<td class="text-center">' + escapeHtml(item.jumlah) + '</td>' +
                    '<td class="text-end">' + escapeHtml(window.SynthSpiceApp.formatRupiah(item.subtotal)) + '</td>' +
                '</tr>';
        }
        $('#modal-order-items').html(rowsHtml);

        if (orderModalInstance) {
            orderModalInstance.show();
        }
    }

    $('#category-filter').on('click', '.btn-filter-category', function () {
        var $clicked = $(this);
        var selectedCategory = String($clicked.data('category') || 'semua');

        uiState.activeCategory = selectedCategory;
        $('#category-filter .btn-filter-category')
            .removeClass('is-active')
            .attr('aria-pressed', 'false');
        $clicked
            .addClass('is-active')
            .attr('aria-pressed', 'true');

        renderMenuGrid();
    });

    $('#menu-search').on('input', function () {
        var query = String($(this).val() || '');
        uiState.searchQuery = query;
        $('#clear-search-btn').toggleClass('d-none', query.trim() === '');
        renderMenuGrid();
    });

    $('#clear-search-btn').on('click', function () {
        $('#menu-search').val('');
        uiState.searchQuery = '';
        $(this).addClass('d-none');
        renderMenuGrid();
        $('#menu-search').trigger('focus');
    });

    $('#reset-filter-btn').on('click', function () {
        uiState.activeCategory = 'semua';
        uiState.searchQuery = '';
        $('#menu-search').val('');
        $('#clear-search-btn').addClass('d-none');
        $('#category-filter .btn-filter-category')
            .removeClass('is-active')
            .attr('aria-pressed', 'false')
            .filter('[data-category="semua"]')
            .addClass('is-active')
            .attr('aria-pressed', 'true');
        renderMenuGrid();
    });

    $('#menu-container').on('mouseenter', '.menu-card', function () {
        $(this).addClass('is-hovered');
    }).on('mouseleave', '.menu-card', function () {
        $(this).removeClass('is-hovered');
    });

    // Pakai event delegation agar tombol pada card maupun baris keranjang hasil render ulang tetap merespons.
    $('#menu-container').on('click', '.btn-add-to-cart', function () {
        var menuId = String($(this).data('id') || '');
        var result = window.SynthSpiceApp.addToCart(menuId, 1);

        if (!result.ok) {
            showFeedbackAlert(result.message, 'warning');
            return;
        }

        refreshAllViews();
        showFeedbackAlert(result.message, 'success');
    });

    $('#cart-container').on('click', '.btn-qty-inc', function () {
        var menuId = String($(this).data('id') || '');
        var result = window.SynthSpiceApp.incrementItem(menuId);
        if (!result.ok) {
            showFeedbackAlert(result.message, 'warning');
            return;
        }
        refreshAllViews();
    });

    $('#cart-container').on('click', '.btn-qty-dec', function () {
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

    $('#cart-container').on('click', '.btn-remove-item', function () {
        var menuId = String($(this).data('id') || '');
        var menu = window.SynthSpiceApp.getMenuById(menuId);
        openDeleteConfirmModal({
            type: 'item',
            id: menuId,
            nama: menu ? menu.nama : menuId
        });
    });

    $('#clear-cart-btn').on('click', function () {
        openDeleteConfirmModal({ type: 'clear' });
    });

    $('#confirm-delete-btn').on('click', function () {
        if (!uiState.pendingDeleteAction) {
            return;
        }

        var action = uiState.pendingDeleteAction;
        uiState.pendingDeleteAction = null;

        var result = action.type === 'clear'
            ? window.SynthSpiceApp.clearCart()
            : window.SynthSpiceApp.removeItem(action.id);

        if (deleteModalInstance) {
            if (deleteModalEl && deleteModalEl.classList.contains('show')) {
                deleteModalInstance.hide();
            } else {
                pendingDeleteModalHide = true;
            }
        }

        refreshAllViews();
        if (result.ok) {
            showFeedbackAlert(result.message, 'info');
        }
    });

    if (deleteModalEl) {
        deleteModalEl.addEventListener('hidden.bs.modal', function () {
            uiState.pendingDeleteAction = null;
        });
    }

    $('#customer-name').on('blur', function () {
        validateCustomerName();
    }).on('input', function () {
        $('#checkout-form-alert').addClass('d-none').text('');
        if ($(this).hasClass('is-invalid') || String($(this).val() || '').trim().length >= 2) {
            validateCustomerName();
        }
    });

    $('#table-number').on('blur', function () {
        validateTableNumber();
    }).on('input', function () {
        $('#checkout-form-alert').addClass('d-none').text('');
        if ($(this).hasClass('is-invalid') || String($(this).val() || '').trim().length >= 1) {
            validateTableNumber();
        }
    });

    $('#order-note').on('input', function () {
        validateOrderNote();
    });

    $('#checkout-form').on('submit', function (event) {
        event.preventDefault();

        var $submitBtn = $('#submit-order-btn');
        var $formAlert = $('#checkout-form-alert');

        var currentCart = window.SynthSpiceApp.getCart();
        if (currentCart.length === 0) {
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
        $submitBtn.prop('disabled', true).text('Memproses Pesanan...');

        var orderResult = window.SynthSpiceApp.createOrder({
            customerName: String($('#customer-name').val() || ''),
            tableNumber: String($('#table-number').val() || ''),
            orderNote: String($('#order-note').val() || '')
        });

        if (!orderResult.ok) {
            $formAlert.removeClass('d-none').text(orderResult.message);
            $submitBtn.prop('disabled', false).text('Konfirmasi Pesanan');
            return;
        }

        showOrderConfirmationModal(orderResult.data);

        this.reset();
        $('#customer-name, #table-number, #order-note').removeClass('is-valid is-invalid');
        $('#customer-name-error, #table-number-error, #order-note-error').text('');

        refreshAllViews();
        showFeedbackAlert('Pesanan simulasi ' + orderResult.data.orderNumber + ' berhasil dibuat.', 'success');
        $submitBtn.prop('disabled', false).text('Konfirmasi Pesanan');
    });

    var initialSnapshot = window.SynthSpiceApp.init();
    $('#menu-loading-state').addClass('d-none');
    refreshAllViews();

    if (initialSnapshot.hadInvalidStorage) {
        showFeedbackAlert('Sebagian data keranjang tersimpan yang tidak valid telah dibersihkan otomatis.', 'warning');
    }
});
