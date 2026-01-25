const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllUsers = async (req, res) => {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: "Unauthorized access detected" });

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                name: true,
                role: true,
                riskScore: true,
                lastLogin: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch grid data" });
    }
};

module.exports = { getAllUsers };
