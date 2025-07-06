// orderValidation.js
// Sipariş doğrulama middleware'leri

const { body, param, query, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Doğrulama hatası",
      details: errors.array()
    });
  }
  next();
};

// Sipariş oluşturma validasyonu
const validateCreateOrder = [
  body('address')
    .notEmpty()
    .withMessage('Adres zorunlu')
    .isLength({ min: 10, max: 500 })
    .withMessage('Adres 10-500 karakter arasında olmalı'),
  handleValidationErrors
];

// Sipariş durumu güncelleme validasyonu
const validateUpdateStatus = [
  param('id')
    .isMongoId()
    .withMessage('Geçerli bir sipariş ID\'si gerekli'),
  body('status')
    .notEmpty()
    .withMessage('Durum zorunlu')
    .isIn(['hazırlanıyor', 'onaylandı', 'kargoda', 'teslim edildi', 'iptal edildi'])
    .withMessage('Geçersiz durum değeri'),
  handleValidationErrors
];

// MongoDB ID validasyonu
const validateMongoId = [
  param('id')
    .isMongoId()
    .withMessage('Geçerli bir ID gerekli'),
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
  query('status')
    .optional()
    .isIn(['hazırlanıyor', 'onaylandı', 'kargoda', 'teslim edildi', 'iptal edildi'])
    .withMessage('Geçersiz durum filtresi'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'total', 'status'])
    .withMessage('Geçersiz sıralama alanı'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sıralama düzeni asc veya desc olmalı'),
  handleValidationErrors
];

// Yıl validasyonu (istatistikler için)
const validateYear = [
  query('year')
    .optional()
    .isInt({ min: 2020, max: new Date().getFullYear() + 1 })
    .withMessage('Geçerli bir yıl girin'),
  handleValidationErrors
];

module.exports = {
  validateCreateOrder,
  validateUpdateStatus,
  validateMongoId,
  validateQueryParams,
  validateYear
};
