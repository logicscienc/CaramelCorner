const Category = require("../models/Category");
const Product = require("../models/Product");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, region, parentCategory, isFeatured, sortOrder } =
      req.body;

    // Validate fields
    if (!name || !description || !req.files?.image) {
      return res.status(400).json({
        success: false,
        message: "Name, description and image are required",
      });
    }

    // If parentCategory is provided, validate it
    let parent = null;
    if (parentCategory) {
      parent = await Category.findById(parentCategory);
      if (!parent) {
        return res.status(404).json({
          success: false,
          message: "Parent category not found",
        });
      }
    }

    // Upload image
    const uploadedImage = await uploadImageToCloudinary(
      req.files.image,
      process.env.FOLDER_NAME
    );

    // Create category in the db

    const category = await Category.create({
      name,
      description,
      image: uploadedImage.secure_url,
      region,
      parentCategory: parent ? parent._id : null,
      isFeatured: isFeatured || false,
      sortOrder: sortOrder || 0,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error creating category",
    });
  }
};

// update Category
exports.updateCategory = async (req, res) => {
  try {
    // fetch data
    const { categoryId } = req.params;
    // data validation
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }
    // Find Category
    let category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "That Category  not found",
      });
    }

    const { name, description, region, parentCategory, isFeatured, sortOrder } =
      req.body;
    // If parentCategory is provided, validate it
    if (parentCategory) {
      const parent = await Category.findById(parentCategory);
      if (!parent) {
        return res.status(404).json({
          success: false,
          message: "Parent category not found",
        });
      }
      category.parentCategory = parent._id;
    }

    // If a new image is uploaded
    if (req.files?.image) {
      const uploadedImage = await uploadImageToCloudinary(
        req.files.image,
        process.env.FOLDER_NAME
      );
      category.image = uploadedImage.secure_url;
    }

    // Update only provided fields
    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    if (region !== undefined) category.region = region;
    if (isFeatured !== undefined) category.isFeatured = isFeatured;
    if (sortOrder !== undefined) category.sortOrder = sortOrder;

    // Save changes inn our db
    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error updating category",
    });
  }
};

// get all Category
exports.getAllCategories = async (req, res) => {
  try {
    const { isFeatured, region } = req.query;

    // Build filter
    const filter = {};
    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === "true"; // convert string to boolean
    }
    if (region) {
      filter.region = region; // e.g., "Indian" or "Western"
    }

    // Fetch categories sorted by sortOrder
    const categories = await Category.find(filter)
      .sort({ sortOrder: 1 }) // show in menu order
      .exec();

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching categories",
    });
  }
};

// get one Category
exports.getOneCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    const category = await Category.findById(categoryId)
      .populate("parentCategory") // optional: include parent category details
      .exec();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    // Find all products belonging to this category
    const products = await Product.find({ categoryId: categoryId });

    return res.status(200).json({
      success: true,
      category,
      products, // attach products array
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching category details",
    });
  }
};
