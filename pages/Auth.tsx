
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { LoadingSpinner, ErrorAlert } from '../constants';

interface AuthProps {
  setUser: (user: User | null) => void;
}

const Auth: React.FC<AuthProps> = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminPortal, setIsAdminPortal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityId, setSecurityId] = useState('');
  
  const navigate = useNavigate();

  const handleAuthentication = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Simulated network and encryption delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Master Administrative Secrets (Simulation of Backend database)
    const MASTER_ADMIN = {
      email: 'babustextiles@gmail.com',
      password: 'admin@123',
      securityId: 'BT-1122-SEC'
    };

    try {
      if (isAdminPortal) {
        // Strict Admin Verification
        if (
          email.toLowerCase().trim() === MASTER_ADMIN.email && 
          password === MASTER_ADMIN.password && 
          securityId === MASTER_ADMIN.securityId
        ) {
          const admin: User = {
            id: 'admin_master_01',
            name: 'Babu Administrator',
            email: email,
            role: 'ADMIN'
          };
          setUser(admin);
          navigate('/admin');
        } else {
          throw new Error("ACCESS DENIED: Administrative credentials or Security Master ID is invalid.");
        }
      } else {
        // Standard Customer Auth
        if (isLogin) {
          if (email.includes('@') && password.length >= 8) {
            const user: User = {
              id: `cust_${Date.now()}`,
              name: email.split('@')[0],
              email: email,
              role: 'RETAIL'
            };
            setUser(user);
            navigate('/');
          } else {
            throw new Error("Invalid email or password. Please check your heritage credentials.");
          }
        } else {
          // Registration simulation
          const user: User = {
            id: `cust_${Date.now()}`,
            name: email.split('@')[0],
            email: email,
            role: 'RETAIL'
          };
          setUser(user);
          navigate('/');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 animate-in zoom-in-95 duration-500 bg-[#FDFBF7]">
      <div className={`bg-white rounded-[3rem] shadow-2xl border border-stone-100 overflow-hidden transition-all duration-500 ${isAdminPortal ? 'ring-2 ring-emerald-500/20' : ''}`}>
        
        {/* Portal Header */}
        <div className={`p-10 text-center transition-colors duration-500 ${isAdminPortal ? 'bg-stone-900 text-white' : 'bg-[#064E3B] text-white'}`}>
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-3xl backdrop-blur-md">
            {isAdminPortal ? <span className="text-3xl">🛡️</span> : <span className="text-3xl">🏛️</span>}
          </div>
          <h1 className="text-3xl font-bold serif mb-2 tracking-tight">
            {isAdminPortal ? 'Admin Console' : (isLogin ? 'Member Registry' : 'New Collection Access')}
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">
            {isAdminPortal ? 'Secure Heritage Gateway' : 'Babu’s Textiles Portal'}
          </p>
        </div>

        <div className="p-10">
          {error && <div className="mb-8"><ErrorAlert message={error} /></div>}

          <form onSubmit={handleAuthentication} className="space-y-6">
            {!isLogin && !isAdminPortal && (
              <div className="animate-in slide-in-from-top-2">
                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Legal Identity Name</label>
                <input 
                  type="text" 
                  required 
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 focus:ring-1 focus:ring-[#064E3B] outline-none transition-all font-medium text-xs" 
                  placeholder="Full Legal Name"
                />
              </div>
            )}
            
            <div>
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Registry Email</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 focus:ring-1 focus:ring-[#064E3B] outline-none transition-all font-medium text-xs" 
                placeholder={isAdminPortal ? "Administrator ID" : "Email Address"}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Access Key</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 focus:ring-1 focus:ring-[#064E3B] outline-none transition-all font-mono text-xs" 
                placeholder="••••••••"
              />
            </div>

            {isAdminPortal && (
              <div className="animate-in slide-in-from-top-2">
                <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Security Master ID</label>
                <input 
                  type="text" 
                  required 
                  value={securityId}
                  onChange={(e) => setSecurityId(e.target.value)}
                  className="w-full bg-emerald-50 border border-emerald-100 rounded-xl p-4 focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-mono text-emerald-900 font-bold text-xs" 
                  placeholder="Registry Token"
                />
              </div>
            )}
            
            <button 
              disabled={isSubmitting}
              className={`w-full py-5 rounded-2xl transition-all shadow-xl disabled:opacity-70 flex items-center justify-center gap-3 tracking-[0.2em] uppercase text-[11px] font-black mt-4 text-white ${isAdminPortal ? 'bg-stone-900 hover:bg-black' : 'bg-[#064E3B] hover:bg-[#043327]'}`}
            >
              {isSubmitting ? <><LoadingSpinner className="scale-50 h-5 w-5" /> AUTHORIZING...</> : (isAdminPortal ? 'Log into Administrative Root' : (isLogin ? 'Enter Showroom' : 'Establish Registry'))}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-stone-100 flex flex-col gap-4 text-center">
            <button 
              onClick={() => { setIsAdminPortal(!isAdminPortal); setIsLogin(true); setError(null); }}
              className={`text-[9px] font-black uppercase tracking-[0.25em] transition-colors ${isAdminPortal ? 'text-[#064E3B]' : 'text-emerald-700 hover:text-emerald-900'}`}
            >
              {isAdminPortal ? 'Customer Portal Entry' : 'Administrative Security Terminal'}
            </button>
            {!isAdminPortal && (
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] hover:text-[#064E3B]"
              >
                {isLogin ? "No registry record? Join Heritage" : "Existing collection holder? Login"}
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-12 text-center opacity-30 flex flex-col items-center gap-4">
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 italic">"Threads of heritage, secured by tradition."</p>
         <div className="flex justify-center gap-3">
            {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-stone-300"></div>)}
         </div>
      </div>
    </div>
  );
};

export default Auth;
