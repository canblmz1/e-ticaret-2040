const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}));
app.use(express.json());

// Mock Data
let products = [
    {
        id: "1",
        name: "Neural Interface Headset",
        description: "Next-generation brain-computer interface for seamless digital interaction",
        price: 2999.99,
        originalPrice: 3499.99,
        image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=500",
        images: [
            "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=500",
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500"
        ],
        category: "electronics",
        stock: 25,
        rating: 4.8,
        reviews: 342,
        features: ["VR Ready", "AI Recommended", "Smart Home"],
        tags: ["neural", "interface", "ai"],
        variants: [
            {
                id: "1-black",
                name: "Midnight Black",
                price: 2999.99,
                stock: 15,
                color: "#000000"
            },
            {
                id: "1-silver",
                name: "Quantum Silver",
                price: 3199.99,
                stock: 10,
                color: "#C0C0C0"
            }
        ]
    },
    {
        id: "2",
        name: "Holographic Display",
        description: "Revolutionary 3D holographic display for immersive computing",
        price: 1899.99,
        originalPrice: 2299.99,
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500",
        images: [
            "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500"
        ],
        category: "electronics",
        stock: 18,
        rating: 4.6,
        reviews: 128,
        features: ["AR View", "Eco Friendly"],
        tags: ["holographic", "display", "3d"],
        variants: [
            {
                id: "2-24inch",
                name: "24 inch",
                price: 1899.99,
                stock: 18
            }
        ]
    },
    {
        id: "3",
        name: "Quantum Smartphone",
        description: "Quantum-powered smartphone with unlimited possibilities",
        price: 1299.99,
        originalPrice: 1599.99,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
        images: [
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500"
        ],
        category: "electronics",
        stock: 42,
        rating: 4.9,
        reviews: 891,
        features: ["VR Ready", "AI Recommended"],
        tags: ["quantum", "smartphone", "mobile"],
        variants: [
            {
                id: "3-128gb",
                name: "128GB",
                price: 1299.99,
                stock: 22
            },
            {
                id: "3-256gb",
                name: "256GB",
                price: 1499.99,
                stock: 20
            }
        ]
    },
    {
        id: "4",
        name: "Smart Home Hub",
        description: "Central control system for your entire smart home ecosystem",
        price: 599.99,
        originalPrice: 799.99,
        image: "https://images.unsplash.com/photo-1558618047-cd39ad4d4b4b?w=500",
        images: [
            "https://images.unsplash.com/photo-1558618047-cd39ad4d4b4b?w=500"
        ],
        category: "home",
        stock: 67,
        rating: 4.7,
        reviews: 234,
        features: ["Smart Home", "AI Recommended", "Eco Friendly"],
        tags: ["smart", "home", "hub"],
        variants: [
            {
                id: "4-white",
                name: "Arctic White",
                price: 599.99,
                stock: 35,
                color: "#FFFFFF"
            },
            {
                id: "4-black",
                name: "Space Black",
                price: 599.99,
                stock: 32,
                color: "#000000"
            }
        ]
    }
];

let categories = [
    { id: "electronics", name: "Electronics", count: 3 },
    { id: "home", name: "Smart Home", count: 1 },
    { id: "wearables", name: "Wearables", count: 0 },
    { id: "gaming", name: "Gaming", count: 0 }
];

let cart = [];
let orders = [];
let users = [
    {
        id: "user1",
        email: "test@example.com",
        password: "123456", // In real app, this would be hashed
        name: "Test User",
        role: "user"
    },
    {
        id: "admin1",
        email: "admin@example.com",
        password: "admin123",
        name: "Admin User",
        role: "admin"
    }
];

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'E-Ticaret 2040 Backend API çalışıyor! 🚀',
        timestamp: new Date().toISOString()
    });
});

// Products Routes
app.get('/api/products', (req, res) => {
    const { 
        category, 
        minPrice, 
        maxPrice, 
        rating, 
        features, 
        search,
        sortBy = 'newest',
        page = 1,
        limit = 12
    } = req.query;

    let filteredProducts = [...products];

    // Apply filters
    if (category && category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    if (minPrice) {
        filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
        filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
    }

    if (rating) {
        filteredProducts = filteredProducts.filter(p => p.rating >= parseFloat(rating));
    }

    if (features) {
        const featureArray = features.split(',');
        filteredProducts = filteredProducts.filter(p => 
            featureArray.some(feature => p.features.includes(feature))
        );
    }

    if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower) ||
            p.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
    }

    // Apply sorting
    switch (sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'popular':
            filteredProducts.sort((a, b) => b.reviews - a.reviews);
            break;
        case 'newest':
        default:
            // Keep original order for newest
            break;
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
        products: paginatedProducts,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(filteredProducts.length / limit),
            totalProducts: filteredProducts.length,
            hasNext: endIndex < filteredProducts.length,
            hasPrev: page > 1
        },
        filters: {
            availableCategories: categories,
            priceRange: {
                min: Math.min(...products.map(p => p.price)),
                max: Math.max(...products.map(p => p.price))
            }
        }
    });
});

