/**
 * Database Configuration
 * Sequelize setup for PostgreSQL
 */

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Database connection configuration
const config = {
  database: process.env.DB_NAME || 'product_tracking',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  dialect: 'postgres' as const,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// Create Sequelize instance
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    pool: config.pool,
  }
);

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    return false;
  }
};

// Sync database (create tables)
export const syncDatabase = async (force: boolean = false): Promise<void> => {
  try {
    await sequelize.sync({ force });
    console.log(`✅ Database synchronized${force ? ' (force)' : ''}.`);
  } catch (error) {
    console.error('❌ Error synchronizing database:', error);
    throw error;
  }
};

export default sequelize;

