import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  code: { type: String, unique: true, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String },
  thumbnails: { type: [String], default: [] },
  status: { type: Boolean, default: true }
}, {
  timestamps: true 
});

const Product = mongoose.model('Product', productSchema);
export default Product;