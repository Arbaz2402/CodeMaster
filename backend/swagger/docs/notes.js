module.exports = {
  '/api/notes': {
    get: {
      summary: 'Get all notes for current user',
      tags: ['Notes'],
      security: [
        {
          bearerAuth: []
        }
      ],
      responses: {
        200: {
          description: 'List of all notes'
        }
      }
    },
    post: {
      summary: 'Create or update a note',
      tags: ['Notes'],
      security: [
        {
          bearerAuth: []
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                lessonId: { type: 'string' },
                courseId: { type: 'string' },
                content: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Saved note'
        }
      }
    }
  },
  '/api/notes/course/{courseId}/lesson/{lessonId}': {
    get: {
      summary: 'Get note for a specific lesson',
      tags: ['Notes'],
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
          description: 'Note content'
        }
      }
    }
  }
};
