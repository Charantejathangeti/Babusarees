import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { LoadingSpinner, ErrorAlert, Icons } from '../constants';

interface AuthProps {
  setUser: (user: User | null) => void;
}

const Auth: React.FC<AuthProps> = ({ setUser }) => {
  const navigate = useNavigate();
  const [isAdminPortal, setIsAdminPortal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User OTP State
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Admin Credentials State
  const [adminStep, setAdminStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // SECURE PRODUCTION CREDENTIALS
  const MASTER_ADMIN = {
    email: 'babustextiles@gmail.com',
    password: 'admin@123',
    securityCode: 'BT-1122-SEC'
  };

  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleUserOtpRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError("Enter valid 10-digit number.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 800));
    setOtpSent(true);
    setResendTimer(30);
    setIsSubmitting(false);
  };

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Enter 6-digit code.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUser({
      id: `USR-${Date.now()}`,
      name: `Member (${phone.slice(-4)})`,
      email: `${phone}@mobile.bt`,
      role: 'RETAIL'
    });
    navigate('/');
  };

  const handleAdminStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setIsSubmitting(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1200));

    if (email.toLowerCase().trim() === MASTER_ADMIN.email && password === MASTER_ADMIN.password) {
      setAdminStep(2);
      setIsSubmitting(false);
    } else {
      handleFailedAttempt();
    }
  };

  const handleAdminStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setIsSubmitting(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (securityCode === MASTER_ADMIN.securityCode) {
      setUser({
        id: 'ADMIN-ROOT-01',
        name: 'Babu Administrator',
        email: email,
        role: 'ADMIN'
      });
      navigate('/admin');
    } else {
      handleFailedAttempt();
    }
  };

  const handleFailedAttempt = () => {
    const newCount = failedAttempts + 1;
    setFailedAttempts(newCount);
    setIsSubmitting(false);
    if (newCount >= 3) {
      setIsLocked(true);
      setError("Terminal Locked: Too many failed attempts.");
    } else {
      setError(`Access Denied. ${3 - newCount} attempts remaining.`);
    }
  };

  const resetState = () => {
    setError(null);
    setOtpSent(false);
    setPhone('');
    setOtp('');
    setEmail('');
    setPassword('');
    setSecurityCode('');
    setAdminStep(1);
    setIsLocked(false);
    setFailedAttempts(0);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#FDFBF7]">
      <div className="w-full max-w-sm bg-white shadow-2xl transition-all duration-300 border border-stone-100">
        
        {/* Universal Switcher */}
        <div className="flex border-b border-stone-100">
          <button 
            onClick={() => { setIsAdminPortal(false); resetState(); }}
            className={`flex-1 py-5 text-[9px] font-black uppercase tracking-[0.2em] transition-all ${!isAdminPortal ? 'text-[#064E3B] bg-stone-50/50 border-b-2 border-[#064E3B]' : 'text-stone-300 hover:text-stone-500'}`}
          >
            Customer Hub
          </button>
          <button 
            onClick={() => { setIsAdminPortal(true); resetState(); }}
            className={`flex-1 py-5 text-[9px] font-black uppercase tracking-[0.2em] transition-all ${isAdminPortal ? 'text-[#064E3B] bg-stone-50/50 border-b-2 border-[#064E3B]' : 'text-stone-300 hover:text-stone-500'}`}
          >
            Admin Terminal
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold serif text-stone-800 uppercase tracking-tight">
              {isAdminPortal ? 'System Authorization' : 'Member Access'}
            </h2>
            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mt-1">
              {isAdminPortal ? 'Official Personnel Only' : 'Registry Membership'}
            </p>
          </div>

          {error && <div className="mb-6"><ErrorAlert message={error} /></div>}

          {isAdminPortal ? (
            /* ADMIN LOGIN FORM */
            <div className="animate-in fade-in duration-500">
              {isLocked ? (
                <div className="text-center py-10">
                   <div className="text-red-600 text-3xl mb-4">⚠️</div>
                   <p className="text-red-600 font-black text-[10px] uppercase tracking-widest">Access Restricted</p>
                   <p className="text-stone-400 text-[9px] mt-4 italic">Please contact support for terminal unlocking.</p>
                </div>
              ) : adminStep === 1 ? (
                <form onSubmit={handleAdminStep1} className="space-y-4">
                  <div>
                    <label className="block text-[8px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Email Address</label>
                    <input 
                      type="email" required value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 p-3 text-[10px] font-black outline-none focus:border-[#064E3B] transition-all" 
                      placeholder="admin@babustextiles.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Password</label>
                    <input 
                      type="password" required value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 p-3 text-[10px] font-black outline-none focus:border-[#064E3B] transition-all" 
                      placeholder="••••••••"
                    />
                  </div>
                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-[#064E3B] text-white py-4 font-black uppercase tracking-widest text-[9px] shadow-lg hover:bg-[#043327] transition-all disabled:opacity-50 mt-2"
                  >
                    {isSubmitting ? 'VERIFYING...' : 'INITIATE SESSION'}
                  </button>
                  <div className="pt-6 mt-6 border-t border-stone-100">
                    <p className="text-[7px] text-stone-300 uppercase font-black tracking-widest mb-2 text-center">Demo Credentials</p>
                    <p className="text-[8px] text-stone-400 font-bold text-center">Email: {MASTER_ADMIN.email}</p>
                    <p className="text-[8px] text-stone-400 font-bold text-center">Pass: {MASTER_ADMIN.password}</p>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleAdminStep2} className="space-y-6">
                  <div className="text-center">
                    <p className="text-stone-400 text-[9px] italic mb-4">Enter secondary security key for confirmation.</p>
                    <input 
                      type="text" required autoFocus value={securityCode}
                      onChange={(e) => setSecurityCode(e.target.value.toUpperCase())}
                      className="w-full bg-stone-50 border border-stone-200 p-4 text-center text-lg font-black text-[#064E3B] outline-none tracking-widest" 
                      placeholder="BT-XXXX"
                    />
                    <p className="text-[7px] text-stone-300 uppercase font-black tracking-widest mt-4">Code: {MASTER_ADMIN.securityCode}</p>
                  </div>
                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-[#064E3B] text-white py-4 font-black uppercase tracking-widest text-[9px] shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? 'AUTHORIZING...' : 'CONFIRM ACCESS'}
                  </button>
                  <button type="button" onClick={() => setAdminStep(1)} className="w-full text-[8px] font-black text-stone-400 uppercase tracking-widest text-center">Back to Credentials</button>
                </form>
              )}
            </div>
          ) : (
            /* STANDARD RETAIL AUTH */
            <div className="animate-in fade-in duration-500">
              {!otpSent ? (
                <form onSubmit={handleUserOtpRequest} className="space-y-4">
                  <div>
                    <label className="block text-[8px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Phone Number</label>
                    <div className="flex">
                      <div className="bg-stone-50 border border-stone-200 px-3 py-3 text-[10px] font-black text-stone-400">+91</div>
                      <input 
                        type="tel" required maxLength={10} value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="flex-grow bg-stone-50 border border-stone-200 p-3 text-[10px] font-black outline-none focus:border-[#064E3B] tracking-widest" 
                        placeholder="MOBILE"
                      />
                    </div>
                  </div>
                  <button 
                    disabled={isSubmitting || phone.length < 10}
                    className="w-full bg-[#064E3B] text-white py-4 font-black uppercase tracking-[0.2em] text-[9px] shadow-lg hover:bg-[#043327] transition-all disabled:opacity-50 mt-2"
                  >
                    {isSubmitting ? 'SENDING...' : 'SEND OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleUserLogin} className="space-y-6">
                  <div className="text-center">
                    <p className="text-stone-400 text-[9px] italic mb-4">Enter 6-digit code sent to your device.</p>
                    <input 
                      type="text" required maxLength={6} autoFocus value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-stone-50 border border-stone-200 p-4 text-center text-2xl font-black text-[#064E3B] outline-none tracking-[0.4em]" 
                      placeholder="000000"
                    />
                    <p className="text-[7px] text-stone-300 uppercase font-black tracking-widest mt-4">Hint: Use any 6 digits (Demo)</p>
                  </div>
                  <button 
                    disabled={isSubmitting || otp.length !== 6}
                    className="w-full bg-[#064E3B] text-white py-4 font-black uppercase tracking-[0.2em] text-[9px] shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? 'VERIFYING...' : 'LOGIN'}
                  </button>
                  <button type="button" onClick={() => setOtpSent(false)} className="w-full text-[8px] font-black text-stone-400 uppercase tracking-widest text-center">Change Number</button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;