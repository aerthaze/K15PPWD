(function (global) {
    'use strict';

    global.SYNTH_SPICE_CONFIG = {
        restaurantName: 'Synth & Spice',
        storageKey: 'synth_spice_cart_v1',
        orderPrefix: 'SSP',
        isSimulationData: true
    };

    global.SYNTH_SPICE_MENU = [
        {
            id: 'MKN-01',
            nama: 'Neon Smash Burger',
            kategori: 'makanan',
            harga: 45000,
            deskripsi: 'Roti brioche hitam panggang dengan double patty daging sapi, keju cheddar leleh, dan saus lada hitam pedas.',
            stok: 12,
            gambar: 'assets/images/food/neon-smash-burger.jpg',
            badgeLabel: 'Andalan'
        },
        {
            id: 'MKN-02',
            nama: 'Cyber Spicy Ramen Bowl',
            kategori: 'makanan',
            harga: 48000,
            deskripsi: 'Mi ramen kuah kaldu cabai gurih dengan potongan ayam panggang chashu, telur rebus marinasi, dan minyak bawang.',
            stok: 5,
            gambar: 'assets/images/food/cyber-spicy-ramen.jpg',
            badgeLabel: 'Pedas'
        },
        {
            id: 'MKN-03',
            nama: 'Voltage Crispy Chicken Rice',
            kategori: 'makanan',
            harga: 38000,
            deskripsi: 'Nasi hangat dengan ayam goreng renyah saus madu pedas, taburan wijen, dan acar timun segar.',
            stok: 15,
            gambar: 'assets/images/food/voltage-chicken-rice.jpg',
            badgeLabel: 'Favorit'
        },
        {
            id: 'MNM-01',
            nama: 'Electric Blue Citrus Fizz',
            kategori: 'minuman',
            harga: 22000,
            deskripsi: 'Minuman soda citrus dingin dengan perasan lemon, daun mint segar, dan es batu.',
            stok: 20,
            gambar: 'assets/images/drinks/electric-citrus-fizz.jpg',
            badgeLabel: 'Segar'
        },
        {
            id: 'MNM-02',
            nama: 'Magenta Berry Soda',
            kategori: 'minuman',
            harga: 24000,
            deskripsi: 'Soda stroberi dan teh bunga rosela dengan rasa asam manis segar serta irisan buah stroberi.',
            stok: 18,
            gambar: 'assets/images/drinks/magenta-berry-soda.jpg',
            badgeLabel: 'Dingin'
        },
        {
            id: 'MNM-03',
            nama: 'Midnight Cold Brew Tonic',
            kategori: 'minuman',
            harga: 26000,
            deskripsi: 'Kopi cold brew yang disajikan di atas air tonik dingin dengan tambahan kulit jeruk segar.',
            stok: 14,
            gambar: 'assets/images/drinks/midnight-cold-brew.jpg',
            badgeLabel: 'Kopi'
        },
        {
            id: 'CML-01',
            nama: 'Circuit Loaded Fries',
            kategori: 'camilan',
            harga: 28000,
            deskripsi: 'Kentang goreng renyah dengan siraman saus keju cheddar hangat, daging asap cincang, dan irisan jalapeno.',
            stok: 16,
            gambar: 'assets/images/snacks/circuit-loaded-fries.jpg',
            badgeLabel: 'Sharing'
        },
        {
            id: 'CML-02',
            nama: 'Crimson Spice Wings (6 pcs)',
            kategori: 'camilan',
            harga: 34000,
            deskripsi: 'Enam potong sayap ayam goreng berlapis bumbu cabai asap manis pedas, lengkap dengan cocolan garlic mayo.',
            stok: 4,
            gambar: 'assets/images/snacks/crimson-spice-wings.jpg',
            badgeLabel: 'Terbatas'
        },
        {
            id: 'CML-03',
            nama: 'Pulse Crispy Gyoza (5 pcs)',
            kategori: 'camilan',
            harga: 25000,
            deskripsi: 'Lima buah gyoza ayam panggang renyah dengan saus cocol kecap wijen pedas.',
            stok: 14,
            gambar: 'assets/images/snacks/pulse-crispy-gyoza.jpg',
            badgeLabel: 'Renyah'
        }
    ];
})(window);
