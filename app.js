/* --------------------------
   Environment Configuration
   -------------------------- */
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Update MongoDB connection string
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/wildspire";
const SESSION_SECRET = process.env.SESSION_SECRET || "wildspireSecret";

/* --------------------------
Core Dependencies
-------------------------- */
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const { rateLimit } = require("express-rate-limit");
const cors = require("cors");

/* --------------------------
  Custom Modules
  -------------------------- */
const ExpressError = require("./utils/ExpressError");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

/* --------------------------
  Route Imports
  -------------------------- */
const activityRouter = require("./routes/activity");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

/* --------------------------
  Initialization
  -------------------------- */
const app = express();

/* --------------------------
   Environment Variables
   -------------------------- */
const port = process.env.PORT || 3000; // Vercel uses dynamic ports

/* --------------------------
   Database Connection
   -------------------------- */
let isConnected = false;

async function connectDB() {
  if (isConnected) {
    return;
  }
  
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    // Don't exit in serverless environment
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
}

// Connect to database
connectDB();

/* --------------------------
View Engine Configuration
-------------------------- */
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Trust proxy configuration for Vercel
app.set('trust proxy', 1);

/* --------------------------
Middleware Stack
-------------------------- */
// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://api.mapbox.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "https://api.mapbox.com"],
      fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

app.use(mongoSanitize());

// Rate Limiting - More restrictive for production
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'development',
  trustProxy: true,
});

// Apply rate limiting
app.use('/api', limiter);

// Static Assets
app.use(express.static(path.join(__dirname, "public")));

// Request Parsing
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Session Store
const store = MongoStore.create({
  mongoUrl: mongoURI,
  touchAfter: 24 * 3600,
  crypto: {
    secret: SESSION_SECRET,
  },
});

store.on("error", function (e) {
  console.log("Session Store Error", e);
});

// Session Configuration - Updated for production
const sessionConfig = {
  store,
  name: "adventureSession",
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === "production" ? 'lax' : 'lax' // Changed from 'none'
  },
};

app.use(session(sessionConfig));

// Flash Messages
app.use(flash());

// Authentication Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Local Variables Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.currentUrl = req.originalUrl;
    next();
});

/* --------------------------
Route Handlers
-------------------------- */

// Home route
app.get("/", (req, res) => {
  res.redirect("/activities");
});

app.use("/activities", activityRouter);
app.use("/activities/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Health check endpoint for Vercel
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/* --------------------------
   Error Handling
   -------------------------- */
// 404 Handler
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// Global Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  
  // Handle Mongoose Errors
  if (err.name === "ValidationError") {
    err.message = Object.values(err.errors).map(val => val.message).join(", ");
    err.statusCode = 400;
  }
  
  if (err.code === 11000) {
    err.message = "Duplicate field value entered";
    err.statusCode = 400;
  }

  // Log errors in production
  if (process.env.NODE_ENV === "production") {
    console.error("Error:", {
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack
    });
  } else {
    console.error("💥 Error Stack:", err.stack);
  }

  // Send appropriate response
  if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
    res.status(statusCode).json({ error: message });
  } else {
    res.status(statusCode).render("error", { 
      message: err.message,
      statusCode,
      stack: process.env.NODE_ENV === "development" ? err.stack : null
    });
  }
});

/* --------------------------
Server Initialization
-------------------------- */
// For Vercel, we export the app instead of listening
if (process.env.NODE_ENV === 'production') {
  module.exports = app;
} else {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
  });
}