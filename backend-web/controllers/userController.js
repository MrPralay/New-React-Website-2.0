import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getProfile = async (c) => {
    const username = c.req.param('username');
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
        if (!user) {
            return c.json({ success: false, error: "Identity not found" }, 404);
        }
        return c.json({ success: true, data: user });
    } catch (error) {
        console.error("Profile Error:", error);
        return c.json({ success: false, error: "Search failed" }, 500);
    }
};
