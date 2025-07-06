// Order.js
// Sipariş modelimiz: Kullanıcı, ürünler, adres, toplam, tarih, durum vs. içerir

const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [OrderItemSchema],
  address: { type: String, required: true },
  total: { type: Number, required: true },
  status: { type: String, default: "hazırlanıyor" }, // ör: hazırlanıyor, kargoda, teslim edildi
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);