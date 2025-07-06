const exp// R// Routes imports - basit versiyonlar test için (geçici olarak kapatıldı)
// const productRoutes = require("./routes/productRoutes-simple");
// const cartRoutes = require("./routes/cartRoutes-simple");
// const orderRoutes = require("./routes/orderRoutes-simple");
// const userRoutes = require("./routes/userRoutes-simple"); imports - basit versiyonlar test için
// const productRoutes = require("./routes/productRoutes-simple");
// const cartRoutes = require("./routes/cartRoutes-simple");
// const orderRoutes = require("./routes/orderRoutes-simple");
// const userRoutes = require("./routes/userRoutes-simple"); // Temporarily disabled for debugging= require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

// Routes imports - basit versiyonlar test için
const productRoutes = require("./routes/productRoutes-simple");
const cartRoutes = require("./routes/cartRoutes-simple");
const orderRoutes = require("./routes/orderRoutes-simple");
// const userRoutes = require("./routes/userRoutes-simple"); // Temporarily commented out

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: "Çok fazla istek gönderiyorsunuz. Lütfen 15 dakika sonra tekrar deneyin."
    }
});
app.use('/api/', limiter);

// Compression for better performance
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourfrontenddomain.com'] 
        : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection with better error handling
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("🚀 MongoDB bağlantısı başarılı - E-Ticaret 2040 hazır!");
    console.log(`📊 Database: ${mongoose.connection.name}`);
})
.catch((err) => {
    console.error("❌ MongoDB bağlantı hatası:", err.message);
    process.exit(1);
});

// MongoDB connection events
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
});

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "E-Ticaret 2040 Backend API çalışıyor! 🚀",
        timestamp: new Date().toISOString(),
        version: "2040.1.0",
        uptime: process.uptime()
    });
});

// Welcome endpoint
app.get("/", (req, res) => {
    res.json({
        message: "🛍️ E-Ticaret 2040 - Geleceğin Alışveriş Deneyimi",
        year: 2040,
        features: [
            "AI-Powered Ürün Önerileri",
            "Ses Kontrolü Alışveriş",
            "Sanal Gerçeklik Ürün Görüntüleme",
            "Blockchain Tabanlı Güvenli Ödeme",
            "Drone Teslimat Sistemi"
        ],
        api_version: "v1",
        documentation: "/api/docs"
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: "Endpoint bulunamadı",
        message: "Bu API endpoint'i mevcut değil. Lütfen dokümantasyonu kontrol edin.",
        timestamp: new Date().toISOString()
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('❌ Global Error:', error);
    
    const status = error.status || 500;
    const message = error.message || 'Sunucuda bir hata oluştu';
    
    res.status(status).json({
        error: message,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});

app.listen(PORT, () => {
    console.log(`🚀 E-Ticaret 2040 Backend sunucu ${PORT} portunda çalışıyor`);
    console.log(`🌐 API URL: http://localhost:${PORT}`);
    console.log(`📚 Docs: http://localhost:${PORT}/api/docs`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});