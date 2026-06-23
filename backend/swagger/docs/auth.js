module.exports = {
  '/api/auth/register': {
    post: {
      summary: 'Register a new user',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'User registered successfully'
        },
        400: {
          description: 'User already exists'
        }
      }
    }
  },
  '/api/auth/confirm-email': {
    post: {
      summary: 'Confirm user email',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Email confirmed'
        },
        400: {
          description: 'Invalid or expired token'
        }
      }
    }
  },
  '/api/auth/resend-confirmation': {
    post: {
      summary: 'Resend confirmation email',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Confirmation email resent'
        },
        404: {
          description: 'User not found'
        }
      }
    }
  },
  '/api/auth/login': {
    post: {
      summary: 'Login user',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string' },
                password: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Login successful'
        },
        400: {
          description: 'Invalid credentials'
        }
      }
    }
  }
};
