require('dotenv').config();
const mongoose = require("mongoose");
const activities = require("./data.js");
const Activity = require("../models/Activity.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");

// Use the environment variable for MongoDB URL
const MONGO_URL = process.env.MONGO_URI || "mongodb://localhost:27017/wildspire";

// Ensure we're connecting to the correct database
console.log("🔗 Connecting to:", MONGO_URL.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials in log

/**
 * Enhanced database initialization that creates:
 * - Demo users with credentials
 * - Activities with proper ownership
 * - Sample reviews for realistic data
 */
async function initDB() {
  try {
    // Connect to MongoDB using the specified URL
    console.log("🔗 Attempting to connect to MongoDB...");
    await mongoose.connect(MONGO_URL);
    console.log("✅ MongoDB Connected...");
    console.log("📊 Database:", mongoose.connection.db.databaseName);

    // Delete existing data
    console.log("🗑️  Clearing existing data...");
    await Activity.deleteMany({});
    await User.deleteMany({});
    await Review.deleteMany({});
    console.log("✅ Cleared existing data");

    // Create demo user
    console.log("👤 Creating demo users...");
    
    const demoUser = new User({
      email: 'demo@wildspire.com',
      username: 'demouser'
    });
    
    const registeredUser = await User.register(demoUser, 'Demo@123');
    console.log("✅ Created main demo user:");
    console.log("   📧 Email: demo@wildspire.com");
    console.log("   🔑 Password: Demo@123");

    // Create additional demo users for reviews
    const demoUser2 = new User({
      email: 'john@example.com',
      username: 'johndoe'
    });
    const john = await User.register(demoUser2, 'Test@123');

    const demoUser3 = new User({
      email: 'jane@example.com',
      username: 'janesmith'
    });
    const jane = await User.register(demoUser3, 'Test@123');

    console.log("✅ Created additional demo users");

    // Update activities with demo user ID as owner
    console.log("🏕️  Adding activities...");
    const activitiesWithUser = activities.map(activity => ({
      ...activity,
      owner: registeredUser._id
    }));

    // Insert activities
    const insertedActivities = await Activity.insertMany(activitiesWithUser);
    console.log(`✅ Added ${insertedActivities.length} activities`);

    // Create sample reviews for more realistic data
    console.log("⭐ Adding sample reviews...");
    
    const sampleReviews = [
      {
        rating: 5,
        comment: "Absolutely breathtaking experience! The guides were professional and the scenery was stunning."
      },
      {
        rating: 4,
        comment: "Great activity! Well worth the price. Only minor issue was the weather, but that's not controllable."
      },
      {
        rating: 5,
        comment: "Best adventure of my life! Cannot recommend this enough. Will definitely come back!"
      },
      {
        rating: 3,
        comment: "Good experience overall, but felt a bit rushed. Would have liked more time at certain spots."
      },
      {
        rating: 5,
        comment: "Perfect for beginners and experts alike. The instructors made everyone feel comfortable."
      }
    ];

    let reviewCount = 0;
    for (let i = 0; i < Math.min(7, insertedActivities.length); i++) {
      const activity = insertedActivities[i];
      
      // Add 1-2 reviews per activity
      const numReviews = Math.floor(Math.random() * 2) + 1;
      
      for (let j = 0; j < numReviews && reviewCount < sampleReviews.length; j++) {
        const review = new Review({
          rating: sampleReviews[reviewCount].rating,
          comment: sampleReviews[reviewCount].comment,
          author: j === 0 ? john._id : jane._id,
          activity: activity._id
        });
        await review.save();
        
        activity.reviews.push(review._id);
        reviewCount++;
      }
      
      await activity.save();
    }
    
    console.log(`✅ Added ${reviewCount} sample reviews`);

    console.log("\n🎉 Database initialized successfully!");
    console.log("\n📋 Summary:");
    console.log(`   • ${insertedActivities.length} activities created`);
    console.log(`   • 3 demo users created`);
    console.log(`   • ${reviewCount} sample reviews added`);
    console.log("\n🔐 Demo Login Credentials:");
    console.log("   Email: demo@wildspire.com");
    console.log("   Password: Demo@123");
    console.log("\n🔐 Additional Test Accounts:");
    console.log("   Email: john@example.com | Password: Test@123");
    console.log("   Email: jane@example.com | Password: Test@123");
    
  } catch (err) {
    console.error("❌ ERROR during initialization:", err);
    throw err;
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
}

// Run initialization
initDB()
  .then(() => {
    console.log("✅ Script completed successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Script failed:", err);
    process.exit(1);
  });
