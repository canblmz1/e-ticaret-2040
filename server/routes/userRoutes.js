const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public routes
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);

// Protected routes (require authentication)
router.get("/profile", authMiddleware, userController.getUserProfile);
router.put("/profile", authMiddleware, userController.updateUserProfile);
router.put("/change-password", authMiddleware, userController.changePassword);

// Admin routes (require admin privileges)
router.get("/", authMiddleware, adminMiddleware, userController.getUsers);
router.get("/stats", authMiddleware, adminMiddleware, userController.getUserStats);
router.delete("/:id", authMiddleware, adminMiddleware, userController.deleteUser);
router.put("/:id/role", authMiddleware, adminMiddleware, userController.updateUserRole);

module.exports = router;