import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';

export default function PhoneVerification() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { user, setAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.phoneVerified) {
      navigate('/chat');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Auto-send code on mount
    sendCode();
  }, []);

  const sendCode = async () => {
    try {
      const { data } = await api.post('/verification/send-code');
      toast.success('Verification code sent!');
      // Show code in development
      if (data.code) {
        toast.success(`Dev Mode - Code: ${data.code}`, { duration: 10000 });
      }
    } catch (error) {
      toast.error('Failed to send code');
    }
  };

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }

    // Auto-submit when all filled
    if (newCode.every(digit => digit) && index === 5) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async (codeString) => {
    setLoading(true);
    try {
      const { data } = await api.post('/verification/verify-code', { 
        code: codeString || code.join('') 
      });
      
      toast.success('Phone verified successfully!');
      
      // Update user in store
      setAuth({ ...user, phoneVerified: true }, user.token);
      
      navigate('/chat');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid code');
      setCode(['', '', '', '', '', '']);
      document.getElementById('code-0')?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const { data } = await api.post('/verification/resend-code');
      toast.success('Code resent!');
      if (data.code) {
        toast.success(`Dev Mode - Code: ${data.code}`, { duration: 10000 });
      }
      setCode(['', '', '', '', '', '']);
      document.getElementById('code-0')?.focus();
    } catch (error) {
      toast.error('Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4"
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          
          <h1 className="text-2xl font-bold mb-2">Verify Your Phone</h1>
          <p className="text-gray-600 dark:text-gray-400">
            We sent a 6-digit code to<br />
            <span className="font-semibold">{user?.phoneNumber}</span>
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:border-blue-500 focus:outline-none transition"
              disabled={loading}
            />
          ))}
        </div>

        <button
          onClick={() => handleVerify()}
          disabled={loading || code.some(d => !d)}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition mb-4"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>

        <button
          onClick={handleResend}
          disabled={resending}
          className="w-full py-2 text-blue-500 hover:text-blue-600 font-medium flex items-center justify-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
          {resending ? 'Resending...' : 'Resend Code'}
        </button>

        <p className="text-xs text-center text-gray-500 mt-6">
          Code expires in 10 minutes
        </p>
      </motion.div>
    </div>
  );
}
