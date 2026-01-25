const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getProfile = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                name: true,
                bio: true,
                profileImage: true,
                riskScore: true,
                createdAt: true,
                role: true,
                posts: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        _count: {
                            select: { likes: true, comments: true }
                        }
                    }
                },
                _count: {
                    select: {
                        posts: true,
                        followers: true,
                        following: true
                    }
                }
            }
        });
        if (!user) return res.status(404).json({ error: "Identity not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Search failed" });
    }
};

module.exports = { getProfile };
