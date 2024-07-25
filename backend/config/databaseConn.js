import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
const uri = process.env.DB_URL;


export const dbConnect =  async ()=>{
    try {
        const conn = await mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
          useCreateIndex: true
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
      } catch (err) {
        console.error(`Error connecting to MongoDB: ${err.message}`);
        process.exit(1); // Exit process with failure
      }
}


process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('MongoDB disconnected through app termination');
      process.exit(0);
    });
  });
  

