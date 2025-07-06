// productValidation.js - Ürün doğrulama middleware'leri
// 2040 E-Ticaret için gelişmiş validation sistemi

const { body, param, query, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: "Doğrulama hatası",
      details: errors.array()
    });
  }
  next();
};

// Ürün oluşturma validasyonu
const validateCreateProduct = [
  body('name')
    .notEmpty()
    .withMessage('Ürün adı zorunlu')
    .isLength({ min: 2, max: 200 })
    .withMessage('Ürün adı 2-200 karakter arasında olmalı')
    .trim(),
  
  body('description')
    .notEmpty()
    .withMessage('Ürün açıklaması zorunlu')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Açıklama 10-2000 karakter arasında olmalı'),
  
  body('shortDescription')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Kısa açıklama maksimum 500 karakter olmalı'),
  
  body('price')
    .notEmpty()
    .withMessage('Fiyat zorunlu')
    .isFloat({ min: 0 })
    .withMessage('Fiyat geçerli bir sayı olmalı ve 0\'dan büyük olmalı'),
  
  body('originalPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Orijinal fiyat geçerli bir sayı olmalı'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stok sayısı 0 veya pozitif bir tam sayı olmalı'),
  
  body('category')
    .notEmpty()
    .withMessage('Kategori zorunlu')
    .isLength({ min: 2, max: 100 })
    .withMessage('Kategori 2-100 karakter arasında olmalı'),
  
  body('subCategory')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Alt kategori maksimum 100 karakter olmalı'),
  
  body('brand')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Marka adı maksimum 100 karakter olmalı'),
  
  body('weight')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Ağırlık geçerli bir sayı olmalı'),
  
  body('seoTitle')
    .optional()
    .isLength({ max: 60 })
    .withMessage('SEO başlığı maksimum 60 karakter olmalı'),
  
  body('seoDescription')
    .optional()
    .isLength({ max: 160 })
    .withMessage('SEO açıklaması maksimum 160 karakter olmalı'),
  
  handleValidationErrors
];

// Ürün güncelleme validasyonu
const validateUpdateProduct = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 200 })
    .withMessage('Ürün adı 2-200 karakter arasında olmalı')
    .trim(),
  
  body('description')
    .optional()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Açıklama 10-2000 karakter arasında olmalı'),
  
  body('shortDescription')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Kısa açıklama maksimum 500 karakter olmalı'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Fiyat geçerli bir sayı olmalı ve 0\'dan büyük olmalı'),
  
  body('originalPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Orijinal fiyat geçerli bir sayı olmalı'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stok sayısı 0 veya pozitif bir tam sayı olmalı'),
  
  body('category')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Kategori 2-100 karakter arasında olmalı'),
  
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'out_of_stock', 'discontinued'])
    .withMessage('Geçersiz durum değeri'),
  
  body('isVisible')
    .optional()
    .isBoolean()
    .withMessage('Görünürlük true veya false olmalı'),
  
  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('Öne çıkarılma true veya false olmalı'),
  
  handleValidationErrors
];

// MongoDB ID validasyonu
const validateMongoId = [
  param('id')
    .isMongoId()
    .withMessage('Geçerli bir ürün ID\'si gerekli'),
  handleValidationErrors
];

// Query parametreleri validasyonu
const validateQueryParams = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Sayfa numarası pozitif bir sayı olmalı'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit 1-100 arasında olmalı'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum fiyat geçerli bir sayı olmalı'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maksimum fiyat geçerli bir sayı olmalı'),
  
  query('sortBy')
    .optional()
    .isIn(['name', 'price', 'createdAt', 'averageRating', 'salesCount', 'viewCount'])
    .withMessage('Geçersiz sıralama alanı'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sıralama düzeni asc veya desc olmalı'),
  
  query('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Puan 0-5 arasında olmalı'),
  
  query('inStock')
    .optional()
    .isBoolean()
    .withMessage('Stok durumu true veya false olmalı'),
  
  query('featured')
    .optional()
    .isBoolean()
    .withMessage('Öne çıkarılma true veya false olmalı'),
  
  query('onSale')
    .optional()
    .isBoolean()
    .withMessage('İndirim durumu true veya false olmalı'),
  
  handleValidationErrors
];

// Arama validasyonu
const validateSearch = [
  query('q')
    .notEmpty()
    .withMessage('Arama terimi gerekli')
    .isLength({ min: 2, max: 100 })
    .withMessage('Arama terimi 2-100 karakter arasında olmalı')
    .trim(),
  
  query('category')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Kategori 2-100 karakter arasında olmalı'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum fiyat geçerli bir sayı olmalı'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maksimum fiyat geçerli bir sayı olmalı'),
  
  query('sortBy')
    .optional()
    .isIn(['relevance', 'price_low', 'price_high', 'rating', 'newest'])
    .withMessage('Geçersiz sıralama türü'),
  
  handleValidationErrors
];

// Yorum validasyonu
const validateReview = [
  body('rating')
    .notEmpty()
    .withMessage('Puan zorunlu')
    .isInt({ min: 1, max: 5 })
    .withMessage('Puan 1-5 arasında bir tam sayı olmalı'),
  
  body('title')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Başlık maksimum 100 karakter olmalı')
    .trim(),
  
  body('comment')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Yorum maksimum 1000 karakter olmalı')
    .trim(),
  
  handleValidationErrors
];

// Kategori validasyonu
const validateCategory = [
  param('category')
    .notEmpty()
    .withMessage('Kategori gerekli')
    .isLength({ min: 2, max: 100 })
    .withMessage('Kategori 2-100 karakter arasında olmalı')
    .trim(),
  
  handleValidationErrors
];

// Bulk işlemler için validasyon
const validateBulkUpdate = [
  body('ids')
    .isArray({ min: 1 })
    .withMessage('En az bir ürün ID\'si gerekli'),
  
  body('ids.*')
    .isMongoId()
    .withMessage('Geçerli ürün ID\'leri gerekli'),
  
  body('action')
    .notEmpty()
    .withMessage('İşlem türü gerekli')
    .isIn(['activate', 'deactivate', 'feature', 'unfeature', 'delete'])
    .withMessage('Geçersiz işlem türü'),
  
  handleValidationErrors
];

// Medya dosyası validasyonu
const validateMediaUpload = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'En az bir medya dosyası gerekli'
    });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  for (const file of req.files) {
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: 'Sadece JPEG, PNG ve WebP formatları desteklenir'
      });
    }

    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        error: 'Dosya boyutu 10MB\'dan küçük olmalı'
      });
    }
  }

  next();
};

module.exports = {
  validateCreateProduct,
  validateUpdateProduct,
  validateMongoId,
  validateQueryParams,
  validateSearch,
  validateReview,
  validateCategory,
  validateBulkUpdate,
  validateMediaUpload
};
