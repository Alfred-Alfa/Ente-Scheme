const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import database connection and models
const connectDB = require('./config/database');
const User = require('./models/User');
const OTP = require('./models/OTP');
const Profile = require('./models/Profile');
const News = require('./models/News');

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via email
async function sendOTP(email, otp) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false
        },
        debug: true,
        logger: true
    });

    try {
        let info = await transporter.sendMail({
            from: `"EnteScheme" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Email Verification OTP - EnteScheme",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333;">Email Verification</h2>
                    <p>Thank you for using EnteScheme. Please use the following OTP to verify your email address:</p>
                    <div style="background-color: #f0f0f0; padding: 15px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #10b981; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
                    </div>
                    <p><strong>Important:</strong> This OTP will expire in 5 minutes for security reasons.</p>
                    <p>If you didn't request this verification, please ignore this email.</p>
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
                    <p style="color: #666; font-size: 12px;">This is an automated message from EnteScheme. Please do not reply to this email.</p>
                </div>
            `,
            text: `Your OTP for EnteScheme email verification is: ${otp}. It will expire in 5 minutes.`
        });

        console.log("OTP email sent successfully: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending OTP email:", error);
        throw new Error(`Failed to send OTP email: ${error.message}`);
    }
}

// API to send OTP
app.post('/api/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email address is required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    try {
        // Delete any existing OTPs for this email
        await OTP.deleteMany({ email });

        const otp = generateOTP();
        const expiryTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Save OTP to database
        const newOTP = new OTP({
            email,
            otp,
            expiryTime
        });
        await newOTP.save();

        await sendOTP(email, otp);
        console.log(`OTP sent to ${email}: ${otp}`);
        res.json({
            message: 'OTP sent successfully to your email address',
            success: true
        });
    } catch (error) {
        console.error('Error in /api/send-otp:', error);
        res.status(500).json({
            error: 'Failed to send OTP. Please check your email configuration and try again.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// API to verify OTP
app.post('/api/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
    }

    try {
        const storedOTP = await OTP.findOne({ 
            email, 
            otp, 
            isUsed: false,
            expiryTime: { $gt: new Date() }
        });

        if (!storedOTP) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // Mark OTP as used
        storedOTP.isUsed = true;
        await storedOTP.save();

        res.json({ 
            message: 'OTP verified successfully',
            success: true 
        });
    } catch (error) {
        console.error('Error in /api/verify-otp:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Test endpoint to verify email configuration
app.get('/api/test-email', async (req, res) => {
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com') {
        return res.status(500).json({
            error: 'Email configuration not set up. Please configure EMAIL_USER and EMAIL_PASS in .env file.'
        });
    }

    try {
        const testOTP = '123456';
        await sendOTP(process.env.EMAIL_USER, testOTP);
        res.json({
            message: 'Email configuration test successful! Check your inbox for test OTP.',
            success: true
        });
    } catch (error) {
        res.status(500).json({
            error: 'Email configuration test failed',
            details: error.message
        });
    }
});

// API to register user
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                error: existingUser.email === email ? 'Email already registered' : 'Username already taken'
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            success: true,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                isEmailVerified: newUser.isEmailVerified
            }
        });
    } catch (error) {
        console.error('Error in /api/register:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API to login user
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        res.json({
            message: 'Login successful',
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        console.error('Error in /api/login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API to login admin
app.post('/api/admin/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Check if user is an admin
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Not an admin.' });
        }

        res.json({
            message: 'Admin login successful',
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        console.error('Error in /api/admin/login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API to get user profile
app.get('/api/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Error in /api/user/:id:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API to verify email after OTP verification
app.post('/api/verify-email', async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.isEmailVerified = true;
        await user.save();

        res.json({
            message: 'Email verified successfully',
            success: true
        });
    } catch (error) {
        console.error('Error in /api/verify-email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API to create user profile
app.post('/api/create-profile', async (req, res) => {
    try {
        const { userId, email, ...profileData } = req.body;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if profile already exists
        const existingProfile = await Profile.findOne({ userId });
        if (existingProfile) {
            return res.status(400).json({ error: 'Profile already exists for this user' });
        }

        // Create new profile
        const profile = new Profile({
            userId,
            email,
            ...profileData
        });

        await profile.save();

        res.json({
            message: 'Profile created successfully',
            success: true,
            profile: {
                id: profile._id,
                userId: profile.userId,
                fullName: profile.fullName,
                district: profile.district,
                occupation: profile.occupation,
                createdAt: profile.createdAt
            }
        });
    } catch (error) {
        console.error('Error in /api/create-profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API to get user profile
app.get('/api/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const profile = await Profile.findOne({ userId }).populate('userId', 'username email');
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json({
            success: true,
            profile
        });
    } catch (error) {
        console.error('Error in /api/profile/:userId:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API to update user profile
app.put('/api/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const updateData = req.body;

        const profile = await Profile.findOneAndUpdate(
            { userId },
            { ...updateData, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            success: true,
            profile
        });
    } catch (error) {
        console.error('Error in /api/profile/:userId:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// News Management API Endpoints

// GET all news items
app.get('/api/news', async (req, res) => {
  try {
    const newsItems = await News.find().sort({ createdAt: -1 });
    res.json({ success: true, news: newsItems });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new news item
app.post('/api/news', async (req, res) => {
  try {
    const newsItem = new News(req.body);
    await newsItem.save();
    res.status(201).json({ success: true, news: newsItem });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT (update) a news item
app.put('/api/news/:id', async (req, res) => {
  try {
    const newsItem = await News.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!newsItem) {
      return res.status(404).json({ error: 'News item not found' });
    }
    res.json({ success: true, news: newsItem });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a news item
app.delete('/api/news/:id', async (req, res) => {
  try {
    const newsItem = await News.findByIdAndDelete(req.params.id);
    if (!newsItem) {
      return res.status(404).json({ error: 'News item not found' });
    }
    res.json({ success: true, message: 'News item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
