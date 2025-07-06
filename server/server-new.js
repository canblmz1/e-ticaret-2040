const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'e-ticaret-2040-super-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Veri dosyalarının yolları
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const CART_FILE = path.join(DATA_DIR, 'cart.json');

// Veri klasörünü oluştur
async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

// JSON dosyasından veri oku
async function readJsonFile(filePath, defaultData = []) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch {
        return defaultData;
    }
}

// JSON dosyasına veri yaz
async function writeJsonFile(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token gerekli' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Geçersiz token' });
        }
        req.user = user;
        next();
    });
};

// ============= KULLANICI İŞLEMLERİ =============

// Kayıt ol
app.post('/api/users/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Tüm alanlar zorunlu' });
        }

        const users = await readJsonFile(USERS_FILE);
        
        // Email kontrolü
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ error: 'Bu email zaten kayıtlı' });
        }

        // Şifreyi hashle
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: uuidv4(),
            name,
            email,
            password: hashedPassword,
            isAdmin: false,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        await writeJsonFile(USERS_FILE, users);

        // Token oluştur
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email, isAdmin: newUser.isAdmin },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Kayıt başarılı',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                isAdmin: newUser.isAdmin
            },
            token
        });
    } catch (error) {
        console.error('Kayıt hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Giriş yap
app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email ve şifre gerekli' });
        }

        const users = await readJsonFile(USERS_FILE);
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(400).json({ error: 'Kullanıcı bulunamadı' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Yanlış şifre' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, isAdmin: user.isAdmin },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Giriş başarılı',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            },
            token
        });
    } catch (error) {
        console.error('Giriş hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// ============= ÜRÜN İŞLEMLERİ =============

// Tüm ürünleri getir
app.get('/api/products', async (req, res) => {
    try {
        const products = await readJsonFile(PRODUCTS_FILE, [
            {
                id: uuidv4(),
                name: 'iPhone 15 Pro',
                description: 'Gelecekten gelen telefon',
                price: 50000,
                category: 'Elektronik',
                stock: 10,
                image: 'https://via.placeholder.com/300x300?text=iPhone+15+Pro',
                createdAt: new Date().toISOString()
            },
            {
                id: uuidv4(),
                name: 'MacBook Air M3',
                description: 'Ultra hızlı laptop',
                price: 75000,
                category: 'Elektronik',
                stock: 5,
                image: 'https://via.placeholder.com/300x300?text=MacBook+Air',
                createdAt: new Date().toISOString()
            },
            {
                id: uuidv4(),
                name: 'Nike Air Max 2040',
                description: 'Geleceğin spor ayakkabısı',
                price: 3000,
                category: 'Spor',
                stock: 20,
                image: 'https://via.placeholder.com/300x300?text=Nike+Air+Max',
                createdAt: new Date().toISOString()
            }
        ]);
        
        // İlk kez çalıştırılıyorsa örnek ürünleri kaydet
        await writeJsonFile(PRODUCTS_FILE, products);
        
        res.json(products);
    } catch (error) {
        console.error('Ürünler getirme hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Tek ürün getir
app.get('/api/products/:id', async (req, res) => {
    try {
        const products = await readJsonFile(PRODUCTS_FILE);
        const product = products.find(p => p.id === req.params.id);
        
        if (!product) {
            return res.status(404).json({ error: 'Ürün bulunamadı' });
        }
        
        res.json(product);
    } catch (error) {
        console.error('Ürün getirme hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// ============= SEPET İŞLEMLERİ =============

// Sepete ürün ekle
app.post('/api/cart/add', authenticateToken, async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const userId = req.user.userId;

        const cart = await readJsonFile(CART_FILE, []);
        const products = await readJsonFile(PRODUCTS_FILE);
        
        const product = products.find(p => p.id === productId);
        if (!product) {
            return res.status(404).json({ error: 'Ürün bulunamadı' });
        }

        // Kullanıcının sepetini bul veya oluştur
        let userCart = cart.find(c => c.userId === userId);
        if (!userCart) {
            userCart = { userId, items: [] };
            cart.push(userCart);
        }

        // Ürün sepette var mı kontrol et
        const existingItem = userCart.items.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            userCart.items.push({ productId, quantity });
        }

        await writeJsonFile(CART_FILE, cart);
        res.json({ message: 'Ürün sepete eklendi', cart: userCart });
    } catch (error) {
        console.error('Sepete ekleme hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Sepeti getir
app.get('/api/cart', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const cart = await readJsonFile(CART_FILE, []);
        const products = await readJsonFile(PRODUCTS_FILE);
        
        const userCart = cart.find(c => c.userId === userId);
        if (!userCart) {
            return res.json({ items: [], total: 0 });
        }

        // Ürün detaylarını ekle
        const cartWithDetails = userCart.items.map(item => {
            const product = products.find(p => p.id === item.productId);
            return {
                ...item,
                product,
                subtotal: product ? product.price * item.quantity : 0
            };
        });

        const total = cartWithDetails.reduce((sum, item) => sum + item.subtotal, 0);

        res.json({ items: cartWithDetails, total });
    } catch (error) {
        console.error('Sepet getirme hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// ============= SİPARİŞ İŞLEMLERİ =============

// Sipariş oluştur
app.post('/api/orders', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { shippingAddress } = req.body;

        const cart = await readJsonFile(CART_FILE, []);
        const products = await readJsonFile(PRODUCTS_FILE);
        const orders = await readJsonFile(ORDERS_FILE, []);

        const userCart = cart.find(c => c.userId === userId);
        if (!userCart || userCart.items.length === 0) {
            return res.status(400).json({ error: 'Sepet boş' });
        }

        // Sipariş detaylarını hazırla
        const orderItems = userCart.items.map(item => {
            const product = products.find(p => p.id === item.productId);
            return {
                productId: item.productId,
                productName: product.name,
                price: product.price,
                quantity: item.quantity,
                subtotal: product.price * item.quantity
            };
        });

        const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

        const newOrder = {
            id: uuidv4(),
            userId,
            items: orderItems,
            total,
            shippingAddress,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        orders.push(newOrder);
        await writeJsonFile(ORDERS_FILE, orders);

        // Sepeti temizle
        const updatedCart = cart.filter(c => c.userId !== userId);
        await writeJsonFile(CART_FILE, updatedCart);

        res.status(201).json({ message: 'Sipariş oluşturuldu', order: newOrder });
    } catch (error) {
        console.error('Sipariş oluşturma hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Kullanıcının siparişlerini getir
app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const orders = await readJsonFile(ORDERS_FILE, []);
        
        const userOrders = orders.filter(order => order.userId === userId);
        res.json(userOrders);
    } catch (error) {
        console.error('Siparişler getirme hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// ============= GENEL =============

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'E-Ticaret 2040 Backend çalışıyor! 🚀' });
});

// Ana sayfa
app.get('/', (req, res) => {
    res.json({
        message: '🛍️ E-Ticaret 2040 - JSON Tabanlı Backend',
        endpoints: [
            'POST /api/users/register - Kayıt ol',
            'POST /api/users/login - Giriş yap',
            'GET /api/products - Tüm ürünler',
            'GET /api/products/:id - Tek ürün',
            'POST /api/cart/add - Sepete ekle',
            'GET /api/cart - Sepeti getir',
            'POST /api/orders - Sipariş oluştur',
            'GET /api/orders - Siparişleri getir'
        ]
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint bulunamadı' });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Hata:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
});

// Sunucuyu başlat
async function startServer() {
    try {
        await ensureDataDir();
        app.listen(PORT, () => {
            console.log(`🚀 E-Ticaret 2040 Backend ${PORT} portunda çalışıyor!`);
            console.log(`📱 API URL: http://localhost:${PORT}`);
            console.log(`✅ JSON tabanlı veri sistemi hazır`);
        });
    } catch (error) {
        console.error('Sunucu başlatma hatası:', error);
        process.exit(1);
    }
}

startServer();
