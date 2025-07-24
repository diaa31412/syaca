const jwt = require('jsonwebtoken');
const User = require('../models/userModel')
const Session = require('../models/sessionModel');
const generateDeviceFingerprint = require('../utils/deviceFingerprint');




module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    // Verify token signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user in database
    const user = await User.findByPk(decoded.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

     // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ error: 'Your account is not active. Please sign in again.' });
    }

   // Find user session
    const session = await Session.findOne({ 
      where: { 
        userId: user.id,
        token: token
      }
    });

   // Handle missing session
    if (!session) {
      // تعطيل المستخدم إذا لم توجد جلسات نشطة
      // await user.update({ isActive: false });
      return res.status(403).json({ error: 'Session expired. Please sign in again.' });
    }

    // Check session expiration (inactivity timeout)
    const now = new Date();
    const SESSION_TIMEOUT = process.env.SESSION_TIMEOUT || 30 * 60 * 1000; // 30 minutes default
    const lastActivity = session.lastActivity || session.createdAt;
    
    if (now - lastActivity > SESSION_TIMEOUT) {
      await session.destroy();
      return res.status(403).json({ error: 'Session expired due to inactivity. Please sign in again.' });
    }

     // Verify device fingerprint
    const currentFingerprint = generateDeviceFingerprint(req);
    
    // التحقق من مطابقة بصمة الجهاز
    if (session.deviceFingerprint !== currentFingerprint) {
      // حذف الجلسة الحالية (قد تكون محاولة اختراق)
      await session.destroy();
      
      // تعطيل المستخدم على جميع الأجهزة
      await user.update({ isActive: false });
      
      return res.status(403).json({ 
        error: 'You signed in from another device. Please sign in again.' 
      });
    }

     // Update session activity (only if all checks pass)
    await session.update({ lastActivity: new Date() });

     // Attach user to request
    req.user = {
      id: user.id,
      role: user.role,
      isActive: user.isActive
    };
    
    next();
  } catch (err) {
      // Handle specific JWT errors
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expired' });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token' });
    }
     // Handle other errors
    res.status(500).json({ error: 'Authentication failed', details: err.message });
  }
};