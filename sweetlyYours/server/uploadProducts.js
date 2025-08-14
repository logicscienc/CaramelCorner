import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/Product.js';

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// MongoDB connect
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load products.json
const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf8')
);

// Upload helper
async function uploadImage(filePath, folderName) {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      return null;
    }
    const res = await cloudinary.uploader.upload(filePath, { folder: folderName });
    return res.secure_url;
  } catch (err) {
    console.error(`❌ Error uploading ${filePath}:`, err.message);
    return null;
  }
}

// Main
async function uploadProducts() {
  for (let product of products) {
    try {
      console.log(`\n📦 Processing: ${product.name}`);

      // Upload images
      const desertImagePath = path.join(__dirname, product.desertImage);
      const desertImageUrl = await uploadImage(desertImagePath, 'desserts');

      const brandLogoPath = path.join(__dirname, product.brandLogo);
      const brandLogoUrl = await uploadImage(brandLogoPath, 'brand-logos');

      if (!desertImageUrl || !brandLogoUrl) {
        console.error(`⚠️ Skipped ${product.name} due to missing images`);
        continue;
      }

      // Save product with image URLs
      const newProduct = new Product({
        ...product,
        desertImage: desertImageUrl,
        brandLogo: brandLogoUrl,
        images: [desertImageUrl, brandLogoUrl] // <-- fill images array
      });

      await newProduct.save();
      console.log(`✅ Uploaded: ${product.name}`);
    } catch (err) {
      console.error(`❌ Error saving ${product.name}:`, err.message);
    }
  }

  mongoose.disconnect();
  console.log('\n🎉 All products uploaded successfully!');
}

uploadProducts();


