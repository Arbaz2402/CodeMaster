# CodeMaster Backend

This is the backend for the CodeMaster learning platform, built with Node.js, Express, and MongoDB.

## Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** (local installation or MongoDB Atlas)

## Setting Up MongoDB

### Option 1: Local MongoDB (Recommended for Development)

1. **Download MongoDB**: Visit [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) and download the Community Server for your operating system.
2. **Install MongoDB**: Follow the installation instructions for your OS.
3. **Start MongoDB**:
   - On Windows: Open Command Prompt and run `mongod`
   - On macOS/Linux: Open Terminal and run `mongod`
4. **Verify**: MongoDB should now be running on `mongodb://localhost:27017`

### Option 2: MongoDB Atlas (Cloud)

1. **Sign Up**: Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. **Create a Cluster**: Follow the steps to create a free tier cluster.
3. **Create a Database User**: In the "Database Access" section, create a new user with a username and password.
4. **Whitelist IP**: In the "Network Access" section, add your IP address to the whitelist (or use 0.0.0.0/0 for development).
5. **Get Connection String**: Click "Connect" → "Connect your application" and copy the connection string.
6. **Update .env**: Replace `MONGODB_URI` in your `.env` file with this connection string (remember to replace `<password>` with your database user's password).

## Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   The `.env` file is already created with default values. Update `JWT_SECRET` to a secure random string.

3. **Seed the Database**:
   Populate the database with initial courses and quiz data:
   ```bash
   npm run seed
   ```

4. **Start the Server**:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth token)

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses/:id/enroll` - Enroll in a course (requires auth)
- `GET /api/courses/user/enrolled` - Get enrolled courses (requires auth)
- `PUT /api/courses/:courseId/lessons/:lessonId/complete` - Mark lesson as complete (requires auth)

### Users
- `PUT /api/users/profile` - Update user profile (requires auth)
- `PUT /api/users/activity` - Update user activity (requires auth)

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/course/:courseId` - Get quiz by course ID

### Notes
- `GET /api/notes` - Get user's notes (requires auth)
- `GET /api/notes/course/:courseId/lesson/:lessonId` - Get note for specific lesson (requires auth)
- `POST /api/notes` - Save/update note (requires auth)
