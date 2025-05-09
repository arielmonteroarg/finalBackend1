//conexion con mongodb atlas y mongoose
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB Atlas:', error.message);
    process.exit(1);
  }
};

export default conectarDB;
