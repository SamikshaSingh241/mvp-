const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (uri && uri.trim() !== '') {
      const conn = await mongoose.connect(uri);
      console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
      return conn;
    }

    // Fallback: If no URI is provided, attempt local MongoDB default
    try {
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/truehire_db', {
        serverSelectionTimeoutMS: 2000
      });
      console.log(`[Database] Local MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (localErr) {
      console.log('[Database] Remote/Local MongoDB not connected. Initializing embedded in-memory MongoDB engine...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[Database] In-Memory MongoDB Connected at: ${memUri}`);
      
      // Auto-seed in-memory database if empty
      const { seedDatabase } = require('../utils/seedData');
      await seedDatabase();

      return conn;
    }
  } catch (error) {
    console.error(`[Database] Connection error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.error('Error disconnecting DB:', err);
  }
};

module.exports = { connectDB, disconnectDB };
