const Product = require("../models/Product");
const Category = require("../models/Category");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createProduct = async (req, res) => {
  try {
    // fetch data
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

    // get images and brand logo
    const desert = req.files.desertImage;
    const brand = req.files.brandLogo;

    // validation
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

    // Verify category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Upload image to cloudinary
    const desertImage = await uploadImageToCloudinary(
      desert,
      process.env.FOLDER_NAME
    );
    const brandLogo = await uploadImageToCloudinary(
      brand,
      process.env.FOLDER_NAME
    );

    // storing in db
    const product = await Product.create({
      name,
      description,
      longDescription,
      price,
      originalPrice,
      categoryId: category._id,
      images: [desertImage.secure_url], // just the filename for now
      brand: brandLogo.secure_url, // filename for now
      stock,
      weight,
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

// update product

exports.updateProduct = async (req, res) => {
  try {
    // fetch data
    const { productId } = req.params;
    // data validation
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Missing data",
      });
    }

    // Find Product
    let product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // If category Id provided, validate i mean when we wants to change the category.
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

    // handle files update
    const desert = req.files?.desertImage;
    const brand = req.files?.brandLogo;
    if (desert && req.body.imageIndex !== undefined) {
      const index = parseInt(req.body.imageIndex);
      const desertImage = await uploadImageToCloudinary(
        desert,
        process.env.FOLDER_NAME
      );

      // replace only that index
      if (product.images[index]) {
        product.images[index] = desertImage.secure_url;
      } else {
        // index not found, maybe push
        product.images.push(desertImage.secure_url);
      }
    }
    if (brand) {
      // replace with new brand logo
      const brandLogo = await uploadImageToCloudinary(
        brand,
        process.env.FOLDER_NAME
      );
      product.brand = brandLogo.secure_url;
    }

    // update only provided fields
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
          product[field] = req.body[field];
        }
      }
    });

    // save changes in db
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

// get all products
exports.getAllProduct = async (req, res) => {
  try {
    const { categoryId, search, sort } = req.query;
    // Base filter: only products with stock>0
    const filter = { stock: { $gt: 0 } };

    // if category filter provided
    if (categoryId) {
      filter.categoryId = categoryId;
    }

    // if search keyword provided
    if (search) {
      // Case-insensitive search on name
      filter.name = { $regex: search, $options: "i" };
    }

    // start query with filters
    let query = Product.find(filter);

    //  sorting by

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
        query = query.sort({ inFeatured: -1 }); // later can replace with soldCount
        break;
      default:
        query = query.sort({ createdAt: -1 }); // default
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Execute query
    const products = await query.exec();

    // Count total (for pagination UI)
    const total = await Product.countDocuments(filter);

    // return response
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

// getOneProduct
exports.getOneProduct = async (req, res) => {
  try{
   const {productId} = req.params;

  //  validate
  if(!productId) {
    return res.status(400).json({
       success: false,
        message: "Product ID is required",
    });
  }

  // Find the product and populate category info
  const product = await Product.findById(productId).populate("categoryId");

  
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

     // Success
    return res.status(200).json({
      success: true,
      product,
    });

  }
  catch(error){
     console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching product details",
    });

  }
};

// get featured products
exports.getFeaturedProducts = async (req, res) => {
  try{
     // Find products that are marked as featured and have stock > 0
    const products = await Product.find({ 
      isFeatured: true, 
      stock: { $gt: 0 } 
    })
    .sort({ createdAt: -1 }) // newest featured products first
    .limit(10) // limit to 10
    .populate("categoryId"); // include category details

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });

  }
  catch(error) {
     console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching featured products",
    });

  }
};

// get related products 
exports.getRelatedProducts = async (req, res) => {
  try{
    const { productId } = req.params;

    // validate
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }
    // Find the main product
    const mainProduct = await Product.findById(productId);
    if (!mainProduct) {
      return res.status(404).json({
        success: false,
        message: "Main product not found",
      });
    }
     // Find other products in the same category (excluding this product)
    const relatedProducts = await Product.find({
      categoryId: mainProduct.categoryId,
      _id: { $ne: mainProduct._id }, // exclude current product
      stock: { $gt: 0 }, // optional: only show in-stock
    })
      .limit(5) // limit to 5 related products
      .sort({ createdAt: -1 }); // newest first

    return res.status(200).json({
      success: true,
      relatedProducts,
    });

  }
  catch(error){
     console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching related products",
    });

  }
};
