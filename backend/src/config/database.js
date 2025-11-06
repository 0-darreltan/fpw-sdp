require("dotenv").config();

const mongoose = require("mongoose");

const { MONGO_URI, MONGO_DB, NODE_ENV, CREATE_COLLECTIONS } = process.env;

// Build a sensible default URI if MONGO_URI is not provided
const defaultDbName = process.env.DATABASE_NAME || "fpw-sdp";
const uri =
  MONGO_URI && MONGO_URI.length > 0
    ? MONGO_URI
    : `mongodb://127.0.0.1:27017/${defaultDbName}`;

console.log(
  "[db] Using MongoDB URI:",
  uri,
  ` (env NODE_ENV=${NODE_ENV || "development"})`
);

// Recommended options for Mongoose (Mongoose 6+ has sane defaults but we keep a couple useful ones)
const mongooseOptions = {
  // keep a small pool for dev and larger for production
  maxPoolSize: NODE_ENV === "production" ? 50 : 10,
  serverSelectionTimeoutMS: 5000, // fail fast
  socketTimeoutMS: 45000,
  family: 4,
};

async function connectWithRetry(attempts = 5, delayMs = 1000) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      await mongoose.connect(uri, mongooseOptions);
      return;
    } catch (err) {
      lastErr = err;
      console.warn(`[db] Connection attempt ${i + 1} failed: ${err.message}`);
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, i)));
      }
    }
  }
  throw lastErr;
}

async function connectDB({
  createCollections = CREATE_COLLECTIONS === "true",
  requiredCollections = [],
} = {}) {
  try {
    await connectWithRetry();
    const db = mongoose.connection.db;
    console.log(
      "[db] Successfully connected to MongoDB. Database:",
      db.databaseName
    );

    mongoose.connection.on("error", (err) => {
      console.error("[db] MongoDB runtime connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("[db] MongoDB disconnected.");
    });

    // Optionally create collections if requested (useful for initial dev seeding)
    if (
      createCollections &&
      Array.isArray(requiredCollections) &&
      requiredCollections.length > 0
    ) {
      try {
        const existing = await db.listCollections().toArray();
        const existNames = existing.map((c) => c.name);
        for (const name of requiredCollections) {
          if (!existNames.includes(name)) {
            await db.createCollection(name);
            console.log(`[db] Created collection '${name}'`);
          } else {
            console.log(`[db] Collection '${name}' already exists`);
          }
        }
      } catch (err) {
        console.warn("[db] Could not ensure collections:", err.message);
      }
    }

    return mongoose;
  } catch (error) {
    console.error(
      "[db] MongoDB initial connection error:",
      error && error.message ? error.message : error
    );
    // do not exit here in libraries; allow caller to decide
    throw error;
  }
}

async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log("[db] Disconnected from MongoDB");
  } catch (err) {
    console.warn("[db] Error while disconnecting:", err.message);
  }
}

function getDb() {
  return mongoose.connection && mongoose.connection.db
    ? mongoose.connection.db
    : null;
}

module.exports = {
  connectDB,
  disconnectDB,
  mongoose,
  getDb,
};
