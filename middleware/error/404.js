// ================================> This file for the error page for page not found <=====================================

// middleware for the page not found
module.exports = (req, res, next) => {
  res.status(404);
  res.render("error/404");
};
