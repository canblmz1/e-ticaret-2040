// Product.js - 2040 E-Ticaret Gelişmiş Ürün Modeli
// Geleceğin alışveriş deneyimi için tasarlanmıştır

const mongoose = require('mongoose');

// Ürün varyantları şeması (renk, beden, vb.)
const VariantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Varyant adı (Renk, Beden, vb.)
  value: { type: String, required: true }, // Varyant değeri (Kırmızı, XL, vb.)
  price: { type: Number, default: 0 }, // Ekstra fiyat
  stock: { type: Number, default: 0 }, // Bu varyant için stok
  sku: { type: String, unique: true } // Stok kodu
});

// Ürün özellikleri şeması
const SpecificationSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Özellik adı
  value: { type: String, required: true }, // Özellik değeri
  unit: { type: String }, // Birim (cm, kg, vb.)
  category: { type: String } // Özellik kategorisi
});

// AI öneri sistemi için ürün etiketleri
const TagSchema = new mongoose.Schema({
  name: { type: String, required: true },
  weight: { type: Number, default: 1 }, // AI algoritması için ağırlık
  type: { 
    type: String, 
    enum: ['category', 'style', 'occasion', 'season', 'trend'],
    default: 'category'
  }
});

// Ürün medya şeması (resim, video, 3D model)
const MediaSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['image', 'video', '360_view', '3d_model', 'ar_model'],
    required: true 
  },
  url: { type: String, required: true },
  thumbnail: { type: String },
  alt: { type: String },
  order: { type: Number, default: 0 },
  dimensions: {
    width: Number,
    height: Number
  },
  size: { type: Number }, // Dosya boyutu (bytes)
  isMain: { type: Boolean, default: false }
});

// Kullanıcı yorumları ve puanlaması
const ReviewSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  title: { type: String, maxlength: 100 },
  comment: { type: String, maxlength: 1000 },
  images: [{ type: String }], // Kullanıcı fotoğrafları
  verified: { type: Boolean, default: false }, // Satın alma doğrulaması
  helpful: { type: Number, default: 0 }, // Kaç kişi faydalı buldu
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Ana ürün şeması
const ProductSchema = new mongoose.Schema({
  // Temel bilgiler
  name: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 200,
    index: true
  },
  description: { 
    type: String, 
    required: true,
    maxlength: 2000
  },
  shortDescription: { 
    type: String, 
    maxlength: 500 
  },
  
  // Fiyat bilgileri
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  originalPrice: { 
    type: Number, 
    min: 0 
  }, // İndirim öncesi fiyat
  discountPercentage: { 
    type: Number, 
    min: 0, 
    max: 100,
    default: 0 
  },
  
  // Stok ve kategori
  stock: { 
    type: Number, 
    required: true, 
    min: 0,
    default: 0
  },
  category: { 
    type: String, 
    required: true,
    index: true
  },
  subCategory: { type: String },
  brand: { 
    type: String, 
    index: true 
  },
  
  // Ürün kodu ve tanımlayıcılar
  sku: { 
    type: String, 
    unique: true, 
    required: true 
  },
  barcode: { type: String },
  
  // Medya dosyaları (eski image alanını koruyoruz, ama media kullanmayı öneriyoruz)
  image: {
    type: String,
    default: ""
  },
  media: [MediaSchema],
  
  // Ürün varyantları
  variants: [VariantSchema],
  
  // Teknik özellikler
  specifications: [SpecificationSchema],
  
  // AI ve öneri sistemi
  tags: [TagSchema],
  aiScore: { 
    type: Number, 
    default: 0 
  }, // AI algoritması tarafından hesaplanan skor
  trendingScore: { 
    type: Number, 
    default: 0 
  },
  
  // Puanlama ve yorumlar
  reviews: [ReviewSchema],
  averageRating: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 5 
  },
  totalReviews: { 
    type: Number, 
    default: 0 
  },
  
  // Satış bilgileri
  salesCount: { 
    type: Number, 
    default: 0 
  },
  viewCount: { 
    type: Number, 
    default: 0 
  },
  
  // Durum ve görünürlük
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'out_of_stock', 'discontinued'],
    default: 'active'
  },
  isVisible: { 
    type: Boolean, 
    default: true 
  },
  isFeatured: { 
    type: Boolean, 
    default: false 
  },
  
  // Kargo ve teslimat
  weight: { type: Number }, // gram cinsinden
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number }
  },
  shippingInfo: {
    freeShipping: { type: Boolean, default: false },
    shippingCost: { type: Number, default: 0 },
    estimatedDelivery: { type: String } // "1-3 gün"
  },
  
  // 2040 özel özellikleri
  futureFeatures: {
    hasAR: { type: Boolean, default: false }, // Artırılmış Gerçeklik desteği
    has3D: { type: Boolean, default: false }, // 3D görüntüleme
    hasVoiceControl: { type: Boolean, default: false }, // Ses kontrolü
    smartCompatible: { type: Boolean, default: false }, // Akıllı ev uyumluluğu
    sustainabilityScore: { type: Number, min: 0, max: 100, default: 0 }, // Sürdürülebilirlik skoru
    carbonFootprint: { type: Number }, // Karbon ayak izi
    recyclingInfo: { type: String } // Geri dönüşüm bilgisi
  },
  
  // Meta bilgiler
  seoTitle: { type: String, maxlength: 60 },
  seoDescription: { type: String, maxlength: 160 },
  seoKeywords: [String],
  
  // Zaman damgaları
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  publishedAt: { type: Date },
  
  // Yaratıcı ve güncelleyici
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  updatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual alanlar
ProductSchema.virtual('discountAmount').get(function() {
  if (this.originalPrice && this.discountPercentage > 0) {
    return this.originalPrice - this.price;
  }
  return 0;
});

