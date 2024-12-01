const http = require('http');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers['x-access-token'] || req.headers['authorization'];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const options = {
            hostname: process.env.AUTH_SERVER||'localhost',
            port: 3001,
            path: '/user/verify',
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        };

        const verifyRequest = http.request(options, (verifyResponse) => {
            let data = '';

            verifyResponse.on('data', (chunk) => {
                data += chunk;
            });

            verifyResponse.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    if (parsedData.success) {
                        req.user = parsedData.user;
                        next();
                    } else {
                        res.status(401).json({
                            success: false,
                            message: 'Invalid token'
                        });
                    }
                } catch (error) {
                    res.status(500).json({
                        success: false,
                        message: 'Error processing auth server response'
                    });
                }
            });
        });

        verifyRequest.on('error', (error) => {
            res.status(500).json({
                success: false,
                message: 'Error connecting to auth server'
            });
        });

        // Add timeout handling
        verifyRequest.setTimeout(5000, () => {
            verifyRequest.destroy();
            res.status(504).json({
                success: false,
                message: 'Auth server timeout'
            });
        });

        verifyRequest.end();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal post server error'
        });
    }
};

module.exports = authMiddleware;
