const toggleAuth =
  process.env.TOGGLEAUTH !== undefined
    ? process.env.TOGGLEAUTH === "true"
    : true;

const useAuth = (req, res, next) => {
  const shouldAuthenticate = toggleAuth && !req.session.logged_in;
  shouldAuthenticate ? res.render("unauthorized") : next();
};


module.exports = { useAuth };
