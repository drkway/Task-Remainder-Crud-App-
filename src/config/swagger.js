module.exports = {
  openapi: '3.0.0',
  info: { title: 'Task Management API', version: '1.0.0', description: 'APIs for tasks and auth (OTP + JWT)' },
  servers: [{ url: '/' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    }
  },
  paths: {
    '/auth/request-otp': {
      post: {
        tags: ['Auth'],
        summary: 'Request OTP',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' } }, required: ['email'] } } } },
        responses: { '200': { description: 'OTP sent' } }
      }
    },
    '/auth/verify-otp': {
      post: {
        tags: ['Auth'],
        summary: 'Verify OTP and receive tokens',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, code: { type: 'string' } }, required: ['email','code'] } } } },
        responses: { '200': { description: 'Tokens' } }
      }
    },
    '/auth/refresh': {
      post: { tags: ['Auth'], requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { refresh: { type: 'string' } }, required: ['refresh'] } } } }, responses: { '200': { description: 'New access token' } } }
    },
    '/auth/revoke': {
      post: { tags: ['Auth'], requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { refresh: { type: 'string' } }, required: ['refresh'] } } } }, responses: { '200': { description: 'Revoked' } } }
    },
    '/tasks': {
      post: {
        tags: ['Tasks'],
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { title: { type: 'string' }, description: { type: 'string' }, status: { type: 'string' } }, required: ['title'] } } } },
        responses: { '201': { description: 'Task created' } }
      },
      get: { tags: ['Tasks'], security: [{ bearerAuth: [] }], responses: { '200': { description: 'List of tasks' } } }
    },
    '/tasks/{id}': {
      put: {
        tags: ['Tasks'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { '200': { description: 'Updated' }, '404': { description: 'Not found' } }
      },
      delete: { tags: ['Tasks'], security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Deleted' }, '404': { description: 'Not found' } } }
    }
  }
};
