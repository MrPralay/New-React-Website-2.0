import React, { useState } from 'react';
import { Grid, Play, Bookmark, User as UserIcon, Settings, ShieldCheck, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileView = ({ user, currentUser, posts = [] }) => {
    const [activeTab, setActiveTab] = useState('posts');
    const isOwnProfile = currentUser?.id === user.id;

    const tabs = [
        { id: 'posts', label: 'Posts', icon: <Grid size={16} /> },
        { id: 'reels', label: 'Reels', icon: <Play size={16} /> },
        { id: 'saved', label: 'Saved', icon: <Bookmark size={16} /> },
        { id: 'tagged', label: 'Tagged', icon: <UserIcon size={16} /> },
    ];

    return (
        <div className="flex-1 max-w-4xl mx-auto py-12 px-4 md:px-8">
            {/* Header / Intro */}
            <div className="flex flex-col md:flex-row gap-10 md:gap-20 items-center md:items-start mb-16">
                <div className="relative group">
                    <div className="story-ring p-[4px] w-32 h-32 md:w-44 md:h-44">
                        <img
                            src={user.image || "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"}
                            className="w-full h-full rounded-full border-4 border-black object-cover"
                            alt={user.username}
                        />
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                        <h2 className="text-3xl font-light text-white">{user.username}</h2>
                        <div className="flex gap-2">
                            {isOwnProfile ? (
                                <>
                                    <button className="px-6 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors uppercase tracking-widest">Edit Neural Link</button>
                                    <button className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                                        <Settings size={20} className="text-gray-400" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="px-8 py-2 bg-emerald-500 text-black text-xs font-bold rounded-xl hover:bg-emerald-400 transition-colors uppercase tracking-widest">Connect</button>
                                    <button className="px-8 py-2 bg-white/5 text-white text-xs font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-colors uppercase tracking-widest">Message</button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center md:justify-start gap-12 mb-8">
                        <div className="text-center md:text-left">
                            <span className="text-xl font-bold text-white block">{user._count?.posts || 0}</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Synapses</span>
                        </div>
                        <div className="text-center md:text-left">
                            <span className="text-xl font-bold text-white block">{user._count?.followers || 0}</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Followers</span>
                        </div>
                        <div className="text-center md:text-left">
                            <span className="text-xl font-bold text-white block">{user._count?.following || 0}</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Following</span>
                        </div>
                    </div>

                    <div className="text-center md:text-left">
                        <h3 className="text-white font-bold mb-2">{user.name}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-md">
                            {user.bio || "Synchronizing with the neural hive mind. Quantum explorer in the SynapseX realm."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-white/5 flex justify-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 py-4 border-t-2 -mt-[1px] transition-all ${activeTab === tab.id ? 'border-emerald-500 text-white' : 'border-transparent hover:text-gray-300'}`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-3 gap-1 md:gap-6">
                {posts.length > 0 ? (
                    posts.map((post, i) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="aspect-square bg-[#111] border border-white/5 rounded-2xl overflow-hidden relative group cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>
                            <img
                                src={post.imageUrl}
                                alt="Post"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-3 py-20 text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                            {activeTab === 'posts' ? <Grid size={32} className="text-gray-600" /> : <Bookmark size={32} className="text-gray-600" />}
                        </div>
                        <h3 className="text-white text-lg font-bold mb-1">No {activeTab} Visible</h3>
                        <p className="text-gray-500 text-xs">Start your journey and capture your first neural synapse.</p>
                        {isOwnProfile && activeTab === 'posts' && (
                            <button className="mt-8 flex items-center gap-2 mx-auto text-emerald-400 font-bold text-xs uppercase tracking-widest hover:text-emerald-300 transition-colors">
                                <Plus size={16} /> New post
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileView;