app.get('/api/products/categories', (req, res) => {
    res.json({ categories });
});

app.get('/api/products/search', (req, res) => {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
        return res.json({ products: [] });
    }

    const searchLower = q.toLowerCase();
    const searchResults = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );

    res.json({ products: searchResults });
});

app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    // Add related products (simple recommendation)
    const relatedProducts = products
        .filter(p => p.id !== product.id && p.category === product.category)
        .slice(0, 4);

    res.json({
        ...product,
        relatedProducts
    });
});

// Cart Routes
app.get('/api/cart', (req, res) => {
    const cartWithDetails = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        const variant = product?.variants?.find(v => v.id === item.variantId);
        
        return {
            ...item,
            product: product ? {
                id: product.id,
                name: product.name,
                image: product.image,
                price: variant?.price || product.price
            } : null
        };
    }).filter(item => item.product !== null);

    const total = cartWithDetails.reduce((sum, item) => 
        sum + (item.product.price * item.quantity), 0
    );

    res.json({
        items: cartWithDetails,
        total,
        itemCount: cartWithDetails.reduce((sum, item) => sum + item.quantity, 0)
    });
});

app.post('/api/cart/add', (req, res) => {
    const { productId, variantId, quantity = 1 } = req.body;
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    const existingItem = cart.find(item => 
        item.productId === productId && item.variantId === variantId
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: uuidv4(),
            productId,
            variantId,
            quantity,
            addedAt: new Date().toISOString()
        });
    }

    res.json({ message: 'Product added to cart', cart });
});

app.put('/api/cart/items/:itemId', (req, res) => {
    const { quantity } = req.body;
    const itemIndex = cart.findIndex(item => item.id === req.params.itemId);
    
    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Cart item not found' });
    }

    if (quantity <= 0) {
        cart.splice(itemIndex, 1);
    } else {
        cart[itemIndex].quantity = quantity;
    }

    res.json({ message: 'Cart updated', cart });
});

app.delete('/api/cart/items/:itemId', (req, res) => {
    const itemIndex = cart.findIndex(item => item.id === req.params.itemId);
    
    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Cart item not found' });
    }

    cart.splice(itemIndex, 1);
    res.json({ message: 'Item removed from cart' });
});

app.delete('/api/cart', (req, res) => {
    cart = [];
    res.json({ message: 'Cart cleared' });
});

// Orders Routes
app.get('/api/orders', (req, res) => {
    res.json({ orders });
});

app.post('/api/orders', (req, res) => {
    const orderData = req.body;
    
    const newOrder = {
        id: uuidv4(),
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        items: [...cart] // Copy current cart
    };

    orders.push(newOrder);
    cart = []; // Clear cart after order

    res.json({ 
        message: 'Order created successfully', 
        order: newOrder 
    });
});

app.get('/api/orders/:id', (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
});

// User Routes (basic auth simulation)
app.post('/api/users/login', (req, res) => {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a simple token (in real app, use JWT)
    const token = `token_${user.id}_${Date.now()}`;
    
    res.json({
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        }
    });
});

app.post('/api/users/register', (req, res) => {
    const { email, password, name } = req.body;
    
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = {
        id: uuidv4(),
        email,
        password, // In real app, hash this
        name,
        role: 'user'
    };

    users.push(newUser);

    const token = `token_${newUser.id}_${Date.now()}`;
    
    res.json({
        token,
        user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role
        }
    });
});

// Admin Routes
app.get('/api/admin/stats', (req, res) => {
    res.json({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        revenue: orders.reduce((sum, order) => sum + (order.total || 0), 0)
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: error.message
    });
});

app.listen(PORT, () => {
    console.log(`🚀 E-Ticaret 2040 Backend running on port ${PORT}`);
    console.log(`🌐 API URL: http://localhost:${PORT}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});
