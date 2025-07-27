const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const { requireAuth } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");

// API controllers
const apiController = require("../controllers/api.js");

// Authentication
router.post("/login", wrapAsync(apiController.login));

// Activities
router.get("/activities", wrapAsync(apiController.getActivities));
router.get("/activities/:id", wrapAsync(apiController.getActivity));

// Protected routes
router.post("/activities", requireAuth, wrapAsync(apiController.createActivity));

module.exports = router;