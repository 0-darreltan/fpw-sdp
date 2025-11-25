require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const {
  User,
  Product,
  Project,
  Order,
  RAB,
  MaterialRequest,
  Cart,
  CheckOut,
  ActivityLog,
} = require("./src/models");

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
  try {
    await mongoose.connect(`${MONGO_URI}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to ", MONGO_URI);

    await Promise.all([
      User.deleteMany(),
      Product.deleteMany(),
      Project.deleteMany(),
      RAB.deleteMany(),
      MaterialRequest.deleteMany(),
      Cart.deleteMany(),
      CheckOut.deleteMany(),
      Order.deleteMany(),
      ActivityLog.deleteMany(),
    ]);

    // Users

    const adminPw = await bcrypt.hash("admin123", 10);
    const managerPw = await bcrypt.hash("12345678", 10);
    const customerPw = await bcrypt.hash("customer123", 10);

    const admin = await User.create({
      username: "admin",
      password: adminPw,
      role: "admin",
      name: "Administrator",
      email: "admin@mail.com",
    });

    const pm = await User.create({
      username: "pm1",
      password: managerPw,
      role: "project_manager",
      name: "Project Manager",
      email: "pm@mail.com",
    });

    const customer = await User.create({
      username: "customer1",
      password: customerPw,
      role: "customer",
      name: "Customer Satu",
      email: "customer@mail.com",
    });

    // Products

    const products = await Product.insertMany([
      {
        name: "Aspal & Marka Jalan",
        category: "Aspal",
        price: 500000,
        unit: "ton",
        stock: 100,
        description:
          "Material aspal berkualitas tinggi untuk pembangunan jalan",
      },
      {
        name: "Beton Readymix",
        category: "Beton",
        price: 800000,
        unit: "m³",
        stock: 100,
        description: "Beton siap pakai dengan kualitas terjamin",
      },
      {
        name: "Beton Precast",
        category: "Beton",
        price: 1200000,
        unit: "unit",
        stock: 50,
        description: "Beton precast untuk berbagai keperluan konstruksi",
      },
      {
        name: "Split / Batu Pecah",
        category: "Agregat",
        price: 300000,
        unit: "m³",
        stock: 100,
        description: "Material agregat untuk campuran beton",
      },
      {
        name: "Heavy Equipment Metal",
        category: "Lainnya",
        price: 627000000,
        unit: "unit",
        stock: 5,
        description:
          "mesin atau kendaraan berukuran besar yang dirancang khusus untuk melakukan pekerjaan berat, seperti konstruksi, pertambangan, dan pemindahan material",
      },
      {
        name: "Bata Ringan",
        category: "Lainnya",
        price: 1500000,
        unit: "m³",
        stock: 200,
        description:
          "bahan bangunan yang lebih ringan dari bata konvensional, terbuat dari campuran semen, pasir silika, kapur, aluminium powder, dan air, yang menghasilkan gelembung udara untuk mengurangi beratnya",
      },
    ]);

    console.log("Products inserted: ", products.length);

    // ============================
    // 4. PROJECT
    // ============================
    console.log("Seeding project...");

    const project = await Project.create({
      name: "Renovasi Rumah Pak Budi",
      location: "Jakarta",
      description: "Renovasi full interior",
      projectManagerId: pm._id,
      status: "ongoing",
      startDate: new Date(),
      budget: 50000000,
      progress: 30, // Add progress field
    });

    // ============================
    // 5. RAB
    // ============================
    // RAB SEEDER - DISABLED (tidak perlu tambah data RAB)
    // ============================
    console.log("Skipping RAB seeding (as requested)...");

    // const rab = await RAB.create({
    //   customerId: customer._id,
    //   customerName: customer.name,
    //   customerEmail: customer.email,
    //   projectId: project._id,
    //   projectManagerId: pm._id,
    //   projectManagerName: pm.name,
    //   title: "RAB Renovasi Tahap 1",
    //   description: "Rencana Anggaran Biaya untuk renovasi rumah tahap pertama",
    //   location: "Jakarta Selatan",
    //   estimatedBudget: 50000000,
    //   items: [
    //     {
    //       description: "Pengecatan tembok",
    //       qty: 10,
    //       unit: "kaleng",
    //       unitPrice: 95000,
    //     },
    //   ],
    //   totalEstimated: 950000,
    //   status: "pending",
    // });



    // ============================
    // 8. CART
    // ============================
    console.log("Seeding cart...");

    const cart = await Cart.create({
      user: customer._id,
      items: [
        {
          productId: products[0]._id,
          quantity: 2,
        },
      ],
    });

    // ============================
    // 9. CHECKOUT
    // ============================
    console.log("Seeding checkout...");

    const checkout1 = await CheckOut.create({
      user: customer._id,
      orderType: "MATERIAL_PURCHASE",
      items: [
        {
          productId: products[0]._id,
          productName: products[0].name,
          priceAtCheckout: products[0].price,
          quantity: 2,
          unit: products[0].unit,
        },
      ],
      subtotal: products[0].price * 2,
      total: products[0].price * 2,
      deliveryAddress: {
        street: "Jl. Sudirman",
        city: "Jakarta",
        province: "DKI Jakarta",
        postalCode: "12345",
        country: "Indonesia",
      },
    });

    // Checkout2 disabled (depends on RAB)
    // const checkout2 = await CheckOut.create({
    //   user: customer._id,
    //   orderType: "PROJECT",
    //   rabId: rab._id,
    //   items: [
    //     {
    //       productId: products[2]._id,
    //       productName: products[2].name,
    //       priceAtCheckout: products[2].price,
    //       quantity: 10,
    //     },
    //   ],
    //   subtotal: products[2].price * 10,
    //   total: products[2].price * 10,
    //   deliveryAddress: {
    //     street: "Jl. Asia Afrika",
    //     city: "Bandung",
    //     province: "Jawa Barat",
    //     postalCode: "66666",
    //     country: "Indonesia",
    //   },
    // });

    // ============================
    // 10. ORDERS
    // ============================
    console.log("Seeding orders...");

    await Order.create({
      orderNumber: "ORD-001",
      checkoutId: checkout1._id,
      customerId: customer._id,
      orderType: "MATERIAL_PURCHASE",
      totalAmount: checkout1.total,
      status: "payment_confirmed",
    });

    // Order 2 disabled (depends on RAB and checkout2)
    // await Order.create({
    //   orderNumber: "ORD-002",
    //   checkoutId: checkout2._id,
    //   customerId: customer._id,
    //   orderType: "PROJECT",
    //   rabId: rab._id,
    //   totalAmount: checkout2.total,
    //   status: "payment_confirmed",
    // });

    // ============================
    // 11. ACTIVITY LOGS
    // ============================
    console.log("Seeding activity logs...");

    await ActivityLog.insertMany([
      {
        type: "user_registered",
        title: "Admin Created",
        description: "Admin account added via seeder",
        userId: admin._id,
        userName: admin.name,
        userRole: admin.role,
        icon: "👮‍♂️",
      },
      {
        type: "project_created",
        title: "New Project",
        description: "Project created via seeder",
        userId: pm._id,
        userName: pm.name,
        userRole: pm.role,
        projectId: project._id,
        icon: "🏗️",
      },
      {
        type: "product_created",
        title: "Product Added",
        description: "Sample product added",
        userId: admin._id,
        userName: admin.name,
        userRole: admin.role,
        icon: "📦",
      },
      {
        type: "order_created",
        title: "Order Created",
        description: "Customer created an order",
        userId: customer._id,
        userName: customer.name,
        userRole: customer.role,
        icon: "🛒",
      },
    ]);

    console.log("\nSeeding completed successfully!");
    console.log("Admin credentials:");
    console.log("  Username: admin");
    console.log("  Password: admin123");
    console.log("Project Manager credentials:");
    console.log("  Username: pm1");
    console.log("  Password: 12345678");
    console.log("Customer credentials:");
    console.log("  Username: customer1");
    console.log("  Password: customer123");

    await mongoose.disconnect();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();

