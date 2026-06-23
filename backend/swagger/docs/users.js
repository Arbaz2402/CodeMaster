module.exports = {
  '/api/users/profile': {
    put: {
      summary: 'Update user profile',
      tags: ['Users'],
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
                name: { type: 'string' },
                bio: { type: 'string' },
                about: { type: 'string' },
                avatar: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Updated user profile'
        }
      }
    }
  },
  '/api/users/activity': {
    put: {
      summary: 'Update user activity',
      tags: ['Users'],
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
                day: { type: 'string' },
                hours: { type: 'number' },
                description: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Updated user activity'
        }
      }
    }
  },
  '/api/users/activity/recent': {
    post: {
      summary: 'Add recent activity',
      tags: ['Users'],
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
                type: { type: 'string' },
                description: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Added recent activity'
        }
      }
    }
  },
  '/api/users/skills': {
    get: {
      summary: 'Get user skills',
      tags: ['Users'],
      security: [
        {
          bearerAuth: []
        }
      ],
      responses: {
        200: {
          description: 'List of user skills'
        }
      }
    },
    post: {
      summary: 'Add a skill',
      tags: ['Users'],
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
                skill: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Updated list of skills'
        }
      }
    }
  },
  '/api/users/skills/{skill}': {
    delete: {
      summary: 'Remove a skill',
      tags: ['Users'],
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          in: 'path',
          name: 'skill',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'Skill to remove'
        }
      ],
      responses: {
        200: {
          description: 'Updated list of skills'
        }
      }
    }
  },
  '/api/users/achievements': {
    post: {
      summary: 'Add an achievement',
      tags: ['Users'],
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
                icon: { type: 'string' },
                color: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Updated list of achievements'
        }
      }
    }
  },
  '/api/users/certificates': {
    post: {
      summary: 'Add a certificate',
      tags: ['Users'],
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
                courseId: { type: 'string' },
                courseTitle: { type: 'string' },
                certificateUrl: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Updated list of certificates'
        }
      }
    }
  }
};
