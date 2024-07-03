// routes/router.js
const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");
const multer = require("multer");
const upload = multer(); // Initialize multer for file uploads

// Register endpoint
router.post("/register", upload.none(), async (req, res) => {
    const { fname, email, password, cpassword } = req.body;

    try {
        if (!fname || !email || !password || !cpassword) {
            return res.status(422).json({ error: "Please fill all the details" });
        }

        if (password !== cpassword) {
            return res.status(422).json({ error: "Passwords do not match" });
        }

        const preUser = await User.findOne({ email });
        if (preUser) {
            return res.status(422).json({ error: "Email already exists" });
        }

        const newUser = new User({ fname, email, password, cpassword });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

// Login endpoint
router.post("/login", upload.none(), async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = await user.generateAuthToken();
        res.status(200).json({ token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
});

// Valid user endpoint
router.get("/validuser", authenticate, async (req, res) => {
    try {
        const validUser = await User.findById(req.userId);
        if (!validUser) {
            throw new Error("User not found");
        }
        res.status(200).json({ validUser });
    } catch (error) {
        res.status(401).json({ error: "Unauthorized" });
    }
});

// Logout endpoint
router.get("/logout", authenticate, async (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter(tokenObj => tokenObj.token !== req.token);
        await req.rootUser.save();
        res.clearCookie("usercookie", { path: "/" });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;
