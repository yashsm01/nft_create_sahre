/**
 * Item Model (Individual Manufactured Item)
 * Represents individual manufactured items with NFTs
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Batch from './Batch';

// Item attributes interface
export interface ItemAttributes {
  id: number;
  serialNumber: string;
  batchId: string;  // UUID reference to Batch
  manufacturingDate: Date;
  manufacturingOperator: string;
  qualityStatus: 'PENDING' | 'PASSED' | 'FAILED' | 'REWORK';
  qualityInspector?: string;
  qualityInspectionDate?: Date;
  qualityNotes?: string;
  nftMintAddress?: string;
  nftExplorerLink?: string;
  nftMetadataUri?: string;
  currentOwner?: string;
  status: 'MANUFACTURED' | 'IN_TRANSIT' | 'DELIVERED' | 'RETURNED' | 'SCRAPPED';
  additionalAttributes?: object;
  metadata?: object;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional fields for creation
interface ItemCreationAttributes extends Optional<ItemAttributes, 'id' | 'qualityStatus' | 'qualityInspector' | 'qualityInspectionDate' | 'qualityNotes' | 'nftMintAddress' | 'nftExplorerLink' | 'nftMetadataUri' | 'currentOwner' | 'status' | 'additionalAttributes' | 'metadata'> { }

/**
 * Item Model Class
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - serialNumber
 *         - batchId
 *         - manufacturingDate
 *         - manufacturingOperator
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         serialNumber:
 *           type: string
 *           description: Unique serial number
 *           example: GTIN-8901234567890-2025Q1-00001
 *         batchId:
 *           type: integer
 *           description: Batch ID (which batch this item belongs to)
 *           example: 1
 *         manufacturingDate:
 *           type: string
 *           format: date-time
 *           description: Manufacturing date/time
 *         manufacturingOperator:
 *           type: string
 *           description: Operator who manufactured
 *           example: John Doe
 *         qualityStatus:
 *           type: string
 *           enum: [PENDING, PASSED, FAILED, REWORK]
 *           description: Quality inspection status
 *         nftMintAddress:
 *           type: string
 *           description: Solana NFT mint address
 *         status:
 *           type: string
 *           enum: [MANUFACTURED, IN_TRANSIT, DELIVERED, RETURNED, SCRAPPED]
 *           description: Item lifecycle status
 */
class Item extends Model<ItemAttributes, ItemCreationAttributes> implements ItemAttributes {
  declare id: number;
  declare serialNumber: string;
  declare batchId: string;
  declare manufacturingDate: Date;
  declare manufacturingOperator: string;
  declare qualityStatus: 'PENDING' | 'PASSED' | 'FAILED' | 'REWORK';
  declare qualityInspector?: string;
  declare qualityInspectionDate?: Date;
  declare qualityNotes?: string;
  declare nftMintAddress?: string;
  declare nftExplorerLink?: string;
  declare nftMetadataUri?: string;
  declare currentOwner?: string;
  declare status: 'MANUFACTURED' | 'IN_TRANSIT' | 'DELIVERED' | 'RETURNED' | 'SCRAPPED';
  declare additionalAttributes?: object;
  declare metadata?: object;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

// Initialize model
Item.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    serialNumber: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    batchId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'batches',
        key: 'id',
      },
    },
    manufacturingDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    manufacturingOperator: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    qualityStatus: {
      type: DataTypes.ENUM('PENDING', 'PASSED', 'FAILED', 'REWORK'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    qualityInspector: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    qualityInspectionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    qualityNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nftMintAddress: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    nftExplorerLink: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nftMetadataUri: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    currentOwner: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('MANUFACTURED', 'IN_TRANSIT', 'DELIVERED', 'RETURNED', 'SCRAPPED'),
      allowNull: false,
      defaultValue: 'MANUFACTURED',
    },
    additionalAttributes: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'items',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['serialNumber'],
      },
      {
        fields: ['batchId'],
      },
      {
        fields: ['qualityStatus'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['manufacturingDate'],
      },
    ],
  }
);

// Define associations
Item.belongsTo(Batch, { foreignKey: 'batchId', as: 'batch' });
Batch.hasMany(Item, { foreignKey: 'batchId', as: 'items' });

export default Item;

