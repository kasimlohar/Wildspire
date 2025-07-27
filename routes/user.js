const express = require("express");
const router = express.Router();
const passport = require("passport");
const rateLimit = require("express-rate-limit");

// Middleware & Utilities
const { preserveReturnTo } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const userController = require("../controllers/users.js");

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: "Too many attempts, please try again later"
});

/**
 * User Authentication Routes
 */
router.route("/signup")
  .get(userController.renderSignupForm)
  .post(
    authLimiter,
    wrapAsync(userController.signup)
  );

router.route("/login")
  .get(userController.renderLoginForm)
  .post(
    authLimiter,
    preserveReturnTo,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
      failureMessage: "Invalid username or password", // More generic message
      keepSessionInfo: true
    }),
    userController.login
  );

/**
 * User Session Management
 */
router.get("/logout", userController.logout);

// Add to existing user routes
router.route("/profile")
  .get(requireAuth, userController.renderProfile)
  .put(requireAuth, userController.updateProfile);

router.get("/profile/edit", requireAuth, userController.renderEditProfile);

module.exports = router;