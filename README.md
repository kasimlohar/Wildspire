# WildSpire ⛰️

> A modern adventure activity booking platform built with **Node.js** and **MongoDB**

![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![MongoDB Version](https://img.shields.io/badge/mongodb-%3E%3D4.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 🌟 Overview
WildSpire is a full-stack web application designed for discovering and booking adventure activities. Users can explore thrilling locations, leave reviews, and manage their bookings seamlessly. Whether you're into hiking, kayaking, or rock climbing, WildSpire helps you plan your next adventure effortlessly.

---

## ✨ Features
✅ **User Authentication** - Secure login/signup with Passport.js  
✅ **Activity Management** - Create, edit, and delete adventure activities  
✅ **Image Handling** - Upload multiple images with Cloudinary integration  
✅ **Location Services** - Interactive maps powered by Mapbox  
✅ **Review System** - User ratings and feedback for activities  
✅ **Responsive UI** - Mobile-first design with Bootstrap 5  
✅ **Enhanced Security** - Input validation, XSS protection, rate limiting  
✅ **Data Persistence** - MongoDB with Mongoose ODM  

---

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Frontend**: EJS, Bootstrap 5
- **APIs**: Mapbox, Cloudinary
- **Authentication**: Passport.js
- **Security**: Helmet, Express-Rate-Limit, MongoDB-Sanitize

---

## 📋 Prerequisites
Ensure you have the following installed before running the project:
- **[Node.js](https://nodejs.org/)** (>= 14.x)
- **[MongoDB](https://www.mongodb.com/)** (>= 4.x)
- **[Cloudinary](https://cloudinary.com/)** Account (for image uploads)
- **[Mapbox](https://www.mapbox.com/)** Account (for interactive maps)

---

## 🚀 Getting Started

### 1️⃣ Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/yourusername/wildspire.git
cd wildspire

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 2️⃣ Setup Environment Variables
1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
2. Fill in your credentials:
```env
NODE_ENV=development
PORT=8080
MONGO_URI=your_mongodb_uri
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret
MAP_TOKEN=your_mapbox_token
SESSION_SECRET=your_session_secret
```

---

## 📁 Project Structure
```
wildspire/
├── controllers/   # Route handlers
├── middleware/    # Custom middleware
├── models/        # Database schemas
├── public/        # Static assets
│   ├── css/
│   ├── js/
│   └── images/
├── routes/        # Route definitions
├── utils/         # Helper functions
└── views/         # EJS templates
```

---

## 🔒 Security Features
✅ **CSRF Protection** - Secure user interactions  
✅ **XSS Prevention** - Protects against cross-site scripting attacks  
✅ **Rate Limiting** - Prevents excessive API requests  
✅ **Input Validation** - Ensures data integrity  
✅ **Secure Sessions** - Protects user data  
✅ **Image Upload Validation** - Filters unsafe file types  

---

## 🧪 Running Tests
To run tests, execute:
```bash
npm test
```

---

## 🚀 Deployment
WildSpire is ready for deployment on:
- **Render**  
- **Mongo Atlas**  
- **AWS**  

---

## 🤝 Contributing
We welcome contributions! To contribute:
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature-name`)
3. **Commit** your changes (`git commit -m 'Add feature'`)
4. **Push** to your branch (`git push origin feature-name`)
5. **Open a pull request**

---

## 🐛 Bug Reports
If you find any bugs, please open an issue with:
- **Bug description**
- **Steps to reproduce**
- **Expected vs actual behavior**

---

## 📜 License
WildSpire is licensed under the **MIT License**. See [LICENSE](./LICENSE) for details.

Happy adventuring! 🏕️🌍

