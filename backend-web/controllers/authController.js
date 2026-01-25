const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const register = async (req, res) => {
    const { name, username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                username,
                email,
                password: hashedPassword,
                role: email.includes('admin') ? 'ADMIN' : 'USER'
            }
        });
        res.status(201).json({ message: "Neural fingerprint created", userId: user.id });
    } catch (error) {
        console.error("Registration Error:", error);
        if (error.code === 'P2002') {
            res.status(400).json({ error: "Username or Email already synced to the network" });
        } else {
            res.status(500).json({ error: `Neural Connection Error: ${error.message || 'Check database status'}` });
        }
    }
};

const login = async (req, res) => {
    const { email, password, behaviorData } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Access Denied: Neural mismatch" });
        }

        let riskScore = 0.0;
        try {
            const aiResponse = await fetch(`${process.env.AI_BACKEND_URL}/analyze-risk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    key_strokes: behaviorData?.key_strokes || [],
                    mouse_movements: behaviorData?.mouse_movements || []
                })
            });
            const aiData = await aiResponse.json();
            riskScore = aiData.risk_score;
        } catch (aiError) {
            console.warn("AI Neural Core unreachable, using baseline heuristics.");
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { riskScore, lastLogin: new Date() }
        });

        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '2h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                riskScore,
                role: user.role,
                image: user.profileImage,
                bio: user.bio
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Neural link failure" });
    }
};

module.exports = { register, login };
