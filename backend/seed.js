require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User, Product, Project, Order, RAB, Proposal } = require('./src/models');

const MONGO_URI = process.env.MONGO_URI;
const databaseName = 'db_agungbetonkendari';

const initialData = {
  users: [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator', email: 'admin@agungbeton.com' },
    { id: 2, username: 'customer1', password: 'customer123', role: 'customer', name: 'John Doe', email: 'john@example.com', phone: '081234567890' },
    { id: 3, username: 'pm1', password: 'pm123', role: 'project_manager', name: 'Jane Smith', email: 'jane@agungbeton.com', phone: '081234567891' }
  ],
  products: [
    { id: 1, name: 'Aspal & Marka Jalan', category: 'Aspal', price: 500000, unit: 'ton', description: 'Material aspal berkualitas tinggi untuk pembangunan jalan' },
    { id: 2, name: 'Beton Readymix', category: 'Beton', price: 800000, unit: 'm³', description: 'Beton siap pakai dengan kualitas terjamin' },
    { id: 3, name: 'Beton Precast', category: 'Beton', price: 1200000, unit: 'unit', description: 'Beton precast untuk berbagai keperluan konstruksi' },
    { id: 4, name: 'Split / Batu Pecah', category: 'Agregat', price: 300000, unit: 'm³', description: 'Material agregat untuk campuran beton' }
  ],
  projects: [
    { id: 1, name: 'Pembangunan Jalan Raya Kendari', location: 'Kendari, Sulawesi Tenggara', description: 'Proyek pembangunan jalan raya sepanjang 5 km', projectManagerId: 3, status: 'active', startDate: '2025-01-15', endDate: '2025-06-15', budget: 5000000000, createdAt: '2025-01-01T00:00:00.000Z' }
  ]
};

async function seed() {
  try {

    await mongoose.connect(`${MONGO_URI}${databaseName}`, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to', MONGO_URI);

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Project.deleteMany({}),
      Order.deleteMany({}),
      RAB.deleteMany({}),
      Proposal.deleteMany({})
    ]);
    console.log('Cleared collections');

    // Insert users (hash passwords)
    const usersToInsert = await Promise.all(
      initialData.users.map(async (u) => ({
        username: u.username,
        password: await bcrypt.hash(u.password, 10),
        role: u.role,
        name: u.name,
        email: u.email,
        phone: u.phone
      }))
    );

    const createdUsers = await User.insertMany(usersToInsert);
    console.log('Inserted users:', createdUsers.length);

    // Insert products
    const createdProducts = await Product.insertMany(initialData.products.map(p => ({ name: p.name, category: p.category, price: p.price, unit: p.unit, description: p.description })));
    console.log('Inserted products:', createdProducts.length);

    // Insert projects mapping projectManagerId from users
    const pmUser = createdUsers.find(u => u.username === 'pm1');
    const projectsToInsert = initialData.projects.map(pr => ({
      name: pr.name,
      location: pr.location,
      description: pr.description,
      projectManagerId: pmUser ? pmUser._id : undefined,
      status: pr.status,
      startDate: pr.startDate ? new Date(pr.startDate) : undefined,
      endDate: pr.endDate ? new Date(pr.endDate) : undefined,
      budget: pr.budget,
      createdAt: pr.createdAt ? new Date(pr.createdAt) : undefined
    }));

    const createdProjects = await Project.insertMany(projectsToInsert);
    console.log('Inserted projects:', createdProjects.length);

    console.log('Seeding completed successfully');
  } catch (err) {
    console.error('Seeding error', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

if (require.main === module) {
  seed();
}

module.exports = seed;
