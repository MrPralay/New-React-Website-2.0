import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import FeedView from './FeedView';
import ProfileView from './ProfileView';
import RightSidebar from './RightSidebar';
import { AnimatePresence, motion } from 'framer-motion';

const InstagramLayout = ({ currentUser, onLogout }) => {
    const [view, setView] = useState('feed'); // feed, profile, explore, etc.
    const [posts, setPosts] = useState([]);
    const [userProfile, setUserProfile] = useState(currentUser);
    const [loading, setLoading] = useState(false);

    // Data loading from API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                if (view === 'feed') {
                    const res = await fetch(`${apiUrl}/api/social/feed`);
                    const data = await res.json();
                    setPosts(Array.isArray(data) ? data : []);
                } else if (view === 'profile') {
                    const res = await fetch(`${apiUrl}/api/user/profile/${currentUser.username}`);
                    const data = await res.json();
                    // data might be { success: true, data: profile } or just profile
                    const profileData = data.data || data;
                    setUserProfile(profileData);
                    setPosts(profileData.posts || []);
                }
            } catch (err) {
                console.error("Data Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [view, currentUser]);

    return (
        <div className="flex bg-[#050505] min-h-screen">
            {/* Left Sidebar */}
            <Sidebar
                user={currentUser}
                activeView={view}
                setView={setView}
                onLogout={onLogout}
            />

            {/* Main Content Area */}
            <main className="flex-1 ml-80 mr-80 min-h-screen">
                <AnimatePresence mode="wait">
                    {view === 'feed' && (
                        <motion.div
                            key="feed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <FeedView posts={posts} />
                        </motion.div>
                    )}

                    {view === 'profile' && (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ProfileView
                                user={userProfile}
                                currentUser={currentUser}
                                posts={posts.filter(p => p.userId === currentUser.id)}
                            />
                        </motion.div>
                    )}

                    {!['feed', 'profile'].includes(view) && (
                        <motion.div
                            key="other"
                            className="flex items-center justify-center min-h-screen text-gray-500 font-bold uppercase tracking-widest italic"
                        >
                            {view} Section Under Construction
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Right Sidebar (Hidden on small screens) */}
            <RightSidebar />
        </div>
    );
};

export default InstagramLayout;
