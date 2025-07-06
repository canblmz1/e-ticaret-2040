// productRoutes.js - 2040 E-Ticaret Gelişmiş Ürün Routes
// Geleceğin alışveriş deneyimi için API endpoint'leri

const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
// const { validateCreateProduct, validateUpdateProduct, validateMongoId } = require("../middleware/productValidation");

// ===== PUBLIC ENDPOINTS (Herkes erişebilir) =====

// Tüm ürünleri listele (filtreleme, arama, sayfalama ile)
router.get("/", productController.getProducts);

// Öne çıkan ürünler
router.get("/featured", productController.getFeaturedProducts);

// Ürün arama
router.get("/search", productController.searchProducts);

// Kategori bazlı ürünler
router.get("/category/:category", productController.getProductsByCategory);

// Ürün istatistikleri (public)
router.get("/stats/public", productController.getProductStats);

// Belirli bir ürünün detayı
router.get("/:id", productController.getProductById);

// ===== AUTHENTICATED USER ENDPOINTS =====

// Ürün yorumu ekleme (giriş yapmış kullanıcılar)
router.post("/:id/reviews", auth, productController.addReview);

// ===== ADMIN ENDPOINTS =====

// Ürün yönetimi (sadece admin)
router.post("/", 
  auth, 
  isAdmin, 
  productController.uploadMiddleware,
  productController.createProduct
);

router.put("/:id", 
  auth, 
  isAdmin, 
  productController.updateProduct
);

router.delete("/:id", 
  auth, 
  isAdmin, 
  productController.deleteProduct
);

// Admin istatistikleri
router.get("/stats/admin", auth, isAdmin, productController.getProductStats);

module.exports = router;