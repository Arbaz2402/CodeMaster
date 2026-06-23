module.exports = {
  '/api/playgrounds': {
    get: {
      summary: 'Get all playground projects for current user',
      tags: ['Playgrounds'],
      security: [
        {
          bearerAuth: []
        }
      ],
      responses: {
        200: {
          description: 'List of playground projects'
        }
      }
    },
    post: {
      summary: 'Create a new playground project',
      tags: ['Playgrounds'],
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
                title: { type: 'string' },
                html: { type: 'string' },
                css: { type: 'string' },
                js: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Created playground project'
        }
      }
    }
  },
  '/api/playgrounds/{id}': {
    get: {
      summary: 'Get a specific playground project',
      tags: ['Playgrounds'],
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
          description: 'Project ID'
        }
      ],
      responses: {
        200: {
          description: 'Playground project details'
        },
        404: {
          description: 'Project not found'
        }
      }
    },
    put: {
      summary: 'Update a playground project',
      tags: ['Playgrounds'],
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
          description: 'Project ID'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                html: { type: 'string' },
                css: { type: 'string' },
                js: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Updated playground project'
        },
        404: {
          description: 'Project not found'
        }
      }
    },
    delete: {
      summary: 'Delete a playground project',
      tags: ['Playgrounds'],
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
          description: 'Project ID'
        }
      ],
      responses: {
        200: {
          description: 'Project deleted'
        },
        404: {
          description: 'Project not found'
        }
      }
    }
  }
};
