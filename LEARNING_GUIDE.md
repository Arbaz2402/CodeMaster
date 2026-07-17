# CodeMaster: My Personal Learning Guide

This guide is for my own personal learning and understanding of the CodeMaster platform.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Frontend Deep Dive](#frontend-deep-dive)
3. [Backend Deep Dive](#backend-deep-dive)
   1. [Server Entry Point](#1-server-entry-point-serverjs)
   2. [Authentication Middleware](#2-authentication-middleware-middlewareauthjs)
   3. [User Model](#3-user-model-modelsuserjs)
   4. [Authentication Routes](#4-authentication-routes-routesauthjs)
   5. [Other Models & Routes](#5-other-models--routes)
4. [Key Technologies Explained](#key-technologies-explained)
5. [How Each Feature Works](#how-each-feature-works)
6. [Interview Prep Questions & Answers](#interview-prep-questions--answers)
7. [My Notes & Observations](#my-notes--observations)

---

## Project Overview

### What is CodeMaster?
CodeMaster is a full-stack coding learning platform with:
- A modern frontend built with plain HTML/CSS/JS (no heavy frameworks)
- A RESTful API backend built with Node.js, Express.js, and MongoDB
- Features:
  - User authentication (login/register)
  - Course catalog
  - Video learning with notes
  - Quizzes
  - Coding playground with live preview
  - User dashboard
  - User profile management

### Key Links
- Live Frontend: https://codemaster24.netlify.app/
- Live Backend API: https://codemaster-backend-2o0m.onrender.com/
- API Documentation (Swagger UI): https://codemaster-backend-2o0m.onrender.com/api-docs

---

## Frontend Deep Dive

### Frontend Folder Structure
```
CodeMaster/
├── css/              # Page-specific stylesheets
│   ├── course-detail.css
│   ├── courses.css
│   ├── dashboard.css
│   ├── global.css
│   ├── landing.css
│   ├── playground.css
│   ├── profile.css
│   ├── quiz.css
│   └── video-learning.css
├── js/               # Page-specific JavaScript logic
│   ├── api.js              # API client wrapper
│   ├── auth.js             # Navbar auth state management
│   ├── confirm-email.js    # (Legacy) Email confirmation page
│   ├── course-detail.js    # Course detail page
│   ├── courses.js         # Courses page
│   ├── dashboard.js      # Dashboard page
│   ├── landing.js         # Landing page
│   ├── main.js           # Global helper functions
│   ├── playground.js     # Playground page
│   ├── profile.js       # Profile page
│   ├── quiz.js         # Quiz page
│   └── video-learning.js # Video learning page
├── pages/            # Feature-specific HTML pages
│   ├── course-detail.html
│   ├── courses.html
│   ├── dashboard.html
│   ├── playground.html
│   ├── profile.html
│   ├── quiz.html
│   └── video-learning.html
├── assets/            # Images, screenshots
├── index.html        # Home/landing page
└── netlify.toml      # Netlify deployment config
└── README.md         # GitHub project README
```

### Key Frontend Files Explained

#### 1. `js/api.js` - API Client Wrapper
**File**: [js/api.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/js/api.js)

**What it does**:
- Centralizes all API calls to the backend
- Uses `apiFetch` function that automatically adds JWT token to requests
- Exports API objects for each feature:
  - `authApi` - login, register, forgot password, etc.
  - `coursesApi` - get courses, enroll, etc.
  - `usersApi` - update profile, etc.
  - `quizzesApi` - get quizzes
  - `notesApi` - get/save notes
  - `playgroundsApi` - manage playground projects

**Key functions I should remember**:
- `getToken()` - retrieves JWT from localStorage
- `setToken(token)` - saves JWT to localStorage
- `removeToken()` - removes JWT from localStorage
- `getUser()` - retrieves user object from localStorage
- `setUser(user)` - saves user object to localStorage
- `removeUser()` - removes user object from localStorage
- `apiFetch(endpoint, options)` - generic fetch wrapper that adds Authorization header

---

## Backend Deep Dive

### Backend Folder Structure
```
backend/
├── middleware/         # Middleware functions
│   └── auth.js            # JWT authentication middleware
├── models/           # MongoDB schemas (Mongoose)
│   ├── Course.js          # Course & Lesson schema
│   ├── Enrollment.js      # Enrollment schema
│   ├── Note.js             # Note schema
│   ├── Playground.js        # Playground project schema
│   ├── Quiz.js             # Quiz schema
│   └── User.js             # User schema
├── routes/           # API routes
│   ├── auth.js             # Authentication routes
│   ├── courses.js          # Course & enrollment routes
│   ├── notes.js            # Notes routes
│   ├── playgrounds.js      # Playground routes
│   ├── quizzes.js          # Quiz routes
│   ├── seed.js             # Database seeding route
│   └── users.js            # User profile routes
├── scripts/          # Utility scripts
│   └── seed.js             # Database seeding script
├── swagger/          # Swagger documentation
│   ├── docs/            # Swagger docs for each route
│   └── swagger.js         # Swagger configuration
├── package-lock.json
├── package.json
├── README_BACKEND.md
└── server.js            # Backend entry point
```

---

### 1. Server Entry Point (`server.js`)
**File**: [backend/server.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/backend/server.js)

**What it does, step-by-step**:
1. **Import dependencies**: Express, mongoose, cors, dotenv, swagger-ui-express, swagger-docs
2. **Load environment variables**: Using dotenv.config()
3. **Initialize Express app**: `const app = express()`
4. **Configure CORS**: Allow requests from specific origins (localhost and Netlify URL)
5. **Parse JSON and URL-encoded data: `app.use(express.json())`
6. **Connect to MongoDB**: `mongoose.connect(process.env.MONGODB_URI)`
7. **Mount Swagger UI: `/api-docs`
8. **Define home route
9. **Mount all API routes under `/api/...`
10. **Start listening on port: `app.listen(PORT)`

---

### 2. Authentication Middleware (`middleware/auth.js`)
**File**: [backend/middleware/auth.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/backend/middleware/auth.js)

**What it does**:
- Protects routes by verifying the JWT token in the request
- If valid, it attaches the user object to `req.user`
- Calls `next()` to pass control to the next handler
- If invalid, returns a 401 response

**Step-by-step code walkthrough**:
```javascript
const auth = async (req, res, next) => {
  try {
    // Step 1: Get token from the Authorization header
    // The header looks like: "Bearer <token>", so we replace "Bearer "
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // Step 2: Check if token is missing
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    // Step 3: Verify the token using JWT_SECRET from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Step 4: Find user by ID from the decoded token
    // Exclude password field (we don't want to send that to the client
    const user = await User.findById(decoded.userId).select('-password');
    
    // Step 5: If user not found, return error
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    
    // Step 6: Attach the user to the request object
    req.user = user;
    
    // Step 7: Call next() to pass control to the next middleware/route
    next();
  } catch (error) {
    // If any error (like invalid token), return 401
    res.status(401).json({ message: 'Token is not valid' });
  }
};
```

---

### 3. User Model (`models/User.js`)
**File**: [backend/models/User.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/backend/models/User.js)

**What it does**:
- Defines the schema for User documents in MongoDB
- Includes a pre-save hook to hash passwords before saving
- Adds a comparePassword method to check if a password matches the hash

**User Schema Fields:
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emailConfirmed: { type: Boolean, default: true },
  bio: { type: String, default: '' },
  about: { type: String, default: '' },
  avatar: { type: String, default: '' },
  skills: [{ type: String }],
  streak: { type: Number, default: 0 },
  totalCourses: { type: Number, default: 0 },
  totalHours: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  achievements: [{ ... },
  certificates: [{ ... }],
  activityData: [{ ... }],
  recentActivity: [{ ... }],
  createdAt: { type: Date, default: Date.now }
});
```

**Pre-save Hook (password hashing**:
```javascript
userSchema.pre('save', async function() {
  // Only hash the password if it's been modified
  if (!this.isModified('password')) return;
  
  try {
    // Generate salt (random string added to password before hashing)
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});
```

**comparePassword Method:
```javascript
userSchema.methods.comparePassword = async function(candidatePassword) {
  // Compare the candidate password with the hashed password
  return bcrypt.compare(candidatePassword, this.password);
};
```

---

### 4. Authentication Routes (`routes/auth.js`)
**File**: [backend/routes/auth.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/backend/routes/auth.js)

**Key Endpoints:

#### Register User
**Endpoint**: `POST /api/auth/register`

**What it does**:
1. Gets name, email, password from request body
2. Checks if user with that email already exists
3. If not, creates new User instance
4. Saves user to database (password gets hashed automatically via pre-save hook)
5. Creates JWT token
6. Returns token + user (without password)

#### Login User
**Endpoint**: `POST /api/auth/login`

**What it does**:
1. Gets email, password from request body
2. Finds user by email
3. If user exists, compares password using comparePassword()
4. If match, creates JWT
5. Returns token + user

---

### 5. Other Models & Routes

#### Course Model & Routes
**Files**: [Course.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/backend/models/Course.js), [courses.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/backend/routes/courses.js)

**What they do**:
- `GET /api/courses - Get all courses
- GET /api/courses/:id - Get single course
- POST /api/courses/:id/enroll - Enroll in course (protected)
- GET /api/courses/user/enrolled - Get enrolled courses (protected)
- PUT /api/courses/:courseId/lessons/:lessonId/complete - Mark lesson as complete (protected)

#### Enrollment Model
**File**: [Enrollment.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/backend/models/Enrollment.js)

**Fields**:
- userId (ObjectId ref to User)
- courseId (ObjectId ref to Course)
- enrolledAt (Date)
- progress (Number)
- completedLessons (Array of Strings)

#### Notes Model & Routes
**Files**: [Note.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/backend/models/Note.js), [notes.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/backend/routes/notes.js)

**What they do**:
- Save notes per user, per lesson, per course

#### Playground Model & Routes
**Files**: [Playground.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/backend/models/Playground.js), [playgrounds.js](file:///d:/codingNinjas/My_projectonNetlify/CodeMaster/backend/routes/playgrounds.js)

**What they do**:
- Save, load, delete playground projects for users

---

## Key Technologies Explained

### What is Express.js?
- Fast, minimal web framework for Node.js
- Used to build RESTful APIs
- Features:
  - Middleware support
  - Routing
  - Template engines (optional, not used here)
  - Error handling

### What is Mongoose?
- ODM (Object Data Mapper) for MongoDB
- Maps JavaScript objects to MongoDB documents
- Benefits:
  - Schema validation
  - Middleware (pre/post hooks)
  - Query building
  - Populate (like SQL JOINs)

### What is JWT (JSON Web Token)?
- Compact, self-contained token for authentication
- Consists of 3 parts: Header, Payload, Signature
- How it's used here:
  - After login/register, backend creates JWT and sends to frontend
  - Frontend stores token in localStorage
  - Frontend sends token in Authorization header with every request to protected routes
  - Backend verifies token and checks if it's valid

### What is bcryptjs?
- Library to hash passwords
- Why hash passwords?
  - If database is breached, attackers don't get plain text passwords
- Uses salt rounds (cost factor)
- Higher = more secure but slower

### What is CORS?
- Cross-Origin Resource Sharing
- Browser security feature
- Prevents frontend from different domain from accessing backend API
- We configure CORS to allow requests from our frontend URLs

---

## How Each Feature Works

### User Registration Flow
1. User fills registration form (name, email, password)
2. Frontend sends POST to /api/auth/register
3. Backend checks if user exists
4. Backend creates new User, saves to DB
5. Backend creates JWT
6. Frontend stores JWT + user to localStorage
7. Frontend closes modal, updates navbar

### Course Enrollment
1. User clicks Enroll button
2. Frontend sends POST to /api/courses/:id/enroll with JWT
3. Backend auth middleware checks JWT
4. Backend checks if user already enrolled
5. If not, creates new Enrollment
6. Increments user's totalCourses
7. Saves enrollment to DB

---

## Interview Prep Questions & Answers

### Q: What is middleware in Express?
A: Middleware are functions that have access to the request object req, response object res, and the next function in the application’s request-response cycle. They can:
- Execute any code
- Make changes to req and res
- End request-response cycle
- Call next middleware in stack
- Example: our auth middleware checks for JWT

### Q: Why do we need salt and hash passwords?
A: To protect user passwords in case database breach! If you just stored plain text and database gets hacked, attackers get everyone's password! So we hash it with a salt (random string) to make it even harder to crack!

### Q: What's the difference between Authentication and Authorization?
A:
- Authentication: Are you who you say you are? (login)
- Authorization: Do you have permission to do what you're trying to do? (e.g., can this user access this protected route?)

### Q: How do you handle errors in Express?
A: Use try/catch blocks in async handlers. In our code, we wrap async functions in try/catch and send error response in catch

---

## My Notes & Observations
- Write your own notes here as you learn!
