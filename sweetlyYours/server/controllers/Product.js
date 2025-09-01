const Product = require("../models/Product");
const Category = require("../models/Category");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      longDescription,
      price,
      originalPrice,
      categoryId,
      stock,
      weight,
      ingredients,
      instructions,
      expertTips,
      shippingDetails,
      isFeatured,
    } = req.body;

    const desert = req.files?.desertImage;
    const brand = req.files?.brandLogo;

    if (
      !name ||
      !description ||
      !longDescription ||
      !price ||
      !originalPrice ||
      !categoryId ||
      stock === undefined ||
      !weight ||
      !ingredients ||
      !instructions ||
      !expertTips ||
      !shippingDetails ||
      isFeatured === undefined ||
      !desert ||
      !brand
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const desertImage = await uploadImageToCloudinary(
      desert,
      process.env.FOLDER_NAME
    );
    const brandLogo = await uploadImageToCloudinary(
      brand,
      process.env.FOLDER_NAME
    );

    const product = await Product.create({
      name,
      description,
      longDescription,
      price: Number(price),
      originalPrice: Number(originalPrice),
      categoryId: category._id,
      images: [desertImage.secure_url],
      brand: brandLogo.secure_url,
      stock: Number(stock),
      weight: Number(weight),
      ingredients: Array.isArray(ingredients) ? ingredients : [ingredients],
      instructions,
      expertTips,
      shippingDetails,
      isFeatured,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error creating product",
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Missing data",
      });
    }

    let product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (req.body.categoryId) {
      const category = await Category.findById(req.body.categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Invalid categoryId",
        });
      }
      product.categoryId = category._id;
    }

    const desert = req.files?.desertImage;
    const brand = req.files?.brandLogo;
    if (desert && req.body.imageIndex !== undefined) {
      const index = parseInt(req.body.imageIndex);
      const desertImage = await uploadImageToCloudinary(
        desert,
        process.env.FOLDER_NAME
      );

      if (product.images[index]) {
        product.images[index] = desertImage.secure_url;
      } else {
        product.images.push(desertImage.secure_url);
      }
    }
    if (brand) {
      const brandLogo = await uploadImageToCloudinary(
        brand,
        process.env.FOLDER_NAME
      );
      product.brand = brandLogo.secure_url;
    }

    const updatableFields = [
      "name",
      "description",
      "longDescription",
      "price",
      "originalPrice",
      "stock",
      "weight",
      "ingredients",
      "instructions",
      "expertTips",
      "shippingDetails",
      "isFeatured",
    ];
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "ingredients") {
          product.ingredients = Array.isArray(req.body.ingredients)
            ? req.body.ingredients
            : [req.body.ingredients];
        } else {
          product[field] =
            field === "price" ||
            field === "originalPrice" ||
            field === "stock" ||
            field === "weight"
              ? Number(req.body[field])
              : req.body[field];
        }
      }
    });

    await product.save();
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error updating product",
    });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const { categoryId, search, sort } = req.query;
    const filter = { stock: { $gt: 0 } };

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    let query = Product.find(filter);

    switch (sort) {
      case "newest":
        query = query.sort({ createdAt: -1 });
        break;
      case "price_low":
        query = query.sort({ price: 1 });
        break;
      case "price_high":
        query = query.sort({ price: -1 });
        break;
      case "popular":
        query = query.sort({ isFeatured: -1 });
        break;
      default:
        query = query.sort({ createdAt: -1 });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const products = await query.exec();
    const total = await Product.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching products",
    });
  }
};

exports.getOneProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(productId).populate("categoryId");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching product details",
    });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    // take limit from query string, fallback to 10
    const limit = parseInt(req.query.limit) || 10;
    const products = await Product.find({
      isFeatured: true,
      stock: { $gt: 0 },
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("categoryId");

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching featured products",
    });
  }
};

exports.getRelatedProducts = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const mainProduct = await Product.findById(productId);
    if (!mainProduct) {
      return res.status(404).json({
        success: false,
        message: "Main product not found",
      });
    }

    const relatedProducts = await Product.find({
      categoryId: mainProduct.categoryId,
      _id: { $ne: mainProduct._id },
      stock: { $gt: 0 },
    })
      .limit(5)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      relatedProducts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching related products",
    });
  }
};

