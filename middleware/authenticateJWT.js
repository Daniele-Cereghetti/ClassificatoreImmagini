const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT
function authenticateJWT(req, res, next) {
    let token;

    // Get token from Authorization header or HttpOnly cookie
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ message: 'Authentication token missing or invalid.' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token.' });
        }

        // Add user information from token to request object
        req.user = decoded;
        next();
    });
}

module.exports = authenticateJWT;