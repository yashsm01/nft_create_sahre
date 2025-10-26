/**
 * Express Server
 * Main application entry point
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

// Import configurations
import sequelize, { testConnection, syncDatabase } from './config/database';
import { swaggerSpec } from './config/swagger';

// Import routes
import healthRoutes from './routes/healthRoutes';
import productRoutes from './routes/productRoutes';
import batchRoutes from './routes/batchRoutes';
import itemRoutes from './routes/itemRoutes';
import fractionalizeRoutes from './routes/fractionalizeRoutes';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Import models to ensure they're loaded
import './models';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();
const PORT = process.env.PORT || 3000;

/**
 * Middleware Setup
 */

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

/**
 * API Documentation (Swagger)
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Product Tracking API Documentation',
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

/**
 * Root endpoint
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Product Tracking API',
    version: '1.0.0',
    documentation: `${req.protocol}://${req.get('host')}/api-docs`,
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      batches: '/api/batches',
      items: '/api/items',
      fractionalize: '/api/fractionalize',
    },
  });
});

/**
 * API Routes
 */
app.use('/api/health', healthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/fractionalize', fractionalizeRoutes);

/**
 * Error Handling
 */
app.use(notFoundHandler);
app.use(errorHandler);

/**
 * Database Connection and Server Start
 */
const startServer = async () => {
  try {
    console.log('\n🚀 Starting Product Tracking API Server...\n');

    // Test database connection
    console.log('📡 Connecting to database...');
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error('❌ Failed to connect to database');
      process.exit(1);
    }

    // Sync database (create tables if they don't exist)
    if (process.env.DB_SYNC === 'true') {
      console.log('🔄 Synchronizing database...');
      await syncDatabase(process.env.DB_FORCE_SYNC === 'true');
    }

    // Start server
    app.listen(PORT, () => {
      console.log('\n✅ Server started successfully!\n');
      console.log('╔═══════════════════════════════════════════════════╗');
      console.log('║                                                   ║');
      console.log('║        Product Tracking API v1.0.0                ║');
      console.log('║                                                   ║');
      console.log('╚═══════════════════════════════════════════════════╝\n');
      console.log(`🌐 Server:          http://localhost:${PORT}`);
      console.log(`📖 API Docs:        http://localhost:${PORT}/api-docs`);
      console.log(`💚 Health Check:    http://localhost:${PORT}/api/health`);
      console.log(`🗄️  Database:        ${process.env.DB_NAME || 'product_tracking'}`);
      console.log(`⛓️  Blockchain:      Solana ${process.env.SOLANA_CLUSTER || 'devnet'}`);
      console.log(`🔧 Environment:     ${process.env.NODE_ENV || 'development'}\n`);
      console.log('═════════════════════════════════════════════════════\n');
      console.log('🔗 Available Endpoints:');
      console.log('   • GET  /api/health           - Health check');
      console.log('   • GET  /api/products         - List products (GTIN)');
      console.log('   • POST /api/products         - Create product');
      console.log('   • GET  /api/batches          - List batches');
      console.log('   • POST /api/batches          - Create batch (+ NFT collection)');
      console.log('   • PUT  /api/batches/:id      - Update/top up batch');
      console.log('   • GET  /api/items            - List items');
      console.log('   • POST /api/items            - Create item NFT');
      console.log('   • GET  /api/items/:serial/verify - Verify item');
      console.log('   • POST /api/fractionalize    - Fractionalize NFT');
      console.log('   • POST /api/fractionalize/distribute - Distribute shares\n');
      console.log('═════════════════════════════════════════════════════\n');
      console.log('✨ Ready to accept requests!\n');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

/**
 * Graceful Shutdown
 */
process.on('SIGTERM', async () => {
  console.log('\n⚠️  SIGTERM received, shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n⚠️  SIGINT received, shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

// Start the server
startServer();

export default app;

