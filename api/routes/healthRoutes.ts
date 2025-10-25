/**
 * Health Check Routes
 * API status and health monitoring
 */

import express, { Request, Response } from 'express';
import sequelize, { testConnection } from '../config/database';

const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Basic health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 */
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

/**
 * @swagger
 * /api/health/detailed:
 *   get:
 *     summary: Detailed health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Detailed API health status
 */
router.get('/detailed', async (req: Request, res: Response) => {
  try {
    // Test database connection
    const dbConnected = await testConnection();

    const health = {
      success: true,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        api: {
          status: 'healthy',
          message: 'API is running',
        },
        database: {
          status: dbConnected ? 'healthy' : 'unhealthy',
          message: dbConnected ? 'Database connected' : 'Database connection failed',
          type: 'PostgreSQL',
        },
        blockchain: {
          status: 'healthy',
          message: 'Solana integration ready',
          network: process.env.SOLANA_CLUSTER || 'devnet',
        },
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
      },
    };

    res.status(200).json(health);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/health/db:
 *   get:
 *     summary: Database health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Database health status
 */
router.get('/db', async (req: Request, res: Response) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      success: true,
      message: 'Database connection is healthy',
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

export default router;

