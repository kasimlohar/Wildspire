const User = require("../models/user");
const { validatePassword } = require("../utils/validation");

// Improve code 

module.exports = {
  renderSignupForm: (req, res) => {
    res.render("users/signup");
  },

  signup: async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      
      // Check existing email
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        req.flash("error", "Email already exists");
        return res.redirect("/signup");
      }

      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);

      req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash("success", "Welcome to AdventureHub!");
        res.redirect("/activities");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  },

  renderLoginForm: (req, res) => {
    res.render("users/login");
  },

  login: (req, res) => {
    const redirectUrl = res.locals.returnTo || "/activities";
    delete req.session.returnTo;
    req.flash("success", `Welcome back, ${req.user.username}!`);
    res.redirect(redirectUrl);
  },

  logout: (req, res, next) => {
    req.logout(err => {
      if (err) return next(err);
      req.flash("success", "Successfully logged out!");
      res.redirect("/activities");
    });
  },

  showProfile: async (req, res) => {
    try {
      const User = require("../models/user");
      const user = await User.findById(req.params.id);
      if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/activities');
      }

      const Activity = require('../models/Activity');
      const Review = require('../models/review');
      const Booking = require('../models/Booking');

      const [activities, reviews, bookings] = await Promise.all([
        Activity.find({ owner: user._id }).sort({ createdAt: -1 }).limit(10),
        Review.find({ author: user._id }).populate('activity').sort({ createdAt: -1 }).limit(10),
        Booking.find({ user: user._id }).populate('activity').sort({ createdAt: -1 }).limit(10)
      ]);

      res.render('users/profile', { profileUser: user, activities, reviews, bookings });
    } catch (err) {
      console.error('Profile error:', err);
      req.flash('error', 'Failed to load profile');
      res.redirect('/activities');
    }
  }
};
