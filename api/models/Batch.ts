/**
 * Batch Model (Manufacturing Run)
 * Represents a manufacturing batch for a specific product
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Product from './Product';

// Batch attributes interface
export interface BatchAttributes {
  id: number;
  batchName: string;  // Unique per product (can repeat across products)
  productId: number;  // Foreign key to Product
  manufacturingFacility: string;
  productionLine: string;
  startDate: Date;
  endDate?: Date;
  plannedQuantity: number;
  producedQuantity: number;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  nftCollectionAddress?: string;
  nftCollectionExplorerLink?: string;
  metadata?: object;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional fields for creation
interface BatchCreationAttributes extends Optional<BatchAttributes, 'id' | 'producedQuantity' | 'endDate' | 'status' | 'nftCollectionAddress' | 'nftCollectionExplorerLink' | 'metadata'> {}

/**
 * Batch Model Class
 * @swagger
 * components:
 *   schemas:
 *     Batch:
 *       type: object
 *       required:
 *         - batchName
 *         - productId
 *         - manufacturingFacility
 *         - productionLine
 *         - startDate
 *         - plannedQuantity
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         batchName:
 *           type: string
 *           description: Batch name (unique per product)
 *           example: 2025-Q1-Factory-A
 *         productId:
 *           type: integer
 *           description: Product ID (GTIN owner)
 *           example: 1
 *         manufacturingFacility:
 *           type: string
 *           description: Facility where batch is manufactured
 *           example: Factory-A, Mumbai
 *         productionLine:
 *           type: string
 *           description: Production line identifier
 *           example: Line-1
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Batch start date
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Batch completion date
 *         plannedQuantity:
 *           type: integer
 *           description: Planned production quantity
 *           example: 1000
 *         producedQuantity:
 *           type: integer
 *           description: Actual produced quantity (can update/top up)
 *           example: 950
 *         status:
 *           type: string
 *           enum: [PLANNED, IN_PROGRESS, COMPLETED, CANCELLED]
 *           description: Batch status
 *         nftCollectionAddress:
 *           type: string
 *           description: Solana NFT collection address
 */
class Batch extends Model<BatchAttributes, BatchCreationAttributes> implements BatchAttributes {
  declare id: number;
  declare batchName: string;
  declare productId: number;
  declare manufacturingFacility: string;
  declare productionLine: string;
  declare startDate: Date;
  declare endDate?: Date;
  declare plannedQuantity: number;
  declare producedQuantity: number;
  declare status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  declare nftCollectionAddress?: string;
  declare nftCollectionExplorerLink?: string;
  declare metadata?: object;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

// Initialize model
Batch.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    batchName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: 'Batch name (unique per product, can repeat across products)',
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    manufacturingFacility: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    productionLine: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    plannedQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    producedQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'PLANNED',
    },
    nftCollectionAddress: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    nftCollectionExplorerLink: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'batches',
    timestamps: true,
    indexes: [
      {
        // Unique constraint: batchName must be unique per product
        unique: true,
        fields: ['productId', 'batchName'],
        name: 'unique_batch_per_product',
      },
      {
        fields: ['productId'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['startDate'],
      },
    ],
  }
);

// Define associations
Batch.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(Batch, { foreignKey: 'productId', as: 'batches' });

export default Batch;
