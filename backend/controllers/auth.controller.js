import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

import {
    validateEmail,
    validatePassword,
    sanitizeInput,
} from '../utils/inputValidation.js';
import transporter from '../config/nodemailer.js';

//Register Controller
export const register = async (req, res) => {
    // Extracting user input from request body
    const { name, email, password } = req.body;

    // Checking if all required fields are provided
    if (!name || !email || !password) {
        return res.json({
            success: false,
            message: 'All fields are required.',
        });
    }

    // Validating email format
    if (!validateEmail(email)) {
        return res.json({
            success: false,
            message: 'Invalid email format.',
        });
    }

    // Validating password strength
    if (!validatePassword(password)) {
        return res.json({
            success: false,
            message: 'Password must be at least 8 characters.',
        });
    }

    // Sanitizing user inputs to prevent XSS attacks
    const cleanName = sanitizeInput(name);
    const cleanEmail = sanitizeInput(email);

    try {
        // Checking if a user with the provided email already exists
        const existingUser = await User.findOne({ email: cleanEmail });
        if (existingUser) {
            return res.json({
                success: false,
                message: 'User already exists.',
            });
        }

        // Hashing the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creating a new user
        const user = new User({
            name: cleanName,
            email: cleanEmail,
            password: hashedPassword,
        });
        await user.save();

        // Generating a JWT token for the user
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        // Setting the token as a secure HTTP cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        //sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: cleanEmail,
            subject: 'Welcome to our MERN Auth System',
            text: `<h1>MERN Auth System</h1><br>Welcome ${cleanName}, to our MERN Auth System, where we are creating a full authentication system.
            <br>
            Your account has been created with email id: ${cleanEmail}.`,
        };

        const mail = await transporter.sendMail(mailOptions);
        console.log('Message Sent: %s', mail.messageId);
        // Returning a successful response with the token
        return res.json({ success: true, token });
    } catch (error) {
        // Handling any errors during registration
        return res.json({ success: false, message: error.message });
    }
};

// Login Controller
export const login = async (req, res) => {
    // Extracting email and password from request body
    const { email, password } = req.body;

    // Checking if all required fields are provided
    if (!email || !password) {
        return res.json({
            success: false,
            message: 'All fields are required.',
        });
    }

    // Validating email format
    if (!validateEmail(email)) {
        return res.json({
            success: false,
            message: 'Invalid email format.',
        });
    }

    // Validating password strength
    if (!validatePassword(password)) {
        return res.json({
            success: false,
            message: 'Password must be at least 8 characters.',
        });
    }

    // Sanitizing email input
    const cleanEmail = sanitizeInput(email);

    try {
        // Finding the user by email
        const user = await User.findOne({ email: cleanEmail });
        if (!user) {
            return res.json({ success: false, message: 'No user found.' });
        }

        // Comparing the provided password with the stored hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.json({ success: false, message: 'Password error.' });
        }

        // Generating a JWT token for the user
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        // Setting the token as a secure HTTP cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Returning a successful response with the token
        return res.json({ success: true, token });
    } catch (error) {
        // Handling any errors during login
        return res.json({ success: false, message: error.message });
    }
};

// Logout Controller
export const logout = async (req, res) => {
    try {
        // Clearing the secure cookie that holds the JWT token
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        // Returning a successful logout message
        return res.json({ success: true, message: 'Logged Out' });
    } catch (error) {
        // Handling errors during logout
        return res.json({ success: false, message: error.message });
    }
};

//Send verification OTP to the user Email
export const sendVerifyOTP = async (req, res) => {
    try {
        const { userId } = req.body;
        console.log(req.body);
        const user = await User.findById(userId);

        if (user.isVerified) {
            return res.json({
                success: false,
                message: 'Account already verified',
            });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.otp = otp;
        user.otpExpiry = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Verify MERN Auth System account',
            text: `<h1>MERN Auth System</h1><br>${user.name},
            <br>
            Please verify your account with email id: ${user.email}.
            <br>
            Your OTP is ${otp}, use this OTP to verify your email address`,
        };

        const mail = await transporter.sendMail(mailOptions);
        console.log('Message Sent: %s', mail.messageId);

        return res.json({ success: true, message: 'OTP send to the email' });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

//Verify email after the user enters the otp
export const verifyEmailOTP = async (req, res) => {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
        return res.json({ success: false, message: 'Missing Details' });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found.' });
        }

        if (user.otp === '' || user.otp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }
        if (user.otpExpiry < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired.' });
        }
        user.isVerified = true;
        user.otp = '';
        user.otpExpiry = 0;
        await user.save();
        return res.json({
            success: true,
            message: 'Email verified successfully',
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};
