// cartController.js
// Sepetle ilgili işlemleri yönetir

const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Sepeti getir (GET /api/cart)
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }).populate('items.product');
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Sepet alınamadı" });
  }
};

// Sepete ürün ekle/güncelle (POST /api/cart)
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ error: "Ürün ve miktar belirtilmeli" });
    }

    // Ürün var mı kontrol et
    const product = await Product.findById(productId);
    if (!product) return res.status(400).json({ error: "Ürün bulunamadı" });

    let cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      // Sepeti yoksa yeni oluştur
      cart = new Cart({
        user: req.user.userId,
        items: [{ product: productId, quantity }]
      });
    } else {
      // Sepeti varsa: ürün var mı kontrol et
      const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
      if (itemIndex > -1) {
        // Varsa miktarı güncelle
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Yoksa yeni ürün ekle
        cart.items.push({ product: productId, quantity });
      }
    }

    cart.updatedAt = Date.now();
    await cart.save();
    const populatedCart = await cart.populate('items.product');
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ error: "Sepete eklenemedi" });
  }
};

// Sepetten ürün çıkar (DELETE /api/cart/:productId)
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) return res.status(404).json({ error: "Sepet bulunamadı" });

    cart.items = cart.items.filter(i => i.product.toString() !== productId);
    cart.updatedAt = Date.now();
    await cart.save();
    const populatedCart = await cart.populate('items.product');
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ error: "Sepetten çıkarılamadı" });
  }
};