# EnteScheme Backend

This is a simple Node.js backend for OTP verification using Express and Nodemailer.

## Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file and add your email credentials:
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   PORT=3001
   ```

   Note: For Gmail, you may need to use an App Password instead of your regular password.

4. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### POST /api/send-otp
- Body: `{ "email": "user@example.com" }`
- Sends a 6-digit OTP to the email.

### POST /api/verify-otp
- Body: `{ "email": "user@example.com", "otp": "123456" }`
- Verifies the OTP. OTP expires in 5 minutes.

## Notes
- OTPs are stored in memory. For production, use a database or Redis.
- Ensure to handle email credentials securely.
