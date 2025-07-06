// productController.js - 2040 E-Ticaret Gelişmiş Ürün Controller'ı
// AI destekli, modern e-ticaret özellikleri ile donatılmıştır

const Product = require("../models/Product");
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

// Multer konfigürasyonu - dosya yükleme
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyaları yükleyebilirsiniz!'), false);
    }
  }
});

// Resim işleme fonksiyonu
const processImage = async (buffer, filename) => {
  const sizes = [
    { suffix: '_thumb', width: 150, height: 150 },
    { suffix: '_medium', width: 500, height: 500 },
    { suffix: '_large', width: 1000, height: 1000 }
  ];

  const results = [];
  
  for (const size of sizes) {
    const processedBuffer = await sharp(buffer)
      .resize(size.width, size.height, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 })
      .toBuffer();

    const processedFilename = filename.replace('.jpg', `${size.suffix}.jpg`);
    const filepath = path.join(__dirname, '../uploads/products', processedFilename);
    
    await fs.writeFile(filepath, processedBuffer);
    results.push({
      size: size.suffix.replace('_', ''),
      url: `/uploads/products/${processedFilename}`,
      width: size.width,
      height: size.height
    });
  }

  return results;
};

// Gelişmiş ürün listeleme (GET /api/products)
exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Filtreleme parametreleri
    const {
      category,
      subCategory,
      brand,
      minPrice,
      maxPrice,
      inStock,
      featured,
      onSale,
      rating,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search
    } = req.query;

    // Query objesi oluştur
    let query = { status: 'active', isVisible: true };

    // Filtreleri uygula
    if (category) query.category = new RegExp(category, 'i');
    if (subCategory) query.subCategory = new RegExp(subCategory, 'i');
    if (brand) query.brand = new RegExp(brand, 'i');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (inStock === 'true') query.stock = { $gt: 0 };
    if (featured === 'true') query.isFeatured = true;
    if (onSale === 'true') query.discountPercentage = { $gt: 0 };
    if (rating) query.averageRating = { $gte: parseFloat(rating) };

    // Arama
    if (search) {
      query.$text = { $search: search };
    }

    // Sıralama objesi
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Ürünleri getir
    const products = await Product.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name')
      .lean();

    // Toplam sayı
    const total = await Product.countDocuments(query);

    // Kategoriler listesi
    const categories = await Product.distinct('category', { status: 'active', isVisible: true });
    const brands = await Product.distinct('brand', { status: 'active', isVisible: true });

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
          limit
        },
        filters: {
          categories,
          brands,
          priceRange: {
            min: await Product.findOne({}, 'price').sort({ price: 1 }),
            max: await Product.findOne({}, 'price').sort({ price: -1 })
          }
        },
        applied: {
          category,
          brand,
          minPrice,
          maxPrice,
          search,
          sortBy,
          sortOrder
        }
      }
    });
  } catch (err) {
    console.error('Ürünler getirilirken hata:', err);
    res.status(500).json({ 
      success: false, 
      error: "Ürünler alınamadı",
      message: err.message 
    });
  }
};

// Ürün detayı getir (GET /api/products/:id)
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query; // Kullanıcı ID'si (öneri sistemi için)

    const product = await Product.findById(id)
      .populate('reviews.user', 'name profile.avatar')
      .populate('createdBy', 'name');

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: "Ürün bulunamadı" 
      });
    }

    // Görüntülenme sayısını artır
    product.viewCount += 1;
    await product.save();

    // Benzer ürünler
    const similarProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: 'active',
      isVisible: true
    })
    .limit(6)
    .select('name price image averageRating discountPercentage');

    // AI tabanlı öneriler (basit algoritma)
    const recommendations = await Product.find({
      $or: [
        { category: product.category },
        { brand: product.brand },
        { 'tags.name': { $in: product.tags.map(tag => tag.name) } }
      ],
      _id: { $ne: product._id },
      status: 'active',
      isVisible: true
    })
    .sort({ aiScore: -1, salesCount: -1 })
    .limit(8)
    .select('name price image averageRating discountPercentage');

    res.json({
      success: true,
      data: {
        product,
        related: {
          similar: similarProducts,
          recommended: recommendations
        },
        analytics: {
          viewCount: product.viewCount,
          salesCount: product.salesCount,
          averageRating: product.averageRating,
          totalReviews: product.totalReviews
        }
      }
    });
  } catch (err) {
    console.error('Ürün detayı getirilirken hata:', err);
    res.status(500).json({ 
      success: false, 
      error: "Ürün detayları alınamadı",
      message: err.message 
    });
  }
};

