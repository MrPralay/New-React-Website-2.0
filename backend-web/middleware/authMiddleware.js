import jwt from 'jsonwebtoken';

const authenticateToken = async (c, next) => {
    const authHeader = c.req.header('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return c.json({ success: false, error: "Authentication token required" }, 401);
    }

    try {
        const user = jwt.verify(token, c.env.JWT_SECRET || 'fallback_secret_change_me');
        c.set('user', user);
        await next();
    } catch (err) {
        return c.json({ success: false, error: "Invalid or expired token" }, 403);
    }
};

export default authenticateToken;
