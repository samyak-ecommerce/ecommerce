const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); // Postman ko bulaya

// Email bhejne ka setup (Transporter)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 1. Register User (With OTP Sending)
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User with this email already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 6-digit ka random OTP generate karna
        const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        // OTP 10 minute baad expire ho jayega
        const otpExpiryTime = new Date(Date.now() + 10 * 60 * 1000); 

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            otp: generatedOTP,
            otpExpires: otpExpiryTime
        });

        // Naye user ko Email bhejna
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'ShopX - Verify your Account',
            text: `Hello ${name},\n\nWelcome to ShopX! Your OTP for account verification is: ${generatedOTP}\n\nThis OTP is valid for 10 minutes.\n\nThanks,\nShopX Team`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: "OTP sent to your email. Please verify to continue." });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Server error during registration." });
    }
};

// 2. Verify OTP (Naya Function)
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found." });

        if (user.isVerified) return res.status(400).json({ message: "User is already verified." });

        if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP." });

        if (user.otpExpires < new Date()) return res.status(400).json({ message: "OTP has expired." });

        // Sab sahi hai toh user ko verified mark kar do
        user.isVerified = true;
        user.otp = undefined; // OTP ka kaam khatam, isko delete kar do
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Email verified successfully! You can now log in." });

    } catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({ message: "Server error during verification." });
    }
};

// 3. Login User (With Verification Check)
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password." });

        // NAYA CHECK: Kya user verified hai?
        if (!user.isVerified) {
            return res.status(401).json({ message: "Please verify your email before logging in." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password." });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(200).json({
            message: "Login successful.",
            token: token,
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login." });
    }
};