// Yeni ürün oluştur (POST /api/products)
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      originalPrice,
      stock,
      category,
      subCategory,
      brand,
      specifications,
      tags,
      futureFeatures,
      shippingInfo,
      seoTitle,
      seoDescription,
      seoKeywords
    } = req.body;

    // Zorunlu alanları kontrol et
    if (!name || !description || !price || !category) {
      return res.status(400).json({ 
        success: false, 
        error: "Ürün adı, açıklama, fiyat ve kategori zorunludur!" 
      });
    }

    // SKU oluştur
    const sku = `SKU${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    const productData = {
      name,
      description,
      shortDescription,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      stock: parseInt(stock) || 0,
      category,
      subCategory,
      brand,
      sku,
      specifications: specifications ? JSON.parse(specifications) : [],
      tags: tags ? JSON.parse(tags) : [],
      futureFeatures: futureFeatures ? JSON.parse(futureFeatures) : {},
      shippingInfo: shippingInfo ? JSON.parse(shippingInfo) : {},
      seoTitle,
      seoDescription,
      seoKeywords: seoKeywords ? seoKeywords.split(',').map(k => k.trim()) : [],
      createdBy: req.user?.userId
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: "Ürün başarıyla oluşturuldu",
      data: product
    });
  } catch (err) {
    console.error('Ürün oluşturulurken hata:', err);
    res.status(500).json({ 
      success: false, 
      error: "Ürün eklenirken hata oluştu",
      message: err.message 
    });
  }
};

// Ürün güncelle (PUT /api/products/:id)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Güncelleme bilgisi
    updateData.updatedBy = req.user?.userId;
    updateData.updatedAt = new Date();

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: "Ürün bulunamadı" 
      });
    }

    res.json({
      success: true,
      message: "Ürün başarıyla güncellendi",
      data: product
    });
  } catch (err) {
    console.error('Ürün güncellenirken hata:', err);
    res.status(500).json({ 
      success: false, 
      error: "Ürün güncellenirken hata oluştu",
      message: err.message 
    });
  }
};

// Ürün sil (DELETE /api/products/:id)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: "Ürün bulunamadı" 
      });
    }

    res.json({ 
      success: true,
      message: "Ürün başarıyla silindi",
      data: { deletedId: id }
    });
  } catch (err) {
    console.error('Ürün silinirken hata:', err);
    res.status(500).json({ 
      success: false, 
      error: "Ürün silinirken hata oluştu",
      message: err.message 
    });
  }
};

// Öne çıkan ürünler (GET /api/products/featured)
exports.getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    
    const products = await Product.find({
      isFeatured: true,
      status: 'active',
      isVisible: true
    })
    .sort({ trendingScore: -1, salesCount: -1 })
    .limit(limit)
    .select('name price image averageRating discountPercentage salesCount');

    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (err) {
    console.error('Öne çıkan ürünler getirilirken hata:', err);
    res.status(500).json({ 
      success: false, 
      error: "Öne çıkan ürünler alınamadı" 
    });
  }
};

// Kategoriye göre ürünler (GET /api/products/category/:category)
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const products = await Product.find({
      category: new RegExp(category, 'i'),
      status: 'active',
      isVisible: true
    })
    .sort({ salesCount: -1, averageRating: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Product.countDocuments({
      category: new RegExp(category, 'i'),
      status: 'active',
      isVisible: true
    });

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        },
        category
      }
    });
  } catch (err) {
    console.error('Kategori ürünleri getirilirken hata:', err);
    res.status(500).json({ 
      success: false, 
      error: "Kategori ürünleri alınamadı" 
    });
  }
};

// Ürün arama (GET /api/products/search)
exports.searchProducts = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, sortBy = 'relevance' } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ 
        success: false, 
        error: "Arama terimi en az 2 karakter olmalıdır" 
      });
    }

    // Arama query'si
    let query = {
      $text: { $search: q },
      status: 'active',
      isVisible: true
    };

    // Filtreler
    if (category) query.category = new RegExp(category, 'i');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Sıralama
    let sortObj = {};
    switch (sortBy) {
      case 'price_low':
        sortObj = { price: 1 };
        break;
      case 'price_high':
        sortObj = { price: -1 };
        break;
      case 'rating':
        sortObj = { averageRating: -1 };
        break;
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      default:
        sortObj = { score: { $meta: 'textScore' } };
    }

    const products = await Product.find(query, { score: { $meta: 'textScore' } })
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        query: q,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (err) {
    console.error('Ürün arama hatası:', err);
    res.status(500).json({ 
      success: false, 
      error: "Arama yapılırken hata oluştu" 
    });
  }
};

// Ürün yorumu ekleme (POST /api/products/:id/reviews)
exports.addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.user.userId;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        error: "Geçerli bir puan (1-5) vermelisiniz" 
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: "Ürün bulunamadı" 
      });
    }

    // Kullanıcı daha önce yorum yapmış mı kontrol et
    const existingReview = product.reviews.find(
      review => review.user.toString() === userId.toString()
    );

    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        error: "Bu ürün için zaten yorum yapmışsınız" 
      });
    }

    // Yeni yorum ekle
    const newReview = {
      user: userId,
      rating: parseInt(rating),
      title,
      comment
    };

    product.reviews.push(newReview);
    
    // Ortalama puanı güncelle
    product.totalReviews = product.reviews.length;
    product.averageRating = product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.totalReviews;

    await product.save();

    // Eklenen yorumu kullanıcı bilgileri ile döndür
    const populatedProduct = await Product.findById(id)
      .populate('reviews.user', 'name profile.avatar')
      .select('reviews averageRating totalReviews');

    const addedReview = populatedProduct.reviews[populatedProduct.reviews.length - 1];

    res.status(201).json({
      success: true,
      message: "Yorum başarıyla eklendi",
      data: {
        review: addedReview,
        newAverageRating: product.averageRating,
        totalReviews: product.totalReviews
      }
    });
  } catch (err) {
    console.error('Yorum eklenirken hata:', err);
    res.status(500).json({ 
      success: false, 
      error: "Yorum eklenirken hata oluştu" 
    });
  }
};

// İstatistikler (GET /api/products/stats)
exports.getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: 'active' });
    const outOfStock = await Product.countDocuments({ stock: 0 });
    const featuredProducts = await Product.countDocuments({ isFeatured: true });

    // Kategori dağılımı
    const categoryStats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // En çok satan ürünler
    const bestSellers = await Product.find({ status: 'active' })
      .sort({ salesCount: -1 })
      .limit(10)
      .select('name salesCount price category');

    // Ortalama fiyat
    const priceStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          averagePrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          activeProducts,
          outOfStock,
          featuredProducts
        },
        categories: categoryStats,
        bestSellers,
        pricing: priceStats[0] || { averagePrice: 0, minPrice: 0, maxPrice: 0 }
      }
    });
  } catch (err) {
    console.error('Ürün istatistikleri getirilirken hata:', err);
    res.status(500).json({ 
      success: false, 
      error: "İstatistikler alınamadı" 
    });
  }
};

// Resim yükleme middleware'i
exports.uploadMiddleware = upload.array('images', 10);

module.exports = {
  getProducts: exports.getProducts,
  getProductById: exports.getProductById,
  createProduct: exports.createProduct,
  updateProduct: exports.updateProduct,
  deleteProduct: exports.deleteProduct,
  getFeaturedProducts: exports.getFeaturedProducts,
  getProductsByCategory: exports.getProductsByCategory,
  searchProducts: exports.searchProducts,
  addReview: exports.addReview,
  getProductStats: exports.getProductStats,
  uploadMiddleware: exports.uploadMiddleware
};