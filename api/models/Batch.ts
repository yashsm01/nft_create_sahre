/**
 * Batch Model (Manufacturing Run)
 * Represents a manufacturing batch for a specific product
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Product from './Product';

// Batch attributes interface
export interface BatchAttributes {
  id: string;  // UUID
  batchName: string;  // Unique per product (can repeat across products)
  productId: string;  // Foreign key to Product (UUID)
  manufacturingFacility: string;
  productionLine: string;
  startDate: Date;
  endDate?: Date;
  plannedQuantity: number;
  producedQuantity: number;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  productNftReference?: string;  // Reference to Product Master NFT
  nftCollectionAddress?: string;
  nftCollectionExplorerLink?: string;
  metadata?: object;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional fields for creation
interface BatchCreationAttributes extends Optional<BatchAttributes, 'id' | 'producedQuantity' | 'endDate' | 'status' | 'productNftReference' | 'nftCollectionAddress' | 'nftCollectionExplorerLink' | 'metadata'> { }

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
 *           type: string
 *           format: uuid
 *           description: Auto-generated batch UUID
 *           example: "660e8400-e29b-41d4-a716-446655440001"
 *         batchName:
 *           type: string
 *           description: Batch name (unique per product)
 *           example: "2025-Q1-Factory-A"
 *         productId:
 *           type: string
 *           format: uuid
 *           description: Product UUID
 *           example: "550e8400-e29b-41d4-a716-446655440000"
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
  declare id: string;
  declare batchName: string;
  declare productId: string;
  declare manufacturingFacility: string;
  declare productionLine: string;
  declare startDate: Date;
  declare endDate?: Date;
  declare plannedQuantity: number;
  declare producedQuantity: number;
  declare status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  declare productNftReference?: string;
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
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
      type: DataTypes.UUID,
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
    productNftReference: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Reference to Product Master NFT address',
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
