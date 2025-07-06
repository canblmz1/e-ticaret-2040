const express = require("express");
const router = express.Router();

// Basit test route'ları
router.get("/test", (req, res) => {
    res.json({ message: "Product routes çalışıyor!" });
});

router.get("/", (req, res) => {
    res.json({ 
        message: "Ürünler listesi",
        products: []
    });
});

module.exports = router;
