const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for OTPs (use Redis or database in production)
const otpStore = new Map();

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

    const otp = generateOTP();
    const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutes

    otpStore.set(email, { otp, expiryTime });

    try {
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
app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const stored = otpStore.get(email);
    if (!stored) {
        return res.status(400).json({ error: 'OTP not found or expired' });
    }

    if (Date.now() > stored.expiryTime) {
        otpStore.delete(email);
        return res.status(400).json({ error: 'OTP expired' });
    }

    if (stored.otp === otp) {
        otpStore.delete(email);
        res.json({ message: 'OTP verified successfully' });
    } else {
        res.status(400).json({ error: 'Invalid OTP' });
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
