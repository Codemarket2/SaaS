import * as mongoose from 'mongoose';

let isConnected;
let escapedDBString;
let db;

export const DB = async () => {
  try {
    if (isConnected) {
      console.log('=> using existing database connection');
    } else if (!process.env.MONGO_URI) {
      // } else if (!process.env.DATABASE && !DB_STRING) {
      throw new Error('Database connection string not found');
    } else {
      escapedDBString = encodeURIComponent( process.env.MONGO_URI || '');
      // db = await mongoose.connect(escapedDBString);
      mongoose.set('strictQuery', true)
      db = await mongoose.connect(process.env.MONGO_URI,
            // useNewUrlParser: true,
            // useUnifiedTopology: true
          );
      isConnected = db.connections[0].readyState;
      console.log('DB Connection Successful!');
    }
  } catch (error) {
    console.log('DB Connection Failed' + error + 'process.env.DATABASE= ' + process.env.DATABASE + 'db =' + db);
    throw error;
  }
};
