const Activity = require("../models/Activity");
const { cloudinary } = require("../cloudConfig");

module.exports = {
  getAllActivities: async (query = {}, options = {}) => {
    return Activity.find(query, options.projection || {})
      .sort(options.sort || { createdAt: -1 })
      .lean();
  },
  
  getActivityById: async (id, populateOptions = {}) => {
    const query = Activity.findById(id);
    
    if (populateOptions.reviews) {
      query.populate({
        path: 'reviews',
        populate: { path: 'author' }
      });
    }
    
    if (populateOptions.owner) {
      query.populate('owner');
    }
    
    return query.exec();
  },
  
  // Add other service methods
};