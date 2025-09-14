require("dotenv").config();
const jwt = require("jsonwebtoken");

console.log("Using secret:", JSON.stringify(process.env.JWT_SECRET));

const token = jwt.sign({ foo: "bar" }, process.env.JWT_SECRET, { expiresIn: "1h" });
console.log("Generated Token:", token);

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log("Verified Successfully:", decoded);
} catch (err) {
  console.error("Verification Failed:", err.message);
}

