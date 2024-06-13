import passport from "passport";

export const passportCall = (strategy) => {
  return function (req, res, next) {
    passport.authenticate(strategy, function (err, user, info, status) {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.setHeader("Content-Type", "application/json");
        return res
          .status(401)
          .json({ error: info.message ? info.message : info.toString() });
      }
      req.user = user;
      return next();
    })(req, res, next);
  };
};
