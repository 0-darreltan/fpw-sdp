// controllers/cartController.js

const { Cart, Product } = require("../models");

// ✅ Get keranjang milik user yang sedang login
const getCart = async (req, res) => {
  try {
    // asumsikan req.user.id dari middleware auth
    const cart = await Cart.findOne({ user: req.user.id }).populate({
      path: "items.productId",
      select: "name price image unit", // Ambil data produk terbaru
    });

    if (!cart) {
      // Jika user belum punya keranjang, kirim keranjang kosong
      return res.status(200).json({ success: true, data: { items: [] } });
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Tambah/Update item di keranjang
const upsertItemInCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Pastikan produk ada
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    // Cari keranjang user, atau buat jika belum ada
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Cek apakah produk sudah ada di keranjang
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      // Jika ada, update jumlahnya
      cart.items[itemIndex].quantity = quantity;
    } else {
      // Jika tidak ada, tambahkan item baru
      cart.items.push({ productId, quantity });
    }

    // Hapus item jika quantity <= 0
    cart.items = cart.items.filter((item) => item.quantity > 0);

    await cart.save();

    // Populate produk sebelum mengirim respons
    const updatedCart = await cart.populate({
      path: "items.productId",
      select: "name price image unit",
    });

    res
      .status(200)
      .json({ success: true, message: "Cart updated.", data: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ [BARU] Hapus satu item dari keranjang
const deleteItemFromCart = async (req, res) => {
  try {
    const { productId } = req.params; // Ambil productId dari parameter URL
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found." });
    }

    // Cek apakah item ada di keranjang sebelum mencoba menghapus
    const itemExists = cart.items.some(
      (item) => item.productId.toString() === productId
    );
    if (!itemExists) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart." });
    }

    // Gunakan operator $pull untuk menghapus item dari array secara efisien
    const updatedCart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { productId: productId } } },
      { new: true } // Opsi 'new: true' untuk mendapatkan dokumen yang sudah diupdate
    ).populate({
      path: "items.productId",
      select: "name price image unit",
    });

    res.status(200).json({
      success: true,
      message: "Item removed from cart.",
      data: updatedCart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Kosongkan keranjang
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [] },
      { new: true }
    );

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "Cart cleared.", data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCart,
  upsertItemInCart,
  deleteItemFromCart, // <-- Jangan lupa diekspor
  clearCart,
};
