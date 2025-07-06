const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Kullanıcıları getir (GET /api/users)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

// Kayıt (POST /api/users)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Tüm alanlar zorunludur!" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "Bu e-posta ile zaten kayıt var!" });
    }

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const { password: _, ...userData } = user.toObject();
    res.status(201).json(userData);
  } catch (err) {
    res.status(500).json({ error: "Kayıt sırasında hata oluştu!" });
  }
};

// Giriş (POST /api/users/login)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "E-posta ve şifre zorunludur!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Kullanıcı bulunamadı!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Şifre yanlış!" });
    }

    // JWT Token oluştur
    const payload = { userId: user._id, isAdmin: user.isAdmin };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2d" });

    // Şifreyi göndermiyoruz!
    const { password: _, ...userData } = user.toObject();
    res.json({ user: userData, token });
  } catch (err) {
    res.status(500).json({ error: "Giriş sırasında hata oluştu!" });
  }
};

// Kullanıcı profilini getir (GET /api/users/profile)
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı!" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Profil bilgileri alınamadı!" });
  }
};

// Kullanıcı profilini güncelle (PUT /api/users/profile)
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone, address, preferences } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı!" });
    }

    // Email değişikliği kontrolü
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ error: "Bu e-posta adresi zaten kullanımda!" });
      }
    }

    // Güncelleme
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.preferences = { ...user.preferences, ...preferences };
    user.updatedAt = new Date();

    await user.save();

    const { password: _, ...userData } = user.toObject();
    res.json(userData);
  } catch (err) {
    res.status(500).json({ error: "Profil güncellenemedi!" });
  }
};

// Şifre değiştir (PUT /api/users/change-password)
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Mevcut şifre ve yeni şifre zorunludur!" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı!" });
    }

    // Mevcut şifreyi kontrol et
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Mevcut şifre yanlış!" });
    }

    // Yeni şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.updatedAt = new Date();
    await user.save();

    res.json({ message: "Şifre başarıyla güncellendi!" });
  } catch (err) {
    res.status(500).json({ error: "Şifre güncellenemedi!" });
  }
};

// Kullanıcı silme (DELETE /api/users/:id) - Admin only
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı!" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Kullanıcı başarıyla silindi!" });
  } catch (err) {
    res.status(500).json({ error: "Kullanıcı silinemedi!" });
  }
};

// Kullanıcı rolü güncelle (PUT /api/users/:id/role) - Admin only
exports.updateUserRole = async (req, res) => {
  try {
    const { role, isAdmin } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı!" });
    }

    user.role = role || user.role;
    user.isAdmin = isAdmin !== undefined ? isAdmin : user.isAdmin;
    user.updatedAt = new Date();

    await user.save();

    const { password: _, ...userData } = user.toObject();
    res.json(userData);
  } catch (err) {
    res.status(500).json({ error: "Kullanıcı rolü güncellenemedi!" });
  }
};

// Kullanıcı istatistikleri (GET /api/users/stats) - Admin only
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const adminUsers = await User.countDocuments({ isAdmin: true });
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("-password");

    res.json({
      totalUsers,
      activeUsers,
      adminUsers,
      recentUsers,
      userGrowth: {
        thisMonth: await User.countDocuments({
          createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
        }),
        lastMonth: await User.countDocuments({
          createdAt: { 
            $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
            $lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        })
      }
    });
  } catch (err) {
    res.status(500).json({ error: "İstatistikler alınamadı!" });
  }
};