import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
const productsCollection = "products";
const productsSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  status: Boolean,
  stock: Number,
  category: String,
  thumbnails: Array,
});

productsSchema.plugin(paginate);

export const productsModel = mongoose.model(productsCollection, productsSchema);
