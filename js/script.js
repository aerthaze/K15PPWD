(function (global) {
    'use strict';

    var state = {
        initialized: false,
        menuItems: [],
        cartItems: [],
        orderSequence: 0,
        lastOrderNumber: null,
        isCreatingOrder: false
    };

    function getConfig() {
        return global.SYNTH_SPICE_CONFIG || {
            restaurantName: 'Synth & Spice',
            storageKey: 'synth_spice_cart_v1',
            orderPrefix: 'SSP',
            isSimulationData: true
        };
    }

    // Duplikasi data menu
    function cloneMenuItem(item) {
        return {
            id: item.id,
            nama: item.nama,
            kategori: item.kategori,
            harga: Number(item.harga),
            deskripsi: item.deskripsi,
            stok: Number(item.stok),
            gambar: item.gambar,
            badgeLabel: item.badgeLabel || ''
        };
    }

    function findRawMenu(menuId) {
        if (typeof menuId !== 'string' || !menuId.trim()) {
            return null;
        }
        for (var i = 0; i < state.menuItems.length; i += 1) {
            if (state.menuItems[i].id === menuId) {
                return state.menuItems[i];
            }
        }
        return null;
    }

    function findCartEntry(menuId) {
        for (var i = 0; i < state.cartItems.length; i += 1) {
            if (state.cartItems[i].id === menuId) {
                return state.cartItems[i];
            }
        }
        return null;
    }

    // Format angka ke format mata uang Rupiah
    function formatRupiah(amount) {
        var numeric = Number(amount);
        if (!isFinite(numeric) || isNaN(numeric)) {
            numeric = 0;
        }
        var rounded = Math.round(numeric);
        var sign = rounded < 0 ? '-' : '';
        var formattedDigits = String(Math.abs(rounded)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return sign + 'Rp ' + formattedDigits;
    }

    // Simpan data keranjang ke localStorage
    function saveCartToStorage() {
        var config = getConfig();
        try {
            if (!global.localStorage) {
                return false;
            }
            var compactCart = [];
            for (var i = 0; i < state.cartItems.length; i += 1) {
                compactCart.push({
                    id: state.cartItems[i].id,
                    jumlah: state.cartItems[i].jumlah
                });
            }
            global.localStorage.setItem(config.storageKey, JSON.stringify(compactCart));
            return true;
        } catch (err) {
            return false;
        }
    }

    // Ambil data keranjang dari localStorage
    function loadCartFromStorage() {
        var config = getConfig();
        var hadInvalidData = false;
        state.cartItems = [];

        try {
            if (!global.localStorage) {
                return { restoredCount: 0, hadInvalidData: false };
            }
            var raw = global.localStorage.getItem(config.storageKey);
            if (!raw) {
                return { restoredCount: 0, hadInvalidData: false };
            }

            var parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) {
                global.localStorage.removeItem(config.storageKey);
                return { restoredCount: 0, hadInvalidData: true };
            }

            var seenIds = {};
            for (var i = 0; i < parsed.length; i += 1) {
                var entry = parsed[i];
                if (!entry || typeof entry.id !== 'string' || seenIds[entry.id]) {
                    hadInvalidData = true;
                    continue;
                }

                var menu = findRawMenu(entry.id);
                var qty = Math.floor(Number(entry.jumlah));
                if (!menu || menu.stok <= 0 || !isFinite(qty) || qty <= 0) {
                    hadInvalidData = true;
                    continue;
                }

                if (qty > menu.stok) {
                    qty = menu.stok;
                    hadInvalidData = true;
                }

                seenIds[entry.id] = true;
                state.cartItems.push({
                    id: menu.id,
                    jumlah: qty
                });
            }

            if (hadInvalidData) {
                saveCartToStorage();
            }

            return {
                restoredCount: state.cartItems.length,
                hadInvalidData: hadInvalidData
            };
        } catch (err) {
            try {
                if (global.localStorage) {
                    global.localStorage.removeItem(config.storageKey);
                }
            } catch (cleanupErr) {
            }
            state.cartItems = [];
            return { restoredCount: 0, hadInvalidData: true };
        }
    }

    function init() {
        var sourceMenu = Array.isArray(global.SYNTH_SPICE_MENU) ? global.SYNTH_SPICE_MENU : [];
        state.menuItems = [];

        for (var i = 0; i < sourceMenu.length; i += 1) {
            state.menuItems.push(cloneMenuItem(sourceMenu[i]));
        }

        var recovery = loadCartFromStorage();
        state.initialized = true;

        var snapshot = getStateSnapshot();
        snapshot.hadInvalidStorage = recovery.hadInvalidData;
        return snapshot;
    }

    function getMenuList(filters) {
        var opts = filters || {};
        var category = typeof opts.category === 'string' ? opts.category.trim().toLowerCase() : 'semua';
        var search = typeof opts.search === 'string' ? opts.search.trim().toLowerCase() : '';
        var results = [];

        for (var i = 0; i < state.menuItems.length; i += 1) {
            var item = state.menuItems[i];
            var matchCategory = (category === '' || category === 'semua') || item.kategori.toLowerCase() === category;
            var matchSearch = search === '' || item.nama.toLowerCase().indexOf(search) !== -1;

            if (matchCategory && matchSearch) {
                results.push(cloneMenuItem(item));
            }
        }

        return results;
    }

    function getMenuById(menuId) {
        var menu = findRawMenu(menuId);
        return menu ? cloneMenuItem(menu) : null;
    }

    function checkStock(menuId, requestedQty) {
        var menu = findRawMenu(menuId);
        var additional = typeof requestedQty === 'number' ? Math.floor(requestedQty) : 1;
        if (!menu) {
            return {
                exists: false,
                available: false,
                maxStock: 0,
                currentInCart: 0,
                remaining: 0
            };
        }

        var entry = findCartEntry(menuId);
        var currentQty = entry ? entry.jumlah : 0;
        var remaining = Math.max(0, menu.stok - currentQty);
        var isAvailable = additional > 0 && (currentQty + additional) <= menu.stok;

        return {
            exists: true,
            available: isAvailable,
            maxStock: menu.stok,
            currentInCart: currentQty,
            remaining: remaining
        };
    }

    function getCart() {
        var detailedCart = [];
        for (var i = 0; i < state.cartItems.length; i += 1) {
            var entry = state.cartItems[i];
            var menu = findRawMenu(entry.id);
            if (!menu) {
                continue;
            }
            detailedCart.push({
                id: menu.id,
                nama: menu.nama,
                kategori: menu.kategori,
                harga: menu.harga,
                jumlah: entry.jumlah,
                stok: menu.stok,
                gambar: menu.gambar,
                subtotal: menu.harga * entry.jumlah
            });
        }
        return detailedCart;
    }

    function getTotalPrice() {
        var total = 0;
        var cart = getCart();
        for (var i = 0; i < cart.length; i += 1) {
            total += cart[i].subtotal;
        }
        return total;
    }

    // Hitung total kuantitas item di keranjang
    function getTotalQuantity() {
        var qtyTotal = 0;
        for (var i = 0; i < state.cartItems.length; i += 1) {
            qtyTotal += state.cartItems[i].jumlah;
        }
        return qtyTotal;
    }

    function addToCart(menuId, qty) {
        var amount = typeof qty === 'number' ? Math.floor(qty) : 1;
        if (!isFinite(amount) || amount <= 0) {
            return {
                ok: false,
                code: 'INVALID_QTY',
                message: 'Jumlah pesanan harus lebih dari nol.'
            };
        }

        var menu = findRawMenu(menuId);
        if (!menu) {
            return {
                ok: false,
                code: 'MENU_NOT_FOUND',
                message: 'Menu tidak ditemukan.'
            };
        }

        var stockInfo = checkStock(menuId, amount);
        if (!stockInfo.available) {
            return {
                ok: false,
                code: 'STOCK_LIMIT',
                message: 'Jumlah ' + menu.nama + ' sudah mencapai batas stok simulasi (' + menu.stok + ' porsi).',
                data: stockInfo
            };
        }

        var existing = findCartEntry(menuId);
        if (existing) {
            existing.jumlah += amount;
        } else {
            state.cartItems.push({
                id: menu.id,
                jumlah: amount
            });
        }

        saveCartToStorage();

        return {
            ok: true,
            code: 'ADDED',
            message: menu.nama + ' berhasil ditambahkan ke keranjang.',
            data: getStateSnapshot()
        };
    }

    function incrementItem(menuId) {
        return addToCart(menuId, 1);
    }

    // Kurangi kuantitas item keranjang
    function decrementItem(menuId) {
        var entry = findCartEntry(menuId);
        var menu = findRawMenu(menuId);
        if (!entry || !menu) {
            return {
                ok: false,
                code: 'ITEM_NOT_IN_CART',
                message: 'Item tidak ditemukan di keranjang.'
            };
        }

        if (entry.jumlah <= 1) {
            return {
                ok: false,
                code: 'CONFIRM_REMOVE',
                message: 'Konfirmasi diperlukan sebelum menghapus item terakhir dari keranjang.',
                data: {
                    id: menu.id,
                    nama: menu.nama,
                    jumlah: entry.jumlah
                }
            };
        }

        entry.jumlah -= 1;
        saveCartToStorage();

        return {
            ok: true,
            code: 'DECREMENTED',
            message: 'Jumlah ' + menu.nama + ' dikurangi.',
            data: getStateSnapshot()
        };
    }

    function removeItem(menuId) {
        var index = -1;
        for (var i = 0; i < state.cartItems.length; i += 1) {
            if (state.cartItems[i].id === menuId) {
                index = i;
                break;
            }
        }

        if (index === -1) {
            return {
                ok: false,
                code: 'ITEM_NOT_IN_CART',
                message: 'Item tidak ditemukan di keranjang.'
            };
        }

        var menu = findRawMenu(menuId);
        var removedName = menu ? menu.nama : menuId;
        state.cartItems.splice(index, 1);
        saveCartToStorage();

        return {
            ok: true,
            code: 'REMOVED',
            message: removedName + ' telah dihapus dari keranjang.',
            data: getStateSnapshot()
        };
    }

    function clearCart() {
        state.cartItems = [];
        saveCartToStorage();
        return {
            ok: true,
            code: 'CLEARED',
            message: 'Keranjang pesanan berhasil dikosongkan.',
            data: getStateSnapshot()
        };
    }

    // Generate nomor pesanan unik
    function generateOrderNumber() {
        var config = getConfig();
        var now = new Date();
        var year = now.getFullYear();
        var month = String(now.getMonth() + 1).padStart(2, '0');
        var day = String(now.getDate()).padStart(2, '0');

        state.orderSequence += 1;
        var randomPart = String(Math.floor(1000 + Math.random() * 9000));
        var seqPart = String(state.orderSequence % 100).padStart(2, '0');

        return config.orderPrefix + '-' + year + month + day + '-' + randomPart.slice(0, 2) + seqPart;
    }

    function formatOrderTimestamp(dateObj) {
        var dd = String(dateObj.getDate()).padStart(2, '0');
        var mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        var yyyy = dateObj.getFullYear();
        var hh = String(dateObj.getHours()).padStart(2, '0');
        var min = String(dateObj.getMinutes()).padStart(2, '0');
        return dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + min + ' WIB';
    }

    // Buat pesanan baru
    function createOrder(customerData) {
        if (state.isCreatingOrder) {
            return {
                ok: false,
                code: 'ORDER_IN_PROGRESS',
                message: 'Pesanan sedang diproses. Mohon tunggu sebentar.'
            };
        }

        state.isCreatingOrder = true;
        try {
            var cartSnapshot = getCart();
            if (cartSnapshot.length === 0) {
                return {
                    ok: false,
                    code: 'EMPTY_CART',
                    message: 'Keranjang masih kosong. Pilih minimal satu menu sebelum memesan.'
                };
            }

            var payload = customerData || {};
            var cleanName = typeof payload.customerName === 'string' ? payload.customerName.trim() : '';
            var cleanTable = typeof payload.tableNumber === 'string' ? payload.tableNumber.trim().toUpperCase() : '';
            var cleanNote = typeof payload.orderNote === 'string' ? payload.orderNote.trim() : '';

            if (!cleanName || !cleanTable) {
                return {
                    ok: false,
                    code: 'INVALID_CUSTOMER',
                    message: 'Nama pelanggan dan nomor meja wajib diisi.'
                };
            }

            for (var i = 0; i < cartSnapshot.length; i += 1) {
                var item = cartSnapshot[i];
                if (item.jumlah <= 0 || item.jumlah > item.stok) {
                    return {
                        ok: false,
                        code: 'INVALID_STOCK',
                        message: 'Jumlah pesanan untuk ' + item.nama + ' melebihi stok simulasi yang tersedia.'
                    };
                }
            }

            var orderNumber = generateOrderNumber();
            var totalQty = getTotalQuantity();
            var totalPrice = getTotalPrice();
            var now = new Date();

            var orderRecord = {
                orderNumber: orderNumber,
                createdAt: formatOrderTimestamp(now),
                customerName: cleanName,
                tableNumber: cleanTable,
                orderNote: cleanNote || '-',
                items: cartSnapshot,
                totalQuantity: totalQty,
                totalPrice: totalPrice,
                totalPriceFormatted: formatRupiah(totalPrice),
                isSimulation: true
            };

            state.lastOrderNumber = orderNumber;
            state.cartItems = [];
            saveCartToStorage();

            return {
                ok: true,
                code: 'ORDER_CREATED',
                message: 'Pesanan simulasi berhasil dikonfirmasi.',
                data: orderRecord
            };
        } finally {
            state.isCreatingOrder = false;
        }
    }

    function getStateSnapshot() {
        return {
            initialized: state.initialized,
            menuCount: state.menuItems.length,
            cart: getCart(),
            totalQuantity: getTotalQuantity(),
            totalPrice: getTotalPrice(),
            totalPriceFormatted: formatRupiah(getTotalPrice()),
            lastOrderNumber: state.lastOrderNumber,
            isSimulationData: Boolean(getConfig().isSimulationData)
        };
    }

    global.SynthSpiceApp = {
        init: init,
        getMenuList: getMenuList,
        getMenuById: getMenuById,
        getCart: getCart,
        addToCart: addToCart,
        incrementItem: incrementItem,
        decrementItem: decrementItem,
        removeItem: removeItem,
        clearCart: clearCart,
        getTotalPrice: getTotalPrice,
        getTotalQuantity: getTotalQuantity,
        checkStock: checkStock,
        generateOrderNumber: generateOrderNumber,
        createOrder: createOrder,
        getStateSnapshot: getStateSnapshot,
        formatRupiah: formatRupiah,
        saveCartToStorage: saveCartToStorage,
        loadCartFromStorage: loadCartFromStorage
    };
})(window);
