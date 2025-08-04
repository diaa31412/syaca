
const User = require('../models/userModel');
const crypto = require('crypto'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const Session = require('../models/sessionModel');
const generateDeviceFingerprint = require('../utils/deviceFingerprint');
const { sendVerificationEmail } = require('../services/emailService');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();  
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
};

exports.signup = async (req, res) => {
  const { userName, email, password } = req.body;
    
  try {
    
    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ userName, email, password: hashedPassword  , verificationCode : code ,isActive : false});
     

    await sendVerificationEmail(email, code);

    res.status(201).json({ message: 'User created', userId: user.id , role: user.role});
  } catch (err) {
    res.status(500).json({ error: 'Signup failed', details: err.message });
  }
};



exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });


    // Check if user is verified before anything else
    if (!user.isVerified) {
      return res.status(403).json({ error: 'الحساب غير مفعل، يرجى التحقق من بريدك الإلكتروني' });
    }


    const deviceFingerprint = generateDeviceFingerprint(req);

    // تعطيل المستخدم على الأجهزة السابقة
    await User.update({ isActive: false }, { where: { id: user.id } });
    
    // حذف جميع الجلسات القديمة
    await Session.destroy({ where: { userId: user.id } });
    
    // تفعيل المستخدم على الجهاز الحالي
    await User.update({ isActive: true }, { where: { id: user.id } });

    const token = jwt.sign({ 
      userId: user.id,
      role: user.role 
    }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // إنشاء جلسة جديدة
    await Session.create({
      userId: user.id,
      deviceFingerprint,
      token
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        role: user.role,
        isActive: true
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Signin failed', details: err.message });
  }
};

// إضافة وظيفة تسجيل الخروج
exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    // تعطيل المستخدم
    await User.update({ isActive: false }, { where: { id: req.user.id } });
    
    // حذف الجلسة
    await Session.destroy({ where: { token } });
    
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Logout failed', details: err.message });
  }
};


// Email verification function
exports.verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.verificationCode !== code.trim()) {
      return res.status(400).json({ error: 'Invalid code' });
    }

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // حذف جميع جلسات المستخدم أولاً
    await Session.destroy({ where: { userId: id } });
    
    // ثم حذف المستخدم
    await User.destroy({ where: { id } });
    
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed', details: err.message });
  }
};



exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Save it temporarily to user (optional)
    user.resetCode = code;
    user.resetCodeExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();

    // Send email
    await sendVerificationEmail(email, code);

    res.json({ message: 'Verification code sent to email' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email', details: err.message });
  }
};


exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'البريد الإلكتروني غير موجود' }); // email not found
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    // if you were using token and expiration, you can clear them, but since no token needed, no action here
    // user.resetToken = null;
    // user.resetTokenExpiration = null;

    await user.save();

    res.json({ message: 'تم تحديث كلمة المرور بنجاح' });
  } catch (err) {
    res.status(500).json({ error: 'فشل تحديث كلمة المرور', details: err.message });
  }
};

exports.verifyCodeReset = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const now = new Date();
    const sentTime = new Date(user.resetCodeExpiration); // This should be the time the code was generated
    const ageMs = now - sentTime;

    const MAX_AGE = 5 * 60 * 1000; // 5 minutes in milliseconds

    if (user.resetCode !== code) {
      return res.status(400).json({ error: 'Invalid code' });
    }

    if (ageMs > MAX_AGE) {
      return res.status(400).json({ error: 'Code has expired' });
    }

    res.json({ message: 'Code verified successfully', email });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

exports.resendCode= async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = newCode;
    user.resetCodeExpiration = new Date();
    await user.save();

    // sendEmail is your custom email sending function
    // await sendEmail(user.email, 'رمز التحقق', `رمزك هو: ${newCode}`);
     await sendVerificationEmail(email, newCode);

    res.json({ message: 'تم إرسال كود جديد إلى بريدك الإلكتروني' });
  } catch (error) {
    res.status(500).json({ error: 'فشل في إرسال الكود الجديد' });
  }
};

