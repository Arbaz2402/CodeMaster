module.exports = {
  '/api/courses': {
    get: {
      summary: 'Get all courses',
      tags: ['Courses'],
      responses: {
        200: {
          description: 'List of all courses'
        },
        500: {
          description: 'Server error'
        }
      }
    }
  },
  '/api/courses/{id}': {
    get: {
      summary: 'Get a single course',
      tags: ['Courses'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'Course ID'
        }
      ],
      responses: {
        200: {
          description: 'Course details'
        },
        404: {
          description: 'Course not found'
        }
      }
    }
  },
  '/api/courses/{id}/enroll': {
    post: {
      summary: 'Enroll in a course',
      tags: ['Courses'],
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'Course ID'
        }
      ],
      responses: {
        200: {
          description: 'Enrolled successfully'
        },
        400: {
          description: 'Already enrolled'
        },
        404: {
          description: 'Course not found'
        }
      }
    }
  },
  '/api/courses/user/enrolled': {
    get: {
      summary: 'Get enrolled courses',
      tags: ['Courses'],
      security: [
        {
          bearerAuth: []
        }
      ],
      responses: {
        200: {
          description: 'List of enrolled courses'
        }
      }
    }
  },
  '/api/courses/{courseId}/lessons/{lessonId}/complete': {
    put: {
      summary: 'Mark lesson as complete/incomplete',
      tags: ['Courses'],
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          in: 'path',
          name: 'courseId',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'Course ID'
        },
        {
          in: 'path',
          name: 'lessonId',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'Lesson ID'
        }
      ],
      responses: {
        200: {
          description: 'Lesson completion updated'
        },
        404: {
          description: 'Not enrolled'
        }
      }
    }
  }
};
