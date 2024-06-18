import express from "express";
import passport from "passport";

const router = express.Router();
const CLIENT_URL = "http://localhost:3000/";

router.get("/login/success", (req, res) => {
  console.log("Login Success: req.user:", req.user);
  if (req.user) {
    res.cookie('user', JSON.stringify(req.user), { httpOnly: true, secure: false }); // Adjust secure: true for HTTPS
    res.status(200).json({
      success: true,
      message: "successful",
      user: req.user,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }
});

router.get("/login/failed", (req, res) => {
  console.log("Login Failed");
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie('user');
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.redirect(CLIENT_URL);
  });
});

router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));

router.get("/google/secrets",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/auth/login/failed",
  })
);

router.get("/google/success", (req, res) => {
  console.log("Google Success: req.user:", req.user);
  if (req.user) {
    res.cookie('user', JSON.stringify(req.user), { httpOnly: true, secure: false }); // Adjust secure: true for HTTPS
    res.status(200).json({
      success: true,
      message: "Google authentication successful",
      user: req.user,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Google authentication failed",
    });
  }
});

router.get("/github", passport.authenticate("github", { scope: ["email"] }));

router.get("/github/secrets",
  passport.authenticate("github", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/auth/login/failed",
  })
);

router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

router.get("/facebook/secrets",
  passport.authenticate("facebook", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/auth/login/failed",
  })
);

export default router;
