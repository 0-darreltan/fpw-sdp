const { Order, User, Checkout } = require("../models");
const {
  createOrderSchema,
  updateOrderSchema,
} = require("../validations/orderValidation");

// ✅ Get semua order (dengan populate user & checkout & sorting)
const getOrder = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customerId", "name email role")
      .populate("checkoutId")
      .sort({ createdAt: -1 });

    console.log(orders);
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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

    return res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get sales report (Admin only)
const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, orderType, status } = req.query;

    // Build query filter
    const filter = {};

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    if (orderType) filter.orderType = orderType;
    if (status) filter.status = status;

    // Get orders with populated data
    const orders = await Order.find(filter)
      .populate("customerId", "name email")
      .populate("checkoutId")
      .sort({ createdAt: -1 });

    // Calculate summary statistics
    const summary = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0
      ),
      ordersByType: {
        PROJECT: orders.filter((o) => o.orderType === "PROJECT").length,
        MATERIAL_PURCHASE: orders.filter(
          (o) => o.orderType === "MATERIAL_PURCHASE"
        ).length,
      },
      ordersByStatus: {},
      revenueByType: {
        PROJECT: orders
          .filter((o) => o.orderType === "PROJECT")
          .reduce((sum, order) => sum + (order.totalAmount || 0), 0),
        MATERIAL_PURCHASE: orders
          .filter((o) => o.orderType === "MATERIAL_PURCHASE")
          .reduce((sum, order) => sum + (order.totalAmount || 0), 0),
      },
    };

    // Count orders by status
    const statuses = [
      "payment_confirmed",
      "processing",
      "shipping",
      "completed",
      "cancelled",
    ];
    statuses.forEach((status) => {
      summary.ordersByStatus[status] = orders.filter(
        (o) => o.status === status
      ).length;
    });

    return res.status(200).json({
      success: true,
      data: {
        orders,
        summary,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get order history for logged in user
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id; // Dari authMiddleware
    const { status, orderType, limit = 50 } = req.query;

    // Build query filter
    const filter = { customerId: userId };

    if (status) filter.status = status;
    if (orderType) filter.orderType = orderType;

    // Get user's orders with checkout details
    const orders = await Order.find(filter)
      .populate("checkoutId")
      .populate("rabId")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get outgoing inventory report (Admin only)
const getOutgoingInventoryReport = async (req, res) => {
  try {
    const { startDate, endDate, orderType } = req.query;

    // Build query filter - only completed/confirmed orders
    const filter = {
      status: {
        $in: ["payment_confirmed", "processing", "shipping", "completed"],
      },
    };

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    if (orderType) filter.orderType = orderType;

    // Get orders with checkout details
    const orders = await Order.find(filter)
      .populate({
        path: "checkoutId",
        select: "items subtotal shippingCost discount total",
      })
      .populate("customerId", "name email")
      .sort({ createdAt: -1 });

    // Aggregate products sold
    const productsSold = {};
    let totalItemsSold = 0;
    let totalRevenue = 0;

    orders.forEach((order) => {
      if (order.checkoutId && order.checkoutId.items) {
        order.checkoutId.items.forEach((item) => {
          if (item.productId) {
            const productId = item.productId.toString();
            const productName = item.productName || "Unknown Product";
            const quantity = item.quantity || 0;
            const price = item.priceAtCheckout || 0;
            const total = quantity * price;

            if (!productsSold[productId]) {
              productsSold[productId] = {
                productId,
                productName,
                totalQuantity: 0,
                totalRevenue: 0,
                unit: item.unit || "pcs",
                orderCount: 0,
              };
            }

            productsSold[productId].totalQuantity += quantity;
            productsSold[productId].totalRevenue += total;
            productsSold[productId].orderCount += 1;
            totalItemsSold += quantity;
          }
        });
        totalRevenue += order.totalAmount || 0;
      }
    });

    // Convert to array and sort by quantity
    const productList = Object.values(productsSold).sort(
      (a, b) => b.totalQuantity - a.totalQuantity
    );

    // Calculate statistics
    const stats = {
      totalOrders: orders.length,
      totalItemsSold,
      totalRevenue,
      uniqueProducts: productList.length,
      topSellingProduct: productList[0] || null,
    };

    return res.status(200).json({
      success: true,
      data: {
        products: productList,
        orders,
        stats,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Customer Loyalty Report
const getCustomerLoyaltyReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build query filter
    const query = { status: { $in: ["COMPLETED", "PROCESSING", "SHIPPED"] } };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDateTime;
      }
    }

    // Fetch orders with customer info
    const orders = await Order.find(query)
      .populate("customerId", "name email phone role")
      .populate({
        path: "checkoutId",
        select: "items totalAmount",
      })
      .sort({ createdAt: -1 });

    // Aggregate customer data
    const customerData = {};

    orders.forEach((order) => {
      if (!order.customerId) return;

      const customerId = order.customerId._id.toString();
      const customerName = order.customerId.name || "Unknown";
      const customerEmail = order.customerId.email || "";
      const customerPhone = order.customerId.phone || "";

      if (!customerData[customerId]) {
        customerData[customerId] = {
          customerId,
          customerName,
          customerEmail,
          customerPhone,
          totalOrders: 0,
          totalSpent: 0,
          totalItems: 0,
          orderTypes: {
            MATERIAL_PURCHASE: 0,
            PROJECT: 0,
          },
          firstOrderDate: order.createdAt,
          lastOrderDate: order.createdAt,
          averageOrderValue: 0,
        };
      }

      customerData[customerId].totalOrders += 1;
      customerData[customerId].totalSpent += order.totalAmount || 0;

      // Count order types
      if (order.orderType) {
        customerData[customerId].orderTypes[order.orderType] =
          (customerData[customerId].orderTypes[order.orderType] || 0) + 1;
      }

      // Count items from checkout
      if (order.checkoutId?.items) {
        order.checkoutId.items.forEach((item) => {
          customerData[customerId].totalItems += item.quantity || 0;
        });
      }

      // Update first and last order dates
      if (order.createdAt < customerData[customerId].firstOrderDate) {
        customerData[customerId].firstOrderDate = order.createdAt;
      }
      if (order.createdAt > customerData[customerId].lastOrderDate) {
        customerData[customerId].lastOrderDate = order.createdAt;
      }
    });

    // Calculate average order value and convert to array
    const customerList = Object.values(customerData).map((customer) => {
      customer.averageOrderValue = customer.totalSpent / customer.totalOrders;

      // Calculate customer lifetime (in days)
      const lifetimeDays = Math.ceil(
        (customer.lastOrderDate - customer.firstOrderDate) /
          (1000 * 60 * 60 * 24)
      );
      customer.customerLifetimeDays = lifetimeDays > 0 ? lifetimeDays : 1;

      // Calculate purchase frequency (orders per month)
      const monthsActive = customer.customerLifetimeDays / 30 || 1;
      customer.purchaseFrequency = customer.totalOrders / monthsActive;

      return customer;
    });

    // Sort by total spent (most loyal = highest spending)
    customerList.sort((a, b) => b.totalSpent - a.totalSpent);

    // Calculate statistics
    const stats = {
      totalCustomers: customerList.length,
      totalOrders: orders.length,
      totalRevenue: customerList.reduce((sum, c) => sum + c.totalSpent, 0),
      averageOrdersPerCustomer: orders.length / (customerList.length || 1),
      averageSpentPerCustomer:
        customerList.reduce((sum, c) => sum + c.totalSpent, 0) /
        (customerList.length || 1),
      topSpender: customerList[0] || null,
    };

    console.log(stats);

    return res.status(200).json({
      success: true,
      data: {
        customers: customerList,
        stats,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Profit Report (Laba Rugi)
const getProfitReport = async (req, res) => {
  try {
    const { startDate, endDate, orderType } = req.query;

    // Build query filter for completed orders only
    const query = {
      status: {
        $in: ["payment_confirmed", "processing", "shipping", "completed"],
      },
    };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDateTime;
      }
    }

    if (orderType) query.orderType = orderType;

    // Fetch orders with checkout details
    const orders = await Order.find(query)
      .populate({
        path: "checkoutId",
        select: "items totalAmount",
      })
      .sort({ createdAt: -1 });

    // Calculate profit metrics
    let totalRevenue = 0;
    let totalCOGS = 0; // Cost of Goods Sold (HPP)
    let totalQuantitySold = 0;
    const productProfitability = {};
    const categoryProfitability = {};

    // Import Product model to get cost prices
    const { Product } = require("../models");

    for (const order of orders) {
      if (!order.checkoutId?.items) continue;

      const revenue = order.totalAmount || 0;
      totalRevenue += revenue;

      for (const item of order.checkoutId.items) {
        const productId = item.productId?.toString();
        const productName = item.productName || "Unknown Product";
        const quantity = item.quantity || 0;
        const sellingPrice = item.priceAtCheckout || 0;
        const itemRevenue = quantity * sellingPrice;

        totalQuantitySold += quantity;

        // Get product cost price (HPP)
        let costPrice = 0;
        if (productId) {
          const product = await Product.findById(productId);
          costPrice = product?.costPrice || 0;
        }

        const itemCOGS = quantity * costPrice;
        const itemProfit = itemRevenue - itemCOGS;
        const profitMargin =
          itemRevenue > 0 ? (itemProfit / itemRevenue) * 100 : 0;

        totalCOGS += itemCOGS;

        // Track per product
        if (!productProfitability[productId]) {
          productProfitability[productId] = {
            productId,
            productName,
            category: item.category || "Uncategorized",
            quantitySold: 0,
            revenue: 0,
            cogs: 0,
            profit: 0,
            profitMargin: 0,
          };
        }

        productProfitability[productId].quantitySold += quantity;
        productProfitability[productId].revenue += itemRevenue;
        productProfitability[productId].cogs += itemCOGS;
        productProfitability[productId].profit += itemProfit;

        // Track per category
        const category = item.category || "Uncategorized";
        if (!categoryProfitability[category]) {
          categoryProfitability[category] = {
            category,
            revenue: 0,
            cogs: 0,
            profit: 0,
            profitMargin: 0,
          };
        }

        categoryProfitability[category].revenue += itemRevenue;
        categoryProfitability[category].cogs += itemCOGS;
        categoryProfitability[category].profit += itemProfit;
      }
    }

    // Calculate margins for products
    Object.values(productProfitability).forEach((product) => {
      product.profitMargin =
        product.revenue > 0 ? (product.profit / product.revenue) * 100 : 0;
    });

    // Calculate margins for categories
    Object.values(categoryProfitability).forEach((category) => {
      category.profitMargin =
        category.revenue > 0 ? (category.profit / category.revenue) * 100 : 0;
    });

    // Convert to arrays and sort
    const productList = Object.values(productProfitability).sort(
      (a, b) => b.profit - a.profit
    );

    const categoryList = Object.values(categoryProfitability).sort(
      (a, b) => b.profit - a.profit
    );

    // Calculate overall metrics
    const grossProfit = totalRevenue - totalCOGS;
    const grossProfitMargin =
      totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    // Operational costs (can be added later, default to 0)
    const operationalCosts = 0;
    const netProfit = grossProfit - operationalCosts;
    const netProfitMargin =
      totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    const stats = {
      totalOrders: orders.length,
      totalRevenue,
      totalCOGS,
      grossProfit,
      grossProfitMargin,
      operationalCosts,
      netProfit,
      netProfitMargin,
      totalQuantitySold,
      averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
      averageProfit: orders.length > 0 ? netProfit / orders.length : 0,
    };

    return res.status(200).json({
      success: true,
      data: {
        stats,
        productProfitability: productList,
        categoryProfitability: categoryList,
        orders,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Sales Trend Analysis Report
const getTrendAnalysisReport = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = "day" } = req.query;

    // Build query filter for completed orders
    const query = {
      status: {
        $in: ["payment_confirmed", "processing", "shipping", "completed"],
      },
    };

    // Default to last 30 days if no date provided
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    const start = startDate
      ? new Date(startDate)
      : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
    start.setHours(0, 0, 0, 0);

    query.createdAt = { $gte: start, $lte: end };

    // Fetch orders
    const orders = await Order.find(query)
      .populate({
        path: "checkoutId",
        select: "items totalAmount",
      })
      .sort({ createdAt: 1 });

    // Group data by time period
    const groupedData = {};
    const dailyStats = {};
    const monthlyStats = {};
    const weeklyStats = {};

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`; // YYYY-MM
      const weekKey = getWeekKey(date);
      const dayOfWeek = date.toLocaleDateString("id-ID", { weekday: "long" });
      const hour = date.getHours();

      const revenue = order.totalAmount || 0;
      const itemCount =
        order.checkoutId?.items?.reduce(
          (sum, item) => sum + (item.quantity || 0),
          0
        ) || 0;

      // Daily grouping
      if (!dailyStats[dateKey]) {
        dailyStats[dateKey] = {
          date: dateKey,
          orders: 0,
          revenue: 0,
          items: 0,
          averageOrderValue: 0,
        };
      }
      dailyStats[dateKey].orders++;
      dailyStats[dateKey].revenue += revenue;
      dailyStats[dateKey].items += itemCount;

      // Monthly grouping
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = {
          month: monthKey,
          orders: 0,
          revenue: 0,
          items: 0,
          averageOrderValue: 0,
        };
      }
      monthlyStats[monthKey].orders++;
      monthlyStats[monthKey].revenue += revenue;
      monthlyStats[monthKey].items += itemCount;

      // Weekly grouping
      if (!weeklyStats[weekKey]) {
        weeklyStats[weekKey] = {
          week: weekKey,
          orders: 0,
          revenue: 0,
          items: 0,
          averageOrderValue: 0,
        };
      }
      weeklyStats[weekKey].orders++;
      weeklyStats[weekKey].revenue += revenue;
      weeklyStats[weekKey].items += itemCount;

      // Day of week analysis
      if (!groupedData[dayOfWeek]) {
        groupedData[dayOfWeek] = {
          dayOfWeek,
          orders: 0,
          revenue: 0,
        };
      }
      groupedData[dayOfWeek].orders++;
      groupedData[dayOfWeek].revenue += revenue;

      // Hour analysis
      const hourKey = `${hour}:00`;
      if (!groupedData[hourKey]) {
        groupedData[hourKey] = {
          hour: hourKey,
          orders: 0,
          revenue: 0,
        };
      }
    });

    // Calculate averages
    Object.values(dailyStats).forEach((day) => {
      day.averageOrderValue = day.orders > 0 ? day.revenue / day.orders : 0;
    });
    Object.values(monthlyStats).forEach((month) => {
      month.averageOrderValue =
        month.orders > 0 ? month.revenue / month.orders : 0;
    });
    Object.values(weeklyStats).forEach((week) => {
      week.averageOrderValue = week.orders > 0 ? week.revenue / week.orders : 0;
    });

    // Convert to arrays and sort
    const dailyTrend = Object.values(dailyStats).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
    const monthlyTrend = Object.values(monthlyStats).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
    const weeklyTrend = Object.values(weeklyStats).sort((a, b) =>
      a.week.localeCompare(b.week)
    );

    // Calculate growth metrics
    const totalRevenue = orders.reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0
    );
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Peak times
    const dayOfWeekStats = Object.values(groupedData).filter(
      (d) => d.dayOfWeek
    );
    const peakDay = dayOfWeekStats.sort((a, b) => b.revenue - a.revenue)[0];
    const peakDate = dailyTrend.sort((a, b) => b.revenue - a.revenue)[0];

    // Growth calculation (compare first and last period)
    let growthRate = 0;
    if (monthlyTrend.length >= 2) {
      const firstMonth = monthlyTrend[0].revenue;
      const lastMonth = monthlyTrend[monthlyTrend.length - 1].revenue;
      growthRate =
        firstMonth > 0 ? ((lastMonth - firstMonth) / firstMonth) * 100 : 0;
    }

    const stats = {
      totalOrders,
      totalRevenue,
      avgOrderValue,
      period: {
        start: start.toISOString(),
        end: end.toISOString(),
        days: Math.ceil((end - start) / (1000 * 60 * 60 * 24)),
      },
      growthRate,
      peakDay: peakDay || null,
      peakDate: peakDate || null,
    };

    return res.status(200).json({
      success: true,
      data: {
        stats,
        dailyTrend,
        weeklyTrend,
        monthlyTrend,
        dayOfWeekStats: dayOfWeekStats.sort((a, b) => {
          const days = [
            "Senin",
            "Selasa",
            "Rabu",
            "Kamis",
            "Jumat",
            "Sabtu",
            "Minggu",
          ];
          return days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek);
        }),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to get week key
function getWeekKey(date) {
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${year}-W${String(weekNumber).padStart(2, "0")}`;
}

module.exports = {
  getOrder,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getSalesReport,
  getMyOrders,
  getOutgoingInventoryReport,
  getCustomerLoyaltyReport,
  getProfitReport,
  getTrendAnalysisReport,
};
