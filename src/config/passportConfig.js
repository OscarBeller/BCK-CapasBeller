import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import { createHash, validatePassword } from "../utils.js";
import { config } from "./config.js";
import CartManagerMongoDAO from "../dao/CartManagerMongoDAO.js";
import { UserManagerMongoDAO } from "../dao/UserManagerMongoDAO.js";
const userManager = new UserManagerMongoDAO();
const cartManager = new CartManagerMongoDAO();

export const initPassport = () => {
  passport.use(
    "register",
    new local.Strategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          let { first_name, last_name, age } = req.body;
          if (!first_name || !last_name || !age) {
            return done(null, false, { message: "Unfilled fields" });
          }
          let exist = await userManager.getBy({ email: username });
          if (exist) {
            return done(null, false, {
              message: `${username} is already registered `,
            });
          }
          let newCart = await cartManager.create();
          let newUser = await userManager.create({
            first_name,
            last_name,
            email: username,
            age: Number(age),
            password: createHash(password),
            cart: newCart._id,
          });
          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new local.Strategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          let user = await userManager.getBy({ email: username });
          if (!user) {
            return done(null, false, { message: "User not found" });
          }
          if (!validatePassword(password, user)) {
            return done(null, false, { message: "Invalid password" });
          }
          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new github.Strategy(
      {
        clientID: config.CLIENT_ID_GITHUB,
        clientSecret: config.CLIENT_SECRET_GITHUB,
        callbackURL: "http://localhost:8081/api/sessions/githubCallback",
      },
      async (tokenAcceso, tokenRefresh, profile, done) => {
        try {
          let email = profile._json.email;
          let name = profile._json.name;
          if (!name || !email) {
            return done(null, false, { message: "Email or name is missing" });
          }
          let user = await userManager.getBy({ email });
          if (!user) {
            let first_name = name.split(" ")[0];
            let last_name = name.split(" ")[1];
            let newCart = await cartManager.create();
            user = await userManager.create({
              first_name,
              last_name,
              email,
              cart: newCart._id,
              profile,
            });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    return done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userManager.getBy({ _id: id });
    return done(null, user);
  });
};
