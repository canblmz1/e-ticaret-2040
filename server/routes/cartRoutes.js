const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const auth = require("../middleware/authMiddleware");

// Sepeti getir
router.get("/", auth, cartController.getCart);

// Sepete ürün ekle/güncelle
router.post("/", auth, cartController.addToCart);

// Sepetten ürün çıkar
router.delete("/:productId", auth, cartController.removeFromCart);

module.exports = router;