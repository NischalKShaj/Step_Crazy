// ====================================>file for performing the user authentication in the routes <======================

// setting the middleware for user authentication
exports.adminAuth = (req, res, next) => {
  const admin = req.session.admin;
  if (admin) {
    next();
  }
};
