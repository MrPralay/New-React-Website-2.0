const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getFeed = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { username: true, name: true, profileImage: true }
                },
                _count: {
                    select: { likes: true, comments: true }
                }
            }
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: "Feed generation failure" });
    }
};

const createPost = async (req, res) => {
    const { caption, imageUrl } = req.body;
    try {
        const post = await prisma.post.create({
            data: {
                caption,
                imageUrl,
                userId: req.user.userId
            },
            include: {
                user: {
                    select: { username: true, name: true, profileImage: true }
                }
            }
        });
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: "Post synchronization failed" });
    }
};

module.exports = { getFeed, createPost };
