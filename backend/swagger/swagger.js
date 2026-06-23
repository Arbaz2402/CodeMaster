const swaggerJsdoc = require('swagger-jsdoc');
const authDocs = require('./docs/auth');
const coursesDocs = require('./docs/courses');
const usersDocs = require('./docs/users');
const quizzesDocs = require('./docs/quizzes');
const notesDocs = require('./docs/notes');
const playgroundsDocs = require('./docs/playgrounds');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CodeMaster API',
      version: '1.0.0',
      description: 'API documentation for CodeMaster'
    },
    tags: [
      { name: 'Auth', description: 'Authentication management' },
      { name: 'Courses', description: 'Course management' },
      { name: 'Users', description: 'User profile management' },
      { name: 'Quizzes', description: 'Quiz management' },
      { name: 'Notes', description: 'Note management' },
      { name: 'Playgrounds', description: 'Playground project management' }
    ],
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
    },
    paths: {
      ...authDocs,
      ...coursesDocs,
      ...usersDocs,
      ...quizzesDocs,
      ...notesDocs,
      ...playgroundsDocs
    }
  },
  apis: []
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerDocs;
