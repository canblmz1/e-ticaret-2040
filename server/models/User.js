// User.js - 2040 E-Ticaret Gelişmiş Kullanıcı Modeli
// Geleceğin dijital kimlik sistemi

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Adres şeması
const AddressSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['home', 'work', 'billing', 'shipping'],
    default: 'home'
  },
  title: { type: String, required: true }, // "Ev Adresim", "İş Yerim"
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  company: { type: String },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: 'Turkey' },
  phone: { type: String },
  isDefault: { type: Boolean, default: false },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  deliveryInstructions: { type: String }
});

// Ödeme yöntemi şeması
const PaymentMethodSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['credit_card', 'debit_card', 'digital_wallet', 'crypto', 'bank_transfer'],
    required: true
  },
  title: { type: String, required: true }, // "Ana Kartım", "İş Kartı"
  last4: { type: String }, // Son 4 hane
  brand: { type: String }, // Visa, Mastercard, vb.
  expiryMonth: { type: Number },
  expiryYear: { type: Number },
  holderName: { type: String },
  isDefault: { type: Boolean, default: false },
  token: { type: String }, // Ödeme gateway token'ı
  isActive: { type: Boolean, default: true },
  addedAt: { type: Date, default: Date.now }
});

// Kullanıcı tercihleri şeması
const PreferencesSchema = new mongoose.Schema({
  language: { type: String, default: 'tr' },
  currency: { type: String, default: 'TRY' },
  timezone: { type: String, default: 'Europe/Istanbul' },
  
  // Bildirim tercihleri
  notifications: {
    email: {
      marketing: { type: Boolean, default: true },
      orderUpdates: { type: Boolean, default: true },
      priceAlerts: { type: Boolean, default: false },
      newsletter: { type: Boolean, default: false }
    },
    sms: {
      orderUpdates: { type: Boolean, default: true },
      deliveryUpdates: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false }
    },
    push: {
      enabled: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
      orderUpdates: { type: Boolean, default: true }
    }
  },
  
  // Alışveriş tercihleri
  shopping: {
    defaultCategory: { type: String },
    priceRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 10000 }
    },
    brands: [String], // Favori markalar
    size: {
      clothing: { type: String },
      shoe: { type: String }
    }
  },
  
  // AI ve kişiselleştirme
  ai: {
    enablePersonalization: { type: Boolean, default: true },
    enableVoiceControl: { type: Boolean, default: false },
    enableARFeatures: { type: Boolean, default: true },
    dataCollection: { type: Boolean, default: true }
  },
  
  // Gizlilik tercihleri
  privacy: {
    profileVisibility: { 
      type: String, 
      enum: ['public', 'friends', 'private'],
      default: 'private'
    },
    shareActivityWithFriends: { type: Boolean, default: false },
    allowDataAnalytics: { type: Boolean, default: true }
  }
});

// Sosyal medya profilleri
const SocialProfileSchema = new mongoose.Schema({
  platform: { 
    type: String, 
    enum: ['facebook', 'google', 'twitter', 'instagram', 'linkedin'],
    required: true
  },
  socialId: { type: String, required: true },
  username: { type: String },
  profileUrl: { type: String },
  connectedAt: { type: Date, default: Date.now }
});

