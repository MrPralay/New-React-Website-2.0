import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoginBox from './components/Login/LoginBox';
import SignUpBox from './components/Login/SignUpBox';
import OTPBox from './components/Login/OTPBox';
import LandingPage from './components/Login/LandingPage';
import InstagramLayout from './components/Social/InstagramLayout';

function App() {
    const [view, setView] = useState('landing');
    const [user, setUser] = useState(null);
    const [otpEmail, setOtpEmail] = useState('');
    const [isExited, setIsExited] = useState(false);
    const [isShuttingDown, setIsShuttingDown] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('synapse_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setView('profile');
        }
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

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('synapse_user');
        setView('landing');
    };

    const pageVariants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    if (isExited) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <div className="w-16 h-16 border border-emerald-500/10 rounded-full flex items-center justify-center mb-8 mx-auto relative overflow-hidden">
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"
                        />
                        <div className="w-1.5 h-1.5 bg-emerald-500/40 rounded-full shadow-[0_0_10px_#10b981]" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tighter text-white mb-2 italic">Connection Severed</h1>
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">The Neural Gateway has been successfully decommissioned</p>
                    <p className="text-gray-600 text-[9px] mt-12 animate-pulse">You may now safely close this browser tab</p>

                    <button
                        onClick={() => setIsExited(false)}
                        className="mt-16 text-[9px] text-gray-700 hover:text-emerald-500/50 uppercase tracking-[0.3em] font-bold transition-colors"
                    >
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
                    try {
                        window.close();
                    } catch (e) {
                        console.warn("Browser blocked window.close() - showing fallback UI.");
                    }
                }
            }}
        >
            <AnimatePresence mode="wait">
                {view === 'landing' && (
                    <motion.div
                        key="landing"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.5 }}
                    >
                        <LandingPage
                            onLogin={() => setView('login')}
                            onRegister={() => setView('signup')}
                            onExit={() => setIsShuttingDown(true)}
                        />
                    </motion.div>
                )}
                {view === 'login' && (
                    <motion.div
                        key="login"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.4 }}
                    >
                        <LoginBox
                            onSwitch={() => setView('signup')}
                            onBack={() => setView('landing')}
                            onLoginSuccess={handleLoginSuccess}
                        />
                    </motion.div>
                )}
                {view === 'signup' && (
                    <motion.div
                        key="signup"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.4 }}
                    >
                        <SignUpBox
                            onSwitch={() => setView('login')}
                            onBack={() => setView('landing')}
                            onSuccess={handleRegistrationSuccess}
                        />
                    </motion.div>
                )}
                {view === 'otp' && (
                    <motion.div
                        key="otp"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.4 }}
                    >
                        <OTPBox
                            email={otpEmail}
                            onVerified={handleOTPVerified}
                            onBack={() => setView('signup')}
                        />
                    </motion.div>
                )}
                {view === 'profile' && user && (
                    <motion.div
                        key="profile"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.5 }}
                    >
                        <InstagramLayout currentUser={user} onLogout={handleLogout} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default App;
