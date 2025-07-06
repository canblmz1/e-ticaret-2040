const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Basit route'lar - test için
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/test", (req, res) => {
    res.json({ message: "User routes çalışıyor!" });
});

module.exports = router;