ProductSchema.virtual('isOnSale').get(function() {
  return this.discountPercentage > 0;
});

ProductSchema.virtual('mainImage').get(function() {
  const mainMedia = this.media.find(m => m.isMain && m.type === 'image');
  return mainMedia ? mainMedia.url : this.image || null;
});

// İndeksler - performans için kritik
ProductSchema.index({ name: 'text', description: 'text', brand: 'text' });
ProductSchema.index({ category: 1, subCategory: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ averageRating: -1 });
ProductSchema.index({ salesCount: -1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ status: 1, isVisible: 1 });
ProductSchema.index({ 'tags.name': 1 });

// Middleware'ler
ProductSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // İndirim yüzdesini otomatik hesapla
  if (this.originalPrice && this.price < this.originalPrice) {
    this.discountPercentage = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  
  // SEO başlığı yoksa ürün adından oluştur
  if (!this.seoTitle) {
    this.seoTitle = this.name.substring(0, 60);
  }
  
  // SKU yoksa otomatik oluştur
  if (!this.sku) {
    this.sku = 'SKU' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  
  next();
});

// Statik metodlar
ProductSchema.statics.findByCategory = function(category, limit = 10) {
  return this.find({ 
    category: category, 
    status: 'active', 
    isVisible: true 
  }).limit(limit);
};

ProductSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ 
    isFeatured: true, 
    status: 'active', 
    isVisible: true 
  }).limit(limit);
};

ProductSchema.statics.findByPriceRange = function(minPrice, maxPrice) {
  return this.find({ 
    price: { $gte: minPrice, $lte: maxPrice },
    status: 'active',
    isVisible: true
  });
};

// Instance metodları
ProductSchema.methods.updateStock = function(quantity) {
  this.stock += quantity;
  return this.save();
};

ProductSchema.methods.addReview = function(reviewData) {
  this.reviews.push(reviewData);
  this.totalReviews = this.reviews.length;
  this.averageRating = this.reviews.reduce((sum, review) => sum + review.rating, 0) / this.reviews.length;
  return this.save();
};

ProductSchema.methods.incrementView = function() {
  this.viewCount += 1;
  return this.save();
};

module.exports = mongoose.model("Product", ProductSchema);