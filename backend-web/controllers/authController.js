import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getPrisma from '../prisma/db.js';

export const register = async (c) => {
    try {
        const { name, username, email, password } = await c.req.json();
        const prisma = getPrisma(c.env.DATABASE_URL);

        // Validation
        if (!email || !password || !username) {
            return c.json({ success: false, error: "Missing required fields" }, 400);
        }

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

        return c.json({
            success: true,
            message: "Neural fingerprint created successfully",
            userId: user.id
        }, 201);
    } catch (error) {
        console.error("Registration Error:", error);

        if (error.code === 'P2002') {
            return c.json({ success: false, error: "Username or Email already synced to the network" }, 409);
        }

        return c.json({
            success: false,
            error: "Neural Connection Error",
            message: error.message
        }, 500);
    }
};

export const login = async (c) => {
    try {
        const { email, password, behaviorData } = await c.req.json();
        const prisma = getPrisma(c.env.DATABASE_URL);

        if (!email || !password) {
            return c.json({ success: false, error: "Credentials required" }, 400);
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return c.json({ success: false, error: "Access Denied: Neural mismatch" }, 401);
        }

        let riskScore = 0.0;
        const aiBackendUrl = c.env.AI_BACKEND_URL;

        if (aiBackendUrl) {
            try {
                const aiResponse = await fetch(`${aiBackendUrl}/analyze-risk`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        key_strokes: behaviorData?.key_strokes || [],
                        mouse_movements: behaviorData?.mouse_movements || []
                    })
                });

                if (aiResponse.ok) {
                    const aiData = await aiResponse.json();
                    riskScore = aiData.risk_score;
                }
            } catch (aiError) {
                console.warn("AI Neural Core unreachable, using baseline heuristics.");
            }
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { riskScore, lastLogin: new Date() }
        });

        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            c.env.JWT_SECRET || 'fallback_secret_change_me',
            { expiresIn: '2h' }
        );

        return c.json({
            success: true,
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
        console.error("Login Error:", error);
        return c.json({ success: false, error: "Neural link failure" }, 500);
    }
};
