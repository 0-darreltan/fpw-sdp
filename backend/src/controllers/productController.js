const { Product, ActivityLog } = require("../models");
const {
  createProductSchema,
  updateProductSchema,
} = require("../validations/productValidation");

// ✅ GET semua produk (bisa ditambah search dan filter)
const getProduct = async (req, res) => {
  try {
    const { search, category } = req.query;
    const query = {};

    if (search) query.$text = { $search: search };
    if (category) query.category = category;

    const products = await Product.find(query).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET produk berdasarkan ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ CREATE produk baru
const createProduct = async (req, res) => {
  try {
    const { error } = createProductSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const {
      name,
      category,
      price,
      unit,
      stock,
      description,
      status,
      metadata,
    } = req.body;

    const product = new Product({
      name,
      category,
      price,
      unit,
      stock,
      description,
      status: status || "active",
      metadata,
    });

    await product.save();

    // Create activity log for new product
    if (req.user) {
      await ActivityLog.create({
        type: "product_created",
        title: "Produk Baru Ditambahkan",
        description: `${req.user.name} menambahkan produk baru "${name}" dengan stok ${stock} ${unit}`,
        userId: req.user._id,
        userName: req.user.name,
        userRole: req.user.role,
        productId: product._id,
        icon: "📦",
        metadata: {
          productName: name,
          category,
          stock,
          unit,
          price,
        },
      });
    }

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ UPDATE produk
const updateProduct = async (req, res) => {
  try {
    const { error } = updateProductSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const oldProduct = await Product.findById(req.params.id);
    if (!oldProduct)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // Log activity if stock changed
    if (
      req.user &&
      req.body.stock !== undefined &&
      oldProduct.stock !== req.body.stock
    ) {
      const stockDiff = req.body.stock - oldProduct.stock;
      const isIncrease = stockDiff > 0;

      await ActivityLog.create({
        type: "stock_reduced",
        title: isIncrease
          ? "Stok Material Ditambah"
          : "Stok Material Berkurang",
        description: `${req.user.name} ${
          isIncrease ? "menambah" : "mengurangi"
        } stok "${product.name}" sebanyak ${Math.abs(stockDiff)} ${
          product.unit
        }. Stok sekarang: ${product.stock} ${product.unit} (sebelumnya: ${
          oldProduct.stock
        } ${product.unit})`,
        userId: req.user._id,
        userName: req.user.name,
        userRole: req.user.role,
        productId: product._id,
        icon: isIncrease ? "📈" : "📉",
        metadata: {
          productName: product.name,
          previousStock: oldProduct.stock,
          newStock: product.stock,
          stockDiff,
          unit: product.unit,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ DELETE produk
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET inventory report (Admin only)
const getInventoryReport = async (req, res) => {
  try {
    const { category, lowStock } = req.query;

    // Build query filter
    const filter = {};
    if (category) filter.category = category;

    // Get all products
    const products = await Product.find(filter).sort({ createdAt: -1 });

    // Calculate statistics
    const stats = {
      totalProducts: products.length,
      totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
      totalStock: products.reduce((sum, p) => sum + p.stock, 0),
      byCategory: {},
      lowStockItems: products.filter(p => p.stock < 10).length,
      outOfStockItems: products.filter(p => p.stock === 0).length,
    };

    // Group by category
    products.forEach(product => {
      const cat = product.category || "Uncategorized";
      if (!stats.byCategory[cat]) {
        stats.byCategory[cat] = {
          count: 0,
          totalStock: 0,
          totalValue: 0,
        };
      }
      stats.byCategory[cat].count++;
      stats.byCategory[cat].totalStock += product.stock;
      stats.byCategory[cat].totalValue += product.price * product.stock;
    });

    // Filter low stock if requested
    let productsToReturn = products;
    if (lowStock === "true") {
      productsToReturn = products.filter(p => p.stock < 10);
    }

    return res.status(200).json({
      success: true,
      data: {
        products: productsToReturn,
        stats,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Low Stock Report
const getLowStockReport = async (req, res) => {
  try {
    const { threshold = 10, category } = req.query;
    const stockThreshold = parseInt(threshold);

    // Build query
    const query = {};
    if (category) query.category = category;

    // Fetch all products
    const products = await Product.find(query).sort({ stock: 1 }); // Sort by stock ascending

    // Categorize products by stock level
    const criticalStock = []; // stock = 0
    const veryLowStock = []; // 0 < stock <= threshold/4
    const lowStock = []; // threshold/4 < stock <= threshold/2
    const moderateLowStock = []; // threshold/2 < stock <= threshold

    products.forEach(product => {
      if (product.stock === 0) {
        criticalStock.push({
          ...product.toObject(),
          status: "CRITICAL",
          urgency: "IMMEDIATE",
          daysUntilEmpty: 0,
        });
      } else if (product.stock <= stockThreshold / 4) {
        veryLowStock.push({
          ...product.toObject(),
          status: "VERY_LOW",
          urgency: "URGENT",
          daysUntilEmpty: Math.ceil(product.stock / 2), // Assuming 2 units sold per day
        });
      } else if (product.stock <= stockThreshold / 2) {
        lowStock.push({
          ...product.toObject(),
          status: "LOW",
          urgency: "HIGH",
          daysUntilEmpty: Math.ceil(product.stock / 2),
        });
      } else if (product.stock <= stockThreshold) {
        moderateLowStock.push({
          ...product.toObject(),
          status: "MODERATE_LOW",
          urgency: "MEDIUM",
          daysUntilEmpty: Math.ceil(product.stock / 2),
        });
      }
    });

    // Combine all low stock items
    const allLowStockItems = [
      ...criticalStock,
      ...veryLowStock,
      ...lowStock,
      ...moderateLowStock,
    ];

    // Calculate statistics
    const stats = {
      totalLowStockItems: allLowStockItems.length,
      criticalCount: criticalStock.length,
      veryLowCount: veryLowStock.length,
      lowCount: lowStock.length,
      moderateLowCount: moderateLowStock.length,
      totalValue: allLowStockItems.reduce(
        (sum, p) => sum + p.price * p.stock,
        0
      ),
      estimatedRestockValue: allLowStockItems.reduce(
        (sum, p) => sum + p.price * (stockThreshold - p.stock),
        0
      ),
      byCategory: {},
    };

    // Group by category
    allLowStockItems.forEach(product => {
      const cat = product.category || "Uncategorized";
      if (!stats.byCategory[cat]) {
        stats.byCategory[cat] = {
          count: 0,
          criticalCount: 0,
          veryLowCount: 0,
          lowCount: 0,
          moderateLowCount: 0,
        };
      }
      stats.byCategory[cat].count++;
      if (product.status === "CRITICAL") stats.byCategory[cat].criticalCount++;
      if (product.status === "VERY_LOW") stats.byCategory[cat].veryLowCount++;
      if (product.status === "LOW") stats.byCategory[cat].lowCount++;
      if (product.status === "MODERATE_LOW") stats.byCategory[cat].moderateLowCount++;
    });

    return res.status(200).json({
      success: true,
      data: {
        critical: criticalStock,
        veryLow: veryLowStock,
        low: lowStock,
        moderateLow: moderateLowStock,
        allItems: allLowStockItems,
        stats,
        threshold: stockThreshold,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getInventoryReport,
  getLowStockReport,
};
