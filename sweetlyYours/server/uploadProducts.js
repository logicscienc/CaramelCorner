// uploadProducts.js
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import Product from "./models/Product.js";
import Category from "./models/Category.js";

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Load products.json
// Load products.json (correct path)
const productsPath = path.resolve("data", "products.json");
const productsData = JSON.parse(fs.readFileSync(productsPath, "utf8"));

// Upload function
async function uploadImageToCloudinary(filePath, folder) {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder });
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Failed to upload ${filePath}:`, error);
    throw error;
  }
}

async function uploadProducts() {
  try {
    for (let product of productsData) {
      console.log(`📦 Uploading product: ${product.name}`);

      // Check category exists
      const category = await Category.findById(product.categoryId);
      if (!category) {
        console.warn(`⚠ Category not found for ${product.name}, skipping...`);
        continue;
      }

      // Upload desertImage
      const desertPath = path.join(process.cwd(), product.desertImage);
      const desertUrl = await uploadImageToCloudinary(desertPath, process.env.FOLDER_NAME);

      // Upload brandLogo
      const brandPath = path.join(process.cwd(), product.brandLogo);
      const brandUrl = await uploadImageToCloudinary(brandPath, process.env.FOLDER_NAME);

      // Save product to DB
      await Product.create({
        name: product.name,
        description: product.description,
        longDescription: product.longDescription,
        price: Number(product.price),
        originalPrice: Number(product.originalPrice),
        categoryId: category._id,
        images: [desertUrl],
        brand: brandUrl,
        stock: Number(product.stock),
        weight: product.weight,
        ingredients: product.ingredients,
        instructions: product.instructions,
        expertTips: product.expertTips,
        shippingDetails: product.shippingDetails,
        isFeatured: Boolean(product.isFeatured),
      });

      console.log(`✅ ${product.name} uploaded successfully`);
    }
  } catch (error) {
    console.error("❌ Error uploading products:", error);
  } finally {
    mongoose.connection.close();
  }
}

uploadProducts();






