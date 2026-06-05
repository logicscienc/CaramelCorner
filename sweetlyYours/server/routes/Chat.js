const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");
const { chatWithBot } = require("../controllers/Chat");

router.post(
  "/chat",
  auth,
  chatWithBot
);

module.exports = router;