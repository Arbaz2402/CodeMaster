const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'https://codemaster24.netlify.app'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CodeMaster API',
      version: '1.0.0',
      description: 'API documentation for CodeMaster'
    },
    servers: [
      {
        url: process.env.RENDER_EXTERNAL_URL || 'http://localhost:5000',
        description: 'API server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (req, res) => {
  res.send('CodeMaster Backend is running! Visit /api-docs for API documentation!');
});

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const userRoutes = require('./routes/users');
const quizRoutes = require('./routes/quizzes');
const noteRoutes = require('./routes/notes');
const seedRoutes = require('./routes/seed');
const playgroundRoutes = require('./routes/playgrounds');

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/playgrounds', playgroundRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API docs available at /api-docs`);
});
