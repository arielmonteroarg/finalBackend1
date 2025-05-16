import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

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

mongoosePaginate.paginate.options = {
  customLabels: {
    docs: "payload",
    page: "currentPage",
    limit: false,
    pagingCounter: false,
    totalDocs: false,
  }
};


productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);
export default Product;



