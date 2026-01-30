/**
 * Socket Authentication Middleware
 * 
 * Purpose: Authenticates socket connections using JWT tokens.
 * This ensures only authenticated users can connect to the WebSocket server.
 * 
 * How it works:
 * 1. Client sends JWT token in socket handshake: io({ auth: { token: "jwt-token" } })
 * 2. This middleware extracts and verifies the token
 * 3. If valid, attaches user info to socket object
 * 4. If invalid, rejects the connection
 */

const jwt = require('jsonwebtoken');
const User = require('../../schemas/User');

/**
 * Middleware function for Socket.IO authentication
 * @param {Object} socket - The socket connection object
 * @param {Function} next - Callback to proceed or reject connection
 */
const socketAuthMiddleware = async (socket, next) => {
    try {
        // Step 1: Get token from socket handshake
        const token = socket.handshake.auth.token;

        // Step 2: Check if token exists
        if (!token) {
            // Allow connection but mark as unauthenticated (for public features)
            socket.user = null;
            return next();
        }

        // Step 3: Verify the JWT token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Step 4: Find user in database
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            // User not found, allow connection but unauthenticated
            socket.user = null;
            return next();
        }

        // Step 5: Attach user to socket for later use
        socket.user = user;

        // Step 6: Proceed with connection
        next();

    } catch (error) {
        // Token is invalid or expired
        console.log('[Socket Auth] Invalid token:', error.message);
        socket.user = null;
        next(); // Allow connection but as unauthenticated
    }
};

module.exports = socketAuthMiddleware;
