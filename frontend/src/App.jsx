import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoginBox from './components/Login/LoginBox';
import SignUpBox from './components/Login/SignUpBox';
import OTPBox from './components/Login/OTPBox';
import ForgotPasswordBox from './components/Login/ForgotPasswordBox';
import LandingPage from './components/Login/LandingPage';
import InstagramLayout from './components/Social/InstagramLayout';

const SynapseLogo = ({ size = 60 }) => (
    <motion.div
        style={{ width: size, height: size }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative flex items-center justify-center"
    >
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-2 border-emerald-500/20 rotate-45 rounded-sm" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3], rotate: 45 }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="w-1/2 h-1/2 bg-emerald-500 shadow-[0_0_20px_#10b981] rounded-sm" />
        {[0, 1, 2, 3].map((i) => (
            <motion.div key={i} animate={{ y: [-10, 10, -10], x: i % 2 === 0 ? [-5, 5, -5] : [5, -5, 5], opacity: [0, 1, 0] }} transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }} className="absolute w-1 h-1 bg-emerald-400 rounded-full" style={{ top: i < 2 ? '0%' : '100%', left: i % 2 === 0 ? '0%' : '100%' }} />
        ))}
    </motion.div>
);

function App() {
    const [user, setUser] = useState(null);
    const [view, setView] = useState('landing');
    const [isLoading, setIsLoading] = useState(true);
    const [otpEmail, setOtpEmail] = useState('');
    const [isExited, setIsExited] = useState(false);
    const [isShuttingDown, setIsShuttingDown] = useState(false);

    const LIVE_API = "https://synapse-backend.pralayd140.workers.dev";

    useEffect(() => {
        const verifySessionGhost = async () => {
            // 1. Check for the Session Ghost (Vanishes when tab closes)
            const token = sessionStorage.getItem('synapse_session_token');

            if (!token) {
                setTimeout(() => setIsLoading(false), 800);
                return;
            }

            try {
                // 2. Validate with Neural Core
                const response = await fetch(`${LIVE_API}/api/auth/me`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                    setView('profile');
                    console.log("Neural Ghost Synchronized.");
                } else {
                    sessionStorage.removeItem('synapse_session_token');
                    setView('landing');
                }
            } catch (error) {
                console.error("Neural sync interrupted.");
                setView('landing');
            } finally {
                setTimeout(() => setIsLoading(false), 1200);
            }
        };

        verifySessionGhost();
    }, []);

    const handleLoginSuccess = (loginData) => {
        const { user: userData, token } = loginData;
        setUser(userData);
        // Save to Session Ghost ( survives refresh, dies on tab close )
        if (token) sessionStorage.setItem('synapse_session_token', token);
        setView('profile');
    };

    const handleLogout = async () => {
        try { await fetch(`${LIVE_API}/api/auth/logout`, { method: 'POST', credentials: 'include' }); } catch (e) { }
        setUser(null);
        sessionStorage.removeItem('synapse_session_token');
        setView('landing');
    };

    const pageVariants = { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 } };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <SynapseLogo size={50} />
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-500 text-[9px] uppercase tracking-[0.4em] font-bold mt-10 ml-1">
                        Neural Synchronization
                    </motion.p>
                </div>
            </div>
        );
    }

    if (isExited) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
                <SynapseLogo size={40} />
                <h1 className="text-2xl font-bold tracking-tighter text-white mb-2 italic mt-8">Connection Severed</h1>
                <button onClick={() => setIsExited(false)} className="mt-16 text-[9px] text-gray-700 hover:text-emerald-500/50 uppercase tracking-[0.3em] font-bold transition-colors"> [ Re-initialize Link ] </button>
            </div>
        );
    }

    return (
        <motion.div className="App bg-black min-h-screen" animate={isShuttingDown ? { scaleY: 0.001, opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } } : { scaleY: 1, opacity: 1 }}>
            <AnimatePresence mode="wait">
                {view === 'landing' && (
                    <motion.div key="landing" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}>
                        <LandingPage onLogin={() => setView('login')} onRegister={() => setView('signup')} onExit={() => setIsShuttingDown(true)} />
                    </motion.div>
                )}
                {view === 'login' && (
                    <motion.div key="login" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                        <LoginBox onSwitch={() => setView('signup')} onBack={() => setView('landing')} onLoginSuccess={handleLoginSuccess} onForgot={() => setView('forgot')} />
                    </motion.div>
                )}
                {view === 'forgot' && (
                    <motion.div key="forgot" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                        <ForgotPasswordBox onBack={() => setView('login')} onSuccess={() => setView('login')} />
                    </motion.div>
                )}
                {view === 'signup' && (
                    <motion.div key="signup" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                        <SignUpBox onSwitch={() => setView('login')} onBack={() => setView('landing')} onSuccess={(email) => { setOtpEmail(email); setView('otp'); }} />
                    </motion.div>
                )}
                {view === 'otp' && (
                    <motion.div key="otp" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                        <OTPBox email={otpEmail} onVerified={() => setView('login')} onBack={() => setView('signup')} />
                    </motion.div>
                )}
                {view === 'profile' && user && (
                    <motion.div key="profile" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}>
                        <InstagramLayout currentUser={user} onLogout={handleLogout} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default App;
