const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRETE=process.env.JWT_SECRETE

router.post('/verify', async (req, res) => {
  try {
      const authHeader = req.headers['authorization'];
      
      if (!authHeader) {
          return res.status(401).json({
              success: false,
              message: 'No authorization header provided'
          });
      }

      const token = authHeader.startsWith('Bearer ') 
          ? authHeader.slice(7) 
          : authHeader;
      const decoded = jwt.verify(token.replaceAll('"',''), JWT_SECRETE);

      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
          return res.status(401).json({
              success: false,
              message: 'Token has expired'
          });
      }

      return res.status(200).json({
          success: true,
          user: {
              userId: decoded.user,
          }
      });

  } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
          return res.status(401).json({
              success: false,
              message: 'Invalid token'
          });
      }

      console.error('Token verification error:', error);
      return res.status(500).json({
          success: false,
          message: 'Internal server error during verification'
      });
  }
});

module.exports = router;