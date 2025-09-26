import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Shield } from 'lucide-react';

const OTPVerification = (props) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasteData.length && i < 6; i++) {
      newOtp[i] = pasteData[i];
    }
    setOtp(newOtp);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (otpString === '123456') {
        props.onSuccess();
      } else {
        setError('Invalid verification code. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    }, 1500);
  };

  const handleResend = async () => {
    setResendTimer(30);
    setCanResend(false);
    setError('');
    try {
      const response = await fetch('http://localhost:3001/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: props.email })
      });
      const data = await response.json();
      if (response.ok) {
        alert("OTP resent to your email!");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to resend OTP");
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <button
          onClick={props.onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-6"
          style={{ alignSelf: 'flex-start', marginBottom: '24px' }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to login
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Identity</h1>
          <p className="text-gray-600">
            We've sent a 6-digit verification code to
            <br />
            <span className="font-medium text-gray-900">{props.email}</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
            Enter Verification Code
          </label>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-12 text-center text-xl font-bold rounded-lg border-2 ${
                  error
                    ? 'border-red-300 focus:border-red-500'
                    : digit
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
                style={{
                  width: '4.5rem',
                  height: '4.5rem',
                  fontSize: '1.4rem',
                  borderRadius: '10px',
                  border: error ? '2px solid #fca5a5' : digit ? '2px solid #bbf7d0' : '2px solid #d1d5db',
                  background: digit ? '#f0fdf4' : '#f9fafb',
                  transition: 'all 0.2s'
                }}
                maxLength={1}
              />
            ))}
          </div>
          {error && (
            <p style={{ marginTop: '12px', fontSize: '14px', color: '#dc2626', textAlign: 'center' }}>{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.join('').length !== 6}
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#fff',
            border: 'none',
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            fontWeight: '800',
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: '0 12px 24px rgba(16,185,129,0.35)',
            transition: 'transform 0.15s, box-shadow 0.2s',
            position: 'relative',
            overflow: 'hidden',
            opacity: (isLoading || otp.join('').length !== 6) ? 0.85 : 1
          }}
        >
          {isLoading ? (
            <div style={{ width: '18px', height: '18px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', marginRight: '8px', animation: 'spin 1s linear infinite' }} />
          ) : (
            'Verify Code'
          )}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '24px', color: '#6b7280', fontSize: '13px' }}>
        <p style={{ marginBottom: '8px' }}>Didn't receive the code?</p>
        {canResend ? (
          <button
            onClick={handleResend}
            style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '800', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Resend Code
          </button>
        ) : (
          <p style={{ color: '#9ca3af' }}>
            Resend available in {resendTimer}s
          </p>
        )}
      </div>

      <div style={{ marginTop: '32px', padding: '16px', background: '#eff6ff', borderRadius: '8px' }}>
        <p style={{ fontSize: '12px', color: '#1d4ed8', textAlign: 'center' }}>
          💡 <strong>Demo Tip:</strong> Use code <span style={{ fontFamily: 'monospace', background: '#dbeafe', padding: '2px 4px', borderRadius: '4px' }}>123456</span> to proceed
        </p>
      </div>
    </div>
  );
};

export default OTPVerification;
