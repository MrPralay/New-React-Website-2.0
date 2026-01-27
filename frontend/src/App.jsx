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
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-emerald-500/20 rotate-45 rounded-sm"
        />
        <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3], rotate: 45 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1/2 h-1/2 bg-emerald-500 shadow-[0_0_20px_#10b981] rounded-sm"
        />
        {[0, 1, 2, 3].map((i) => (
            <motion.div
                key={i}
                animate={{ y: [-10, 10, -10], x: i % 2 === 0 ? [-5, 5, -5] : [5, -5, 5], opacity: [0, 1, 0] }}
                transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
                className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                style={{ top: i < 2 ? '0%' : '100%', left: i % 2 === 0 ? '0%' : '100%' }}
            />
        ))}
    </motion.div>
);

function App() {
    const [view, setView] = useState('landing');
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [otpEmail, setOtpEmail] = useState('');
    const [isExited, setIsExited] = useState(false);
    const [isShuttingDown, setIsShuttingDown] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const storedUser = localStorage.getItem('synapse_user');
            const token = localStorage.getItem('synapse_token'); // Get backup token

            if (!storedUser) {
                setTimeout(() => setIsLoading(false), 1200);
                return;
            }

            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const response = await fetch(`${apiUrl}/api/auth/me`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Authorization': `Bearer ${token}` // Send backup identity header
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                    setView('profile');
                    localStorage.setItem('synapse_user', JSON.stringify(data.user));
                } else if (response.status === 401 || response.status === 403) {
                    // Only log out if the session is explicitly invalid/expired
                    localStorage.removeItem('synapse_user');
                    localStorage.removeItem('synapse_token');
                    setView('landing');
                } else {
                    // If it's a 404 (not deployed yet) or server error, use the backup data
                    console.warn("Neural sync bypassed: Switching to persistent local mode.");
                    setUser(JSON.parse(storedUser));
                    setView('profile');
                }
            } catch (error) {
                // If offline, keep the last known user
                console.warn("Neural Core Offline - Mode: Local Persistence");
                setUser(JSON.parse(storedUser));
                setView('profile');
            } finally {
                setTimeout(() => setIsLoading(false), 1500);
            }
        };

        checkSession();
    }, []);

    const handleLoginSuccess = (userData, token) => {
        setUser(userData);
        localStorage.setItem('synapse_user', JSON.stringify(userData));
        if (token) localStorage.setItem('synapse_token', token); // Save backup identity
        setView('profile');
    };

    const handleLogout = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await fetch(`${apiUrl}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) { console.error("Neural logout failed:", error); }

        setUser(null);
        localStorage.removeItem('synapse_user');
        localStorage.removeItem('synapse_token');
        setView('landing');
    };

    const pageVariants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

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
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <SynapseLogo size={40} />
                    <h1 className="text-2xl font-bold tracking-tighter text-white mb-2 italic mt-8">Connection Severed</h1>
                    <button onClick={() => setIsExited(false)} className="mt-16 text-[9px] text-gray-700 hover:text-emerald-500/50 uppercase tracking-[0.3em] font-bold transition-colors">
                        [ Re-initialize Link ]
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div
            className="App bg-black min-h-screen"
            animate={isShuttingDown ? { scaleY: 0.001, opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } } : { scaleY: 1, opacity: 1 }}
            onAnimationComplete={() => {
                if (isShuttingDown) {
                    setIsExited(true);
                    setIsShuttingDown(false);
                    try { window.close(); } catch (e) { }
                }
            }}
        >
            <AnimatePresence mode="wait">
                {view === 'landing' && (
                    <motion.div key="landing" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}>
                        <LandingPage
                            onLogin={() => setView('login')}
                            onRegister={() => setView('signup')}
                            onExit={() => setIsShuttingDown(true)}
                        />
                    </motion.div>
                )}
                {view === 'login' && (
                    <motion.div key="login" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                        <LoginBox
                            onSwitch={() => setView('signup')}
                            onBack={() => setView('landing')}
                            onLoginSuccess={(data) => handleLoginSuccess(data, data.token)}
                            onForgot={() => setView('forgot')}
                        />
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
