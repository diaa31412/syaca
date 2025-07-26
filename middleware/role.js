// module.exports = (requiredRole) => {
//     return (req, res, next) => {
//       if (req.userRole !== requiredRole) {
//         return res.status(403).json({ error: 'Access denied. Admins only.' });
//       }
//       next();
//     };
//   };


module.exports = (requiredRole) => {
  return (req, res, next) => {
    console.log('Authenticated user role:', req.user?.role); // Add this line
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    next();
  };
};