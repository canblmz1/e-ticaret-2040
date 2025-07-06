const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
// const {
//   validateCreateOrder,
//   validateUpdateStatus,
//   validateMongoId,
//   validateQueryParams,
//   validateYear
// } = require("../middleware/orderValidation");

// ===== KULLANICI SİPARİŞ İŞLEMLERİ =====

// Sipariş oluştur
router.post("/", 
  auth, 
  orderController.createOrder
);

// Kullanıcının kendi siparişlerini getir
router.get("/my", 
  auth, 
  orderController.getMyOrders
);

// Belirli bir siparişin detayını getir (kullanıcının kendi siparişi)
router.get("/my/:id", 
  auth, 
  orderController.getMyOrderById
);

// Sipariş iptal et (sadece belirli durumlarda)
router.patch("/my/:id/cancel", 
  auth, 
  orderController.cancelOrder
);

// ===== ADMİN SİPARİŞ İŞLEMLERİ =====

// Admin: tüm siparişleri getir (sayfalama ve filtreleme ile)
router.get("/", 
  auth, 
  isAdmin, 
  orderController.getAllOrders
);

// Admin: belirli bir siparişin detayını getir
router.get("/:id", 
  auth, 
  isAdmin, 
  orderController.getOrderById
);

// Admin: sipariş durumunu güncelle
router.patch("/:id/status", 
  auth, 
  isAdmin, 
  orderController.updateOrderStatus
);

// Admin: sipariş silme (dikkatli kullanım için)
router.delete("/:id", 
  auth, 
  isAdmin, 
  orderController.deleteOrder
);

// Admin: sipariş istatistikleri
router.get("/admin/stats", 
  auth, 
  isAdmin, 
  orderController.getOrderStats
);

// Admin: aylık satış raporu
router.get("/admin/monthly", 
  auth, 
  isAdmin, 
  orderController.getMonthlyStats
);

module.exports = router;