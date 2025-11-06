const { Order, User } = require("../models");
const {
  createOrderSchema,
  updateOrderSchema,
} = require("../validations/orderValidation");

// ✅ Get semua order (dengan populate user & sorting)
const getOrder = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customerId", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get order berdasarkan ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "customerId",
      "name email role"
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Create order baru
const createOrder = async (req, res) => {
  try {
    const { error } = createOrderSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const { customerId, items, deliveryAddress } = req.body;

    // Hitung total otomatis
    const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);

    const order = new Order({
      customerId,
      items,
      deliveryAddress,
      total,
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update order
const updateOrder = async (req, res) => {
  try {
    const { error } = updateOrderSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const { items, status, deliveryAddress } = req.body;

    // Jika item diubah, hitung ulang total
    if (items && items.length > 0) {
      order.items = items;
      order.total = items.reduce((sum, item) => sum + item.qty * item.price, 0);
    }

    if (status) order.status = status;
    if (deliveryAddress) order.deliveryAddress = deliveryAddress;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getOrder,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
