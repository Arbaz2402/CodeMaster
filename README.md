# CodeMaster | Advanced Full-Stack Learning Platform

CodeMaster is a professional-grade, modern, and feature-rich coding learning platform with both frontend and backend components. It provides an immersive educational experience with interactive learning, gamification, and a fully-featured coding playground.

---

## 🌐 Live Preview
- **Frontend**: [https://codemaster24.netlify.app/](https://codemaster24.netlify.app/)
- **Backend API**: [https://codemaster-backend-2o0m.onrender.com/](https://codemaster-backend-2o0m.onrender.com/)
- **API Documentation**: [https://codemaster-backend-2o0m.onrender.com/api-docs](https://codemaster-backend-2o0m.onrender.com/api-docs) (Swagger UI)

---

## 📸 Platform Overview

| **Landing Page** | **Explore Categories** |
|:---:|:---:|
| ![Landing Page](assets/screenshots/landing.png) | ![Explore](assets/screenshots/explore.png) |

| **Course Catalog** | **Coding Playground** |
|:---:|:---:|
| ![Courses](assets/screenshots/courses.png) | ![Playground](assets/screenshots/playground.png) |

| **Video Learning** | **Student Dashboard** |
|:---:|:---:|
| ![Learning](assets/screenshots/learning.png) | ![Dashboard](assets/screenshots/dashboard.png) |

---

## 🏗️ Architecture & Design

### Frontend Architecture
CodeMaster frontend is built using a **Modular Multi-Page Application (MPA)** architecture. This approach ensures:
- **Clean Separation of Concerns**: Each feature (Dashboard, Playground, etc.) has its own dedicated logic and styling.
- **Optimized Performance**: Assets are loaded only when needed for specific pages.
- **Scalable Component Logic**: Even as a vanilla JS project, it utilizes modular scripts to manage complex state transitions and DOM manipulations.

### Backend Architecture
The backend is a **RESTful API** built with Node.js and Express.js, using MongoDB for data storage. Key architectural features:
- **Modular Route Structure**: Each feature (auth, courses, users, etc.) has its own route file.
- **Middleware for Authentication**: JWT-based authentication middleware to protect routes.
- **MVC-like Pattern**: Separation of models (data schemas), routes (API endpoints), and middleware (authentication).

---

## ✨ Core Features

### Frontend Features
1. **Interactive Landing Page**: Dynamic typing effects, animated counters, and AOS (Animate On Scroll) integration.
2. **Advanced Course Catalog**: Real-time filtering and sorting system for courses.
3. **Integrated Coding Playground**: Full-featured HTML/CSS/JS editor with live iframe preview and custom JS Console/REPL.
4. **Smart Learning Interface**: Professional video player with synchronized lesson lists and persistent note-taking.
5. **Gamified Dashboard**: Visualized progress analytics, achievement badges, and streak tracking.
6. **Assessment System**: Interactive quizzes with countdown timers and instant performance feedback.
7. **User Authentication**: Login and registration with JWT tokens.

### Backend Features
1. **User Authentication & Authorization**: JWT-based login/registration, password hashing with bcryptjs.
2. **Course Management**: CRUD operations for courses, lessons, enrollments.
3. **Quiz System**: Quiz management and question storage.
4. **Notes System**: Persistent note-taking per lesson.
5. **Playground Project Management**: Save and retrieve playground projects.
6. **User Profile Management**: Update profile, track activity, skills, achievements, certificates.
7. **API Documentation**: Swagger UI for interactive API docs.

---

## 🛠️ Technologies Used

### Frontend
- **Core**: HTML5, CSS3 (Modern Flexbox/Grid), JavaScript (ES6+)
- **Visual Enhancements**: AOS (Scroll animations), Font Awesome (Iconography)
- **Data Visualization**: Chart.js (Dashboard analytics)
- **Utilities**: JSZip (Playground export feature), Google Fonts
- **Deployment**: Netlify

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs
- **CORS Handling**: cors
- **Environment Variables**: dotenv
- **API Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Email Service**: SendGrid (previously used, now disabled)
- **Deployment**: Render

---

## 📁 Project Structure

```
CodeMaster/
├── backend/                # Backend API
│   ├── middleware/         # Middleware functions
│   │   └── auth.js         # JWT authentication middleware
│   ├── models/             # MongoDB schemas
│   │   ├── Course.js       # Course & Lesson schema
│   │   ├── Enrollment.js   # Enrollment schema
│   │   ├── Note.js         # Note schema
│   │   ├── Playground.js   # Playground project schema
│   │   ├── Quiz.js         # Quiz schema
│   │   └── User.js         # User schema
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication routes
│   │   ├── courses.js      # Course & enrollment routes
│   │   ├── notes.js        # Notes routes
│   │   ├── playgrounds.js  # Playground routes
│   │   ├── quizzes.js      # Quiz routes
│   │   ├── seed.js         # Database seeding route
│   │   └── users.js        # User profile routes
│   ├── scripts/            # Utility scripts
│   │   └── seed.js         # Database seeding script
│   ├── swagger/            # Swagger documentation
│   │   ├── docs/           # Swagger route docs
│   │   └── swagger.js      # Swagger configuration
│   ├── .gitignore
│   ├── README_BACKEND.md
│   ├── package-lock.json
│   ├── package.json
│   └── server.js           # Backend entry point
├── css/                    # Page-specific modular stylesheets
├── js/                     # Interactive logic & dynamic data
│   ├── api.js              # API client wrapper
│   ├── auth.js             # Navbar auth state management
│   ├── confirm-email.js    # (Legacy) Email confirmation page
│   ├── course-detail.js    # Course detail page logic
│   ├── courses.js          # Courses page logic
│   ├── dashboard.js        # Dashboard page logic
│   ├── landing.js          # Landing page logic
│   ├── main.js             # Global helper functions
│   ├── playground.js       # Playground page logic
│   ├── profile.js          # Profile page logic
│   ├── quiz.js             # Quiz page logic
│   └── video-learning.js   # Video learning page logic
├── pages/                  # Feature-specific HTML modules
├── assets/                 # Media, iconography, and screenshots
├── index.html              # Main platform entry point
└── netlify.toml            # Netlify configuration
```

---

## 📚 Backend: Detailed Module Explanations

Let's break down each backend module with code references and "how it works" explanations (for interview prep!).

### 1. Server Entry Point (`server.js`)
**File**: [backend/server.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/backend/server.js)

**What it does**: Initializes the Express app, connects to MongoDB, sets up middleware (CORS, JSON parsing), mounts all routes, and starts the server.

**Key code snippets**:
- **Initialize Express app**:
  ```javascript
  const app = express();
  ```
- **CORS setup**:
  ```javascript
  app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'https://codemaster24.netlify.app'],
    credentials: true
  }));
  ```
  *Interview Note*: CORS (Cross-Origin Resource Sharing) is needed to allow requests from your frontend domain to the backend API. We specify allowed origins for security.

- **MongoDB connection**:
  ```javascript
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
  ```
  *Interview Note*: We use Mongoose (MongoDB ODM) to connect to our MongoDB database (hosted on MongoDB Atlas).

- **Mount routes**:
  ```javascript
  app.use('/api/auth', authRoutes);
  app.use('/api/courses', courseRoutes);
  // ... other routes
  ```

- **Start server**:
  ```javascript
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  ```

---

### 2. Authentication Middleware (`middleware/auth.js`)
**File**: [backend/middleware/auth.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/backend/middleware/auth.js)

**What it does**: Protects routes by verifying the JWT token from the request header. If valid, it attaches the user to `req.user`.

**Key code**:
```javascript
const auth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find user by ID from token, exclude password
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    
    // Attach user to request
    req.user = user;
    // Call next middleware/route handler
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
```

*Interview Note*: Middleware functions have access to `req`, `res`, and `next`. They can modify the request object (like adding `req.user` here) before passing control to the next handler.

---

### 3. User Model (`models/User.js`)
**File**: [backend/models/User.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/backend/models/User.js)

**What it does**: Defines the schema for User documents in MongoDB.

**Key fields**:
- `name`: User's name
- `email`: User's email (unique)
- `password`: Hashed password
- `emailConfirmed`: Boolean (default `true` now, since we removed email confirmation)
- `bio`, `about`, `avatar`: Profile details
- `skills`: Array of skills
- `streak`, `totalCourses`, `totalHours`, `points`: Gamification stats
- `achievements`, `certificates`: Arrays of achievements and certificates
- `activityData`, `recentActivity`: Activity tracking

**Password hashing pre-save hook**:
```javascript
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});
```
*Interview Note*: The `pre('save')` hook runs before saving a user document. We only hash the password if it's been modified to avoid rehashing unnecessarily.

**Password comparison method**:
```javascript
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
```

---

### 4. Authentication Routes (`routes/auth.js`)
**File**: [backend/routes/auth.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/backend/routes/auth.js)

**Endpoints**:
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login a user
- `POST /api/auth/forgot-password`: (Legacy) Send password reset email
- `POST /api/auth/reset-password`: (Legacy) Reset password with token
- `GET /api/auth/me`: Get current user (protected)

**Register endpoint key code**:
```javascript
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    user = new User({ name, email, password });
    await user.save();
    
    // Generate JWT token
    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Return token and user (without password)
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailConfirmed: user.emailConfirmed,
        // ... other user fields
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
```

---

### 5. Other Models & Routes
- **Course Model & Routes**: [backend/models/Course.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/backend/models/Course.js), [backend/routes/courses.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/backend/routes/courses.js)
  - Manages courses, lessons, enrollments, and lesson completion.

- **Enrollment Model**: [backend/models/Enrollment.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/backend/models/Enrollment.js)
  - Tracks user enrollments, progress, and completed lessons.

- **Note Model & Routes**: [backend/models/Note.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/backend/models/Note.js), [backend/routes/notes.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/backend/routes/notes.js)
  - Manages notes per user, per lesson, per course.

- **Playground Model & Routes**: [backend/models/Playground.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/backend/models/Playground.js), [backend/routes/playgrounds.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/backend/routes/playgrounds.js)
  - Manages playground projects (save, load, delete).

- **Quiz Model & Routes**: [backend/models/Quiz.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/backend/models/Quiz.js), [backend/routes/quizzes.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/backend/routes/quizzes.js)
  - Manages quizzes and questions.

- **User Routes**: [backend/routes/users.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/backend/routes/users.js)
  - Manages profile updates, activity, skills, achievements, certificates.

---

## 🚀 Getting Started

### Backend Setup
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Arbaz2402/CodeMaster.git
   cd CodeMaster/backend
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Set Up Environment Variables**:
   Create a `.env` file in the `backend/` directory:
   ```env
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret-key>
   SENDGRID_API_KEY=<your-sendgrid-api-key> (optional, no longer used)
   SENDGRID_FROM_EMAIL=<your-email> (optional)
   FRONTEND_URL=<your-frontend-url> (optional)
   PORT=5000 (optional)
   ```
4. **Seed the Database**:
   ```bash
   npm run seed
   ```
   Or send a POST request to `http://localhost:5000/api/seed`
5. **Start the Server**:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup
1. **Navigate to the project root**:
   ```bash
   cd CodeMaster
   ```
2. **Update API Base URL (if needed)**:
   Open [js/api.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/js/api.js) and update `API_BASE_URL` if your backend is running locally:
   ```javascript
   const API_BASE_URL = 'http://localhost:5000/api';
   ```
3. **Launch**:
   Open `index.html` in your browser (Recommended: Use VS Code Live Server for the best experience).

---

## 📄 License
Distributed under the MIT License.

---

Built with ❤️ for the Developer Community
