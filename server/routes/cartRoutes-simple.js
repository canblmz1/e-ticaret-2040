const express = require("express");
const router = express.Router();

// Basit test route'ları
router.get("/test", (req, res) => {
    res.json({ message: "Cart routes çalışıyor!" });
});

module.exports = router;
