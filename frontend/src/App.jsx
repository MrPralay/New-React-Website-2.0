import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoginBox from './components/Login/LoginBox';
import SignUpBox from './components/Login/SignUpBox';
import OTPBox from './components/Login/OTPBox';
import ForgotPasswordBox from './components/Login/ForgotPasswordBox';
import LandingPage from './components/Login/LandingPage';
import InstagramLayout from './components/Social/InstagramLayout';

// High-End SynapseX Neural Core Logo Component
const SynapseLogo = ({ size = 60 }) => (
    <motion.div
        style={{ width: size, height: size }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative flex items-center justify-center"
    >
        {/* Outer Diamond Ring */}
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-emerald-500/20 rotate-45 rounded-sm"
        />

        {/* Inner Pulsing Diamond */}
        <motion.div
            animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.8, 0.3],
                rotate: 45
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1/2 h-1/2 bg-emerald-500 shadow-[0_0_20px_#10b981] rounded-sm"
        />

        {/* Neural Connections (Floating Particles) */}
        {[0, 1, 2, 3].map((i) => (
            <motion.div
                key={i}
                animate={{
                    y: [-10, 10, -10],
                    x: i % 2 === 0 ? [-5, 5, -5] : [5, -5, 5],
                    opacity: [0, 1, 0]
                }}
                transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
                className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                style={{
                    top: i < 2 ? '0%' : '100%',
                    left: i % 2 === 0 ? '0%' : '100%'
                }}
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

            if (!storedUser) {
                setTimeout(() => setIsLoading(false), 1200);
                return;
            }

            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const response = await fetch(`${apiUrl}/api/auth/me`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                    setView('profile');
                    localStorage.setItem('synapse_user', JSON.stringify(data.user));
                } else {
                    localStorage.removeItem('synapse_user');
                }
            } catch (error) {
                console.warn("Using offline fallback.");
                setUser(JSON.parse(storedUser));
                setView('profile');
            } finally {
                setTimeout(() => setIsLoading(false), 1500);
            }
        };

        checkSession();
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        localStorage.setItem('synapse_user', JSON.stringify(userData));
        setView('profile');
    };

    const handleRegistrationSuccess = (email) => {
        setOtpEmail(email);
        setView('otp');
    };

    const handleOTPVerified = () => {
        setView('login');
    };

    const handleLogout = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await fetch(`${apiUrl}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error("Neural logout failed:", error);
        }
        setUser(null);
        localStorage.removeItem('synapse_user');
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
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-emerald-500 text-[9px] uppercase tracking-[0.4em] font-bold mt-10 ml-1"
                    >
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
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">The Neural Gateway has been decommissioned</p>
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
                    try { window.close(); } catch (e) { console.warn("Browser blocked window.close()"); }
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
                            onLoginSuccess={handleLoginSuccess}
                            onForgot={() => setView('forgot')}
                        />
                    </motion.div>
                )}
                {view === 'forgot' && (
                    <motion.div key="forgot" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                        <ForgotPasswordBox
                            onBack={() => setView('login')}
                            onSuccess={() => setView('login')}
                        />
                    </motion.div>
                )}
                {view === 'signup' && (
                    <motion.div key="signup" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                        <SignUpBox
                            onSwitch={() => setView('login')}
                            onBack={() => setView('landing')}
                            onSuccess={handleRegistrationSuccess}
                        />
                    </motion.div>
                )}
                {view === 'otp' && (
                    <motion.div key="otp" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                        <OTPBox email={otpEmail} onVerified={handleOTPVerified} onBack={() => setView('signup')} />
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
