const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // serve static files like HTML, CSS, JS

// In-memory OTP store
const otpStore = {};

// Generate OTP
app.post("/api/send-otp", (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: "Phone number required" });

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otpStore[phone] = otp;

  console.log(`Generated OTP for ${phone}: ${otp}`);

  res.json({ message: "OTP sent successfully!", demoOtp: otp });
});

// Verify OTP
app.post("/api/verify-otp", (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ message: "Phone and OTP required" });
  }

  if (otpStore[phone] && otpStore[phone] === otp) {
    delete otpStore[phone];
    return res.json({ message: "OTP verified successfully!" });
  } else {
    return res.status(400).json({ message: "Invalid OTP. Try again." });
  }
});

// Default route → open registration.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "registration.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FitFlex server running at http://localhost:${PORT}`);
});