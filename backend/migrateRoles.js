// Script to migrate user roles from old format to new format
require("dotenv").config();
const mongoose = require("mongoose");
const { User } = require("./src/models");
const { connectDB } = require("./src/config/database");

const roleMapping = {
  "Administrator": "admin",
  "Project Manager": "project_manager",
  "Customer": "customer"
};

async function migrateRoles() {
  try {
    await connectDB();
    console.log("Connected to database");

    const users = await User.find();
    console.log(`Found ${users.length} users`);

    let updatedCount = 0;

    for (const user of users) {
      const oldRole = user.role;
      const newRole = roleMapping[oldRole] || oldRole;

      if (oldRole !== newRole) {
        user.role = newRole;
        await user.save();
        console.log(`✅ Updated ${user.username}: "${oldRole}" → "${newRole}"`);
        updatedCount++;
      } else {
        console.log(`⏭️  Skipped ${user.username}: already has correct role "${oldRole}"`);
      }
    }

    console.log(`\n🎉 Migration complete! Updated ${updatedCount} user(s)`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrateRoles();
