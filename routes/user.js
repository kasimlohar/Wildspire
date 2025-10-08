const express = require("express");
const router = express.Router();
const passport = require("passport");
const rateLimit = require("express-rate-limit");

// Middleware & Utilities
const { preserveReturnTo, requireAuth } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const userController = require("../controllers/users.js");
const activityController = require("../controllers/activities.js");

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: "Too many authentication attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
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
router.post("/logout", userController.logout);

/**
 * User Profile and Bookings
 */
router.get("/users/:id",
  wrapAsync(userController.showProfile)
);

router.get("/bookings",
  requireAuth,
  wrapAsync(activityController.getUserBookings)
);

module.exports = router;