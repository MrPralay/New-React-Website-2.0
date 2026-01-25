import React from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const PostCard = ({ post }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="post-card"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 px-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-emerald-500/30 p-[1px]">
                        <img
                            src={post.user?.profileImage || "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"}
                            className="w-full h-full rounded-full object-cover"
                            alt={post.user?.username}
                        />
                    </div>
                    <div>
                        <h4 className="text-white text-sm font-bold leading-tight">{post.user?.name || post.user?.username}</h4>
                        <p className="text-gray-500 text-[10px] uppercase tracking-tighter">Bremen, Germany</p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Media */}
            <div className="aspect-[4/3] bg-black/40 overflow-hidden">
                <img
                    src={post.imageUrl}
                    className="w-full h-full object-cover"
                    alt="Post Media"
                    onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80";
                    }}
                />
            </div>

            {/* Actions */}
            <div className="p-4 px-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 group">
                            <Heart size={22} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                            <span className="text-[11px] font-bold text-gray-500">{post._count?.likes || 0}k Like</span>
                        </button>
                        <button className="flex items-center gap-2 group">
                            <MessageCircle size={22} className="text-gray-400 group-hover:text-emerald-400 transition-colors" />
                            <span className="text-[11px] font-bold text-gray-500">{post._count?.comments || 0} Comment</span>
                        </button>
                        <button className="flex items-center gap-2 group">
                            <Send size={22} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                            <span className="text-[11px] font-bold text-gray-500">Share</span>
                        </button>
                    </div>
                    <button className="flex items-center gap-2 group">
                        <Bookmark size={22} className="text-gray-400 group-hover:text-amber-400 transition-colors" />
                        <span className="text-[11px] font-bold text-gray-500">Saved</span>
                    </button>
                </div>

                {/* Caption */}
                <div className="space-y-1">
                    <p className="text-xs text-gray-300 leading-relaxed overflow-hidden text-ellipsis">
                        {post.caption}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default PostCard;
