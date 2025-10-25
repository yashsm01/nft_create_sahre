/**
 * Swagger/OpenAPI Configuration
 */

import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Tracking API',
      version: '1.0.0',
      description: `
        Blockchain-powered Product Traceability System API
        
        ## Features
        - 🏭 Batch Management
        - 📦 Product NFT Creation
        - ✅ Quality Inspection Records
        - 🔍 Product Verification
        - 📊 Manufacturing Analytics
        - 🔗 Blockchain Integration (Solana/Metaplex)
        
        ## Architecture
        - Express.js + TypeScript
        - PostgreSQL + Sequelize ORM
        - Solana NFT Integration
        - RESTful API Design
      `,
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.production.com',
        description: 'Production server'
      }
    ],
    tags: [
      {
        name: 'Batches',
        description: 'Manufacturing batch management'
      },
      {
        name: 'Products',
        description: 'Product NFT creation and management'
      },
      {
        name: 'Quality',
        description: 'Quality inspection records'
      },
      {
        name: 'Verification',
        description: 'Product verification and authentication'
      },
      {
        name: 'Analytics',
        description: 'Manufacturing analytics and reports'
      },
      {
        name: 'Health',
        description: 'API health and status checks'
      }
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object'
              }
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation successful'
            },
            data: {
              type: 'object'
            }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./api/routes/*.ts', './api/models/*.ts'] // Path to API routes
};

export const swaggerSpec = swaggerJsdoc(options);

