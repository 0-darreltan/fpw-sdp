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

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

    const { name, category, price, unit, stock, description, status, metadata } =
      req.body;

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

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
    if (req.user && req.body.stock !== undefined && oldProduct.stock !== req.body.stock) {
      const stockDiff = req.body.stock - oldProduct.stock;
      const isIncrease = stockDiff > 0;
      
      await ActivityLog.create({
        type: "stock_reduced",
        title: isIncrease ? "Stok Material Ditambah" : "Stok Material Berkurang",
        description: `${req.user.name} ${isIncrease ? 'menambah' : 'mengurangi'} stok "${product.name}" sebanyak ${Math.abs(stockDiff)} ${product.unit}. Stok sekarang: ${product.stock} ${product.unit} (sebelumnya: ${oldProduct.stock} ${product.unit})`,
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

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
