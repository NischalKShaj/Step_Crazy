// ====================================>file for performing the user authentication in the routes <======================

// setting the middleware for user authentication
exports.userAuth = (req, res, next) => {
  const user = req.session.user;
  if (user) {
    next();
  } else {
    res.redirect("/");
  }
};
