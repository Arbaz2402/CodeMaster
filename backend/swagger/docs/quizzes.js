module.exports = {
  '/api/quizzes': {
    get: {
      summary: 'Get all quizzes',
      tags: ['Quizzes'],
      responses: {
        200: {
          description: 'List of all quizzes'
        }
      }
    }
  },
  '/api/quizzes/course/{courseId}': {
    get: {
      summary: 'Get quiz for a specific course',
      tags: ['Quizzes'],
      parameters: [
        {
          in: 'path',
          name: 'courseId',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'Course ID'
        }
      ],
      responses: {
        200: {
          description: 'Quiz details'
        },
        404: {
          description: 'Quiz not found'
        }
      }
    }
  }
};
