const Session = require('../models/sessionModel');
const User = require('../models/userModel');

module.exports = async (userId) => {
  // التحقق من وجود جلسات نشطة للمستخدم
  //Check if there are current session
  const activeSessions = await Session.findAll({
    where: { userId },
    include: [User]
  });
  
  if (activeSessions.length === 0) {
    // تعطيل المستخدم إذا لم يكن لديه جلسات نشطة
    // making the user off if not session
    await User.update({ isActive: false }, { where: { id: userId } });
  }
};