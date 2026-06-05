const Product = require("../models/Product");
const Category = require("../models/Category");

const {
  getSuggestedCategories,
} = require("../services/openaiService");

exports.chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;

    console.log("=================================");
    console.log("USER MESSAGE:", message);

    // Ask AI for matching categories
    const suggestedCategories =
      await getSuggestedCategories(message);

    console.log(
      "AI SUGGESTED:",
      suggestedCategories
    );

    // Get all categories from DB
    const allCategories =
      await Category.find({});

    const validCategoryNames =
      allCategories.map(
        (cat) => cat.name
      );

    // Remove categories not present in DB
    const filteredCategories =
      suggestedCategories.filter(
        (name) =>
          validCategoryNames.includes(name)
      );

    console.log(
      "FILTERED CATEGORIES:",
      filteredCategories
    );

    if (!filteredCategories.length) {
      return res.status(200).json({
        success: true,
        reply:
          "😊 I couldn't find a perfect match. Can you tell me more about what you're craving?",
        products: [],
      });
    }

    // Find matching categories
    const categories =
      await Category.find({
        name: {
          $in: filteredCategories,
        },
      });

    const categoryIds =
      categories.map((cat) => cat._id);

    console.log(
      "CATEGORY IDS:",
      categoryIds
    );

    // Find products
    const products =
      await Product.find({
        categoryId: {
          $in: categoryIds,
        },
      })
        .limit(6)
        .populate("categoryId");

    console.log(
      "PRODUCTS FOUND:",
      products.length
    );

    let reply =
      "✨ Based on what you told me, I think you'll love these!";

    // Custom replies for common moods/intents
    const msg = message.toLowerCase();

    if (
      msg.includes("mood") ||
      msg.includes("sad") ||
      msg.includes("stress")
    ) {
      reply =
        "🍫 A little sweetness can help. Here are some comforting treats for you!";
    }

    if (
      msg.includes("birthday")
    ) {
      reply =
        "🎂 Here are some birthday favourites!";
    }

    if (
      msg.includes("wedding")
    ) {
      reply =
        "💍 Here are some elegant wedding treats!";
    }

    if (
      msg.includes("period") ||
      msg.includes("craving")
    ) {
      reply =
        "❤️ These are some popular comfort desserts you might enjoy!";
    }

    return res.status(200).json({
      success: true,
      reply,
      products,
      categories: filteredCategories,
    });

  } catch (error) {
    console.log(
      "CHATBOT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};



