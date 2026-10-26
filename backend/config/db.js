const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cinebook';
  const fallbackUri = 'mongodb://127.0.0.1:27017/cinebook';

  try {
    const conn = await mongoose.connect(primaryUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ Primary MongoDB Connection Failed (${error.message})`);
    if (primaryUri !== fallbackUri) {
      console.log(`🔄 Attempting fallback connection to Local MongoDB (${fallbackUri})...`);
      try {
        const fallbackConn = await mongoose.connect(fallbackUri);
        console.log(`✅ Local MongoDB Connected: ${fallbackConn.connection.host}`);
        return;
      } catch (fallbackErr) {
        console.error(`❌ Fallback MongoDB Connection Failed: ${fallbackErr.message}`);
      }
    }
    process.exit(1);
  }
};

module.exports = connectDB;

