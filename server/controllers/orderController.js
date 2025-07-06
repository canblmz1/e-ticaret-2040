// orderController.js
// Siparişle ilgili işlemler burada

const Order = require("../models/Order");
const Cart = require("../models/Cart");

// Sipariş oluştur
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: "Adres zorunlu!" });
    }

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Sepet boş, sipariş verilemez!" });
    }

    // Stok kontrolü
    for (let item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ 
          error: `${item.product.name} için yeterli stok yok! Mevcut stok: ${item.product.stock}` 
        });
      }
    }

    // Toplam hesapla
    const total = cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    const order = new Order({
      user: userId,
      items: cart.items.map(i => ({
        product: i.product._id,
        quantity: i.quantity
      })),
      address,
      total
    });

    await order.save();

    // Siparişten sonra sepeti temizle
    cart.items = [];
    await cart.save();

    // Populate edilmiş siparişi döndür
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.product');

    res.status(201).json({
      message: "Sipariş başarıyla oluşturuldu",
      order: populatedOrder
    });
  } catch (err) {
    console.error('Sipariş oluşturma hatası:', err);
    res.status(500).json({ error: "Sipariş oluşturulamadı" });
  }
};

// Kullanıcının tüm siparişleri
exports.getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user.userId })
      .populate('items.product')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ user: req.user.userId });

    res.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (err) {
    console.error('Siparişleri getirme hatası:', err);
    res.status(500).json({ error: "Siparişler alınamadı" });
  }
};

// Kullanıcının belirli bir siparişini getir
exports.getMyOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ 
      _id: id, 
      user: req.user.userId 
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({ error: "Sipariş bulunamadı!" });
    }

    res.json(order);
  } catch (err) {
    console.error('Sipariş detayı getirme hatası:', err);
    res.status(500).json({ error: "Sipariş detayları alınamadı" });
  }
};

// Sipariş iptal et
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ 
      _id: id, 
      user: req.user.userId 
    });

    if (!order) {
      return res.status(404).json({ error: "Sipariş bulunamadı!" });
    }

    // Sadece belirli durumlarda iptal edilebilir
    if (order.status === "teslim edildi" || order.status === "iptal edildi") {
      return res.status(400).json({ 
        error: "Bu durumda olan sipariş iptal edilemez!" 
      });
    }

    order.status = "iptal edildi";
    await order.save();

    res.json({
      message: "Sipariş başarıyla iptal edildi",
      order
    });
  } catch (err) {
    console.error('Sipariş iptal etme hatası:', err);
    res.status(500).json({ error: "Sipariş iptal edilemedi" });
  }
};

// Admin: Tüm siparişleri getir (filtreleme ve sayfalama ile)
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Filtreleme için query objesi oluştur
    let query = {};
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      filters: {
        status,
        sortBy,
        sortOrder: req.query.sortOrder || 'desc'
      }
    });
  } catch (err) {
    console.error('Tüm siparişleri getirme hatası:', err);
    res.status(500).json({ error: "Siparişler alınamadı" });
  }
};

// Admin: Belirli bir siparişin detayını getir
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('user', 'name email phone')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ error: "Sipariş bulunamadı!" });
    }

    res.json(order);
  } catch (err) {
    console.error('Sipariş detayı getirme hatası:', err);
    res.status(500).json({ error: "Sipariş detayları alınamadı" });
  }
};

// Admin: Sipariş durumunu güncelle
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: "Durum zorunlu!" });
    }

    // Geçerli durumları kontrol et
    const validStatuses = [
      "hazırlanıyor", 
      "onaylandı", 
      "kargoda", 
      "teslim edildi", 
      "iptal edildi"
    ];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: "Geçersiz durum! Geçerli durumlar: " + validStatuses.join(", ") 
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Sipariş bulunamadı!" });
    }

    // Durum geçiş kontrolü
    if (order.status === "teslim edildi" && status !== "teslim edildi") {
      return res.status(400).json({ 
        error: "Teslim edilmiş sipariş durumu değiştirilemez!" 
      });
    }

    const oldStatus = order.status;
    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(id)
      .populate('user', 'name email')
      .populate('items.product');

    res.json({
      message: `Sipariş durumu '${oldStatus}' -> '${status}' olarak güncellendi`,
      order: updatedOrder
    });
  } catch (err) {
    console.error('Sipariş durumu güncelleme hatası:', err);
    res.status(500).json({ error: "Sipariş durumu güncellenemedi" });
  }
};

// Admin: Sipariş silme
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Sipariş bulunamadı!" });
    }

    // Sadece iptal edilmiş siparişler silinebilir
    if (order.status !== "iptal edildi") {
      return res.status(400).json({ 
        error: "Sadece iptal edilmiş siparişler silinebilir!" 
      });
    }

    await Order.findByIdAndDelete(id);

    res.json({
      message: "Sipariş başarıyla silindi",
      deletedOrderId: id
    });
  } catch (err) {
    console.error('Sipariş silme hatası:', err);
    res.status(500).json({ error: "Sipariş silinemedi" });
  }
};

// Admin: Sipariş istatistikleri
exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: "iptal edildi" } } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);

    const statusStats = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      summary: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        statusDistribution: statusStats
      },
      recentOrders
    });
  } catch (err) {
    console.error('İstatistik getirme hatası:', err);
    res.status(500).json({ error: "İstatistikler alınamadı" });
  }
};

// Admin: Aylık satış raporu
exports.getMonthlyStats = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    
    const monthlyStats = await Order.aggregate([
      {
        $match: {
          status: { $ne: "iptal edildi" },
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          orderCount: { $sum: 1 },
          totalRevenue: { $sum: "$total" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // 12 aylık veri için boş ayları da dahil et
    const fullYearStats = [];
    for (let month = 1; month <= 12; month++) {
      const existingData = monthlyStats.find(stat => stat._id === month);
      fullYearStats.push({
        month,
        orderCount: existingData?.orderCount || 0,
        totalRevenue: existingData?.totalRevenue || 0
      });
    }

    res.json({
      year,
      monthlyData: fullYearStats,
      yearTotal: {
        orders: fullYearStats.reduce((sum, month) => sum + month.orderCount, 0),
        revenue: fullYearStats.reduce((sum, month) => sum + month.totalRevenue, 0)
      }
    });
  } catch (err) {
    console.error('Aylık istatistik getirme hatası:', err);
    res.status(500).json({ error: "Aylık istatistikler alınamadı" });
  }
};