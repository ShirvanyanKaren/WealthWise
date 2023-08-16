// Looks for the TOGGLEAUTH environment variable to determine if authentication is to be used
const toggleAuth =
  process.env.TOGGLEAUTH !== undefined
    ? process.env.TOGGLEAUTH === "true"
    : true;

// Middleware utility to check if user is logged in
const useAuth = (req, res, next) => {
  const shouldAuthenticate = toggleAuth && !req.session.logged_in;
  shouldAuthenticate ? res.render("unauthorized") : next();
};

module.exports = { useAuth };
