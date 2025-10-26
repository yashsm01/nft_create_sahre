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
        Blockchain-powered Product Traceability & NFT Fractionalization API
        
        ## Features
        - 🏭 Product Management (GTIN-based)
        - 📦 Batch Collections (NFT)
        - 🏷️ Individual Item NFTs
        - 🔨 NFT Fractionalization with Metadata
        - 📤 Share Distribution with Tracking
        - ✅ Quality Inspection Records
        - 🔍 Product Verification
        - 📊 Analytics & Reporting
        - 🔗 Blockchain Integration (Solana/Metaplex)
        - 💾 Complete Database Tracking
        
        ## Architecture
        - Express.js + TypeScript
        - PostgreSQL + Sequelize ORM
        - Solana Blockchain (SPL Token + Metaplex)
        - Arweave for Permanent Storage
        - RESTful API Design
        
        ## Fractionalization
        Split NFTs into fungible share tokens with rich metadata including:
        - Custom token name and symbol
        - Creator information tracking
        - Transfer recipient tracking
        - Complete history in database
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
        name: 'Products',
        description: 'Product (GTIN) management'
      },
      {
        name: 'Batches',
        description: 'Manufacturing batch management with NFT collections'
      },
      {
        name: 'Items',
        description: 'Individual product items with NFTs'
      },
      {
        name: 'Fractionalization',
        description: 'NFT fractionalization and share token distribution with metadata tracking'
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