// Güvenlik logları
const SecurityLogSchema = new mongoose.Schema({
  action: { 
    type: String, 
    enum: ['login', 'logout', 'password_change', 'profile_update', 'suspicious_activity'],
    required: true
  },
  ip: { type: String },
  userAgent: { type: String },
  location: {
    country: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  timestamp: { type: Date, default: Date.now },
  success: { type: Boolean, default: true },
  details: { type: String }
});

// Ana kullanıcı şeması
const UserSchema = new mongoose.Schema({
  // Temel bilgiler
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // Profil detayları
  profile: {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    avatar: { type: String }, // Profil fotoğrafı URL'i
    bio: { type: String, maxlength: 500 },
    phone: { type: String },
    dateOfBirth: { type: Date },
    gender: { 
      type: String, 
      enum: ['male', 'female', 'other', 'prefer_not_to_say']
    },
    nationality: { type: String },
    occupation: { type: String }
  },
  
  // Roller ve yetkiler
  role: { 
    type: String, 
    enum: ['customer', 'admin', 'vendor', 'moderator', 'super_admin'],
    default: 'customer'
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  permissions: [{
    resource: String, // 'products', 'orders', 'users'
    actions: [String] // 'read', 'write', 'delete'
  }],
  
  // Hesap durumu
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'suspended', 'pending_verification'],
    default: 'pending_verification'
  },
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  isTwoFactorEnabled: { type: Boolean, default: false },
  
  // Doğrulama tokenları
  verification: {
    emailToken: { type: String },
    emailTokenExpires: { type: Date },
    phoneToken: { type: String },
    phoneTokenExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
  },
  
  // Adresler ve ödeme yöntemleri
  addresses: [AddressSchema],
  paymentMethods: [PaymentMethodSchema],
  
  // Kullanıcı tercihleri
  preferences: { type: PreferencesSchema, default: () => ({}) },
  
  // Sosyal medya bağlantıları
  socialProfiles: [SocialProfileSchema],
  
  // Alışveriş geçmişi ve istatistikler
  stats: {
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    averageOrderValue: { type: Number, default: 0 },
    favoriteCategory: { type: String },
    loyaltyPoints: { type: Number, default: 0 },
    membershipLevel: { 
      type: String, 
      enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
      default: 'bronze'
    }
  },
  
  // Wishlist ve favori ürünler
  wishlist: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    addedAt: { type: Date, default: Date.now },
    priceAlert: { type: Boolean, default: false }
  }],
  
  // Takip edilen mağazalar/markalar
  following: {
    brands: [String],
    categories: [String],
    vendors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  
  // Güvenlik
  securityLogs: [SecurityLogSchema],
  lastLogin: { type: Date },
  lastActive: { type: Date },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  
  // AI ve kişiselleştirme verileri
  aiData: {
    behaviorProfile: { type: Map, of: mongoose.Schema.Types.Mixed },
    recommendations: [{
      type: { type: String, enum: ['product', 'category', 'brand'] },
      item: { type: String },
      score: { type: Number },
      reason: { type: String },
      createdAt: { type: Date, default: Date.now }
    }],
    searchHistory: [{
      query: String,
      timestamp: { type: Date, default: Date.now },
      category: String
    }]
  },
  
  // 2040 özel özellikleri
  futureFeatures: {
    voiceProfile: {
      enabled: { type: Boolean, default: false },
      voiceId: { type: String },
      language: { type: String, default: 'tr-TR' }
    },
    biometrics: {
      fingerprintEnabled: { type: Boolean, default: false },
      faceIdEnabled: { type: Boolean, default: false },
      retinaEnabled: { type: Boolean, default: false }
    },
    digitalIdentity: {
      blockchainAddress: { type: String },
      nftAvatar: { type: String },
      digitalWalletAddress: { type: String },
      metaverseProfile: { type: String }
    },
    sustainability: {
      carbonFootprint: { type: Number, default: 0 },
      ecoScore: { type: Number, default: 50 },
      recyclingPreference: { type: Boolean, default: true },
      sustainableBrands: [String]
    }
  },
  
  // Meta bilgiler
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastProfileUpdate: { type: Date },
  
  // Tracking
  source: { 
    type: String, 
    enum: ['web', 'mobile', 'social', 'referral', 'advertisement'],
    default: 'web'
  },
  referralCode: { type: String, unique: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.verification;
      delete ret.securityLogs;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Virtual alanlar
UserSchema.virtual('fullName').get(function() {
  if (this.profile.firstName && this.profile.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
  return this.name;
});

UserSchema.virtual('isLocked').get(function() {
  return this.lockUntil && this.lockUntil > Date.now();
});

UserSchema.virtual('membershipBadge').get(function() {
  const level = this.stats.membershipLevel;
  const badges = {
    bronze: '🥉',
    silver: '🥈',
    gold: '🥇',
    platinum: '💎',
    diamond: '👑'
  };
  return badges[level] || '🥉';
});

// İndeksler
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ 'profile.phone': 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ referralCode: 1 }, { unique: true, sparse: true });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ lastActive: -1 });

// Middleware'ler
UserSchema.pre('save', async function(next) {
  // Şifre hashleme
  if (this.isModified('password') && !this.password.startsWith('$2a$')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  
  // Referral kodu oluşturma
  if (!this.referralCode) {
    this.referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
  }
  
  // İsim alanlarını güncelle
  if (this.profile.firstName && this.profile.lastName && !this.name) {
    this.name = `${this.profile.firstName} ${this.profile.lastName}`;
  }
  
  // Admin rolü senkronizasyonu
  this.isAdmin = this.role === 'admin' || this.role === 'super_admin';
  
  this.updatedAt = new Date();
  next();
});

// Statik metodlar
UserSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

UserSchema.statics.findActiveUsers = function() {
  return this.find({ status: 'active' });
};

UserSchema.statics.findByMembershipLevel = function(level) {
  return this.find({ 'stats.membershipLevel': level });
};

// Instance metodları
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generatePasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.verification.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.verification.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 dakika
  return resetToken;
};

UserSchema.methods.generateEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  this.verification.emailToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
  this.verification.emailTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 saat
  return verificationToken;
};

UserSchema.methods.updateLoginStats = function(ip, userAgent) {
  this.lastLogin = new Date();
  this.lastActive = new Date();
  this.loginAttempts = 0;
  
  this.securityLogs.push({
    action: 'login',
    ip: ip,
    userAgent: userAgent,
    success: true
  });
  
  // Son 50 log'u tut
  if (this.securityLogs.length > 50) {
    this.securityLogs = this.securityLogs.slice(-50);
  }
  
  return this.save();
};

UserSchema.methods.addToWishlist = function(productId) {
  const exists = this.wishlist.find(item => item.product.toString() === productId.toString());
  if (!exists) {
    this.wishlist.push({ product: productId });
    return this.save();
  }
  return this;
};

UserSchema.methods.removeFromWishlist = function(productId) {
  this.wishlist = this.wishlist.filter(item => item.product.toString() !== productId.toString());
  return this.save();
};

UserSchema.methods.updateMembershipLevel = function() {
  const totalSpent = this.stats.totalSpent;
  let newLevel = 'bronze';
  
  if (totalSpent >= 50000) newLevel = 'diamond';
  else if (totalSpent >= 20000) newLevel = 'platinum';
  else if (totalSpent >= 10000) newLevel = 'gold';
  else if (totalSpent >= 5000) newLevel = 'silver';
  
  this.stats.membershipLevel = newLevel;
  return this.save();
};

module.exports = mongoose.model("User", UserSchema);