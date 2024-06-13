import { Router } from "express";
import passport from "passport";
import { passportCall } from "../middlewares/passportCall.js";
import { auth } from "../middlewares/auth.js";
export const router = Router();

router.get("/error", (req, res) => {
  return res.status(500).json({ error: "Authentication error" });
});

router.post("/register", passportCall("register"), async (req, res) => {
  return res
    .status(201)
    .json({ payload: "Successful registration", newUser: req.user });
});

router.post("/login", passportCall("login"), async (req, res) => {
  let { web } = req.body;
  let user = { ...req.user };
  delete user.password;
  req.session.user = user;

  if (web) {
    res.redirect("/");
  } else {
    return res.json({ payload: "Successfull login" });
  }
});

router.get("/github", passport.authenticate("github", {}), (req, res) => {});
router.get("/githubCallback", passportCall("github"), (req, res) => {
  req.session.user = req.user;
  return res.redirect("/");
});

router.get("/current", auth(["admin", "user"]), (req, res) => {
  res.json({ user: req.session.user });
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Unexpected server error" });
    }
  });
  res.json({ payload: "logout successfull" });
});
