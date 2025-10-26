/**
 * Product Model (Master Product Definition)
 * Represents a company's product with unique GTIN code
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { v4 as uuidv4 } from 'uuid';

// Product attributes interface
export interface ProductAttributes {
  id: string;  // UUID
  gtin?: string;  // Global Trade Item Number (optional)
  productName: string;
  company: string;
  category: string;
  description?: string;
  model?: string;
  specifications?: object;
  warrantyMonths?: number;
  imageUrl?: string;
  nftMintAddress?: string;  // Product Master NFT address
  nftMetadataUri?: string;  // Metadata URI for Product NFT
  nftExplorerLink?: string;  // Solana Explorer link
  metadata?: object;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional fields for creation
interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'gtin' | 'description' | 'model' | 'specifications' | 'warrantyMonths' | 'imageUrl' | 'nftMintAddress' | 'nftMetadataUri' | 'nftExplorerLink' | 'metadata' | 'isActive'> { }

/**
 * Product Model Class
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - productName
 *         - company
 *         - category
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated UUID
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         gtin:
 *           type: string
 *           description: Global Trade Item Number (optional)
 *           example: "8901234567890"
 *         productName:
 *           type: string
 *           description: Product name
 *           example: Model-X Pro
 *         company:
 *           type: string
 *           description: Company/brand name
 *           example: TechCorp Industries
 *         category:
 *           type: string
 *           description: Product category
 *           example: Electronics
 *         description:
 *           type: string
 *           description: Product description
 *         model:
 *           type: string
 *           description: Model number
 *           example: MXP-2025
 *         specifications:
 *           type: object
 *           description: Product specifications
 *         warrantyMonths:
 *           type: integer
 *           description: Warranty duration in months
 *           example: 24
 *         imageUrl:
 *           type: string
 *           description: Product image URL
 *         isActive:
 *           type: boolean
 *           description: Whether product is active
 */
class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  declare id: string;
  declare gtin?: string;
  declare productName: string;
  declare company: string;
  declare category: string;
  declare description?: string;
  declare model?: string;
  declare specifications?: object;
  declare warrantyMonths?: number;
  declare imageUrl?: string;
  declare nftMintAddress?: string;
  declare nftMetadataUri?: string;
  declare nftExplorerLink?: string;
  declare metadata?: object;
  declare isActive: boolean;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

// Initialize model
Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    gtin: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
      validate: {
        is: /^[0-9]+$/i, // Only numbers
      },
      comment: 'Global Trade Item Number (barcode) - Optional',
    },
    productName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    company: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    specifications: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Product specifications (weight, dimensions, etc.)',
    },
    warrantyMonths: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 120,
      },
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nftMintAddress: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Product Master NFT mint address on Solana',
    },
    nftMetadataUri: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Arweave/IPFS URI for NFT metadata',
    },
    nftExplorerLink: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Solana Explorer link for Product NFT',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['gtin'],
      },
      {
        fields: ['company'],
      },
      {
        fields: ['category'],
      },
      {
        fields: ['isActive'],
      },
      {
        fields: ['nftMintAddress'],
      },
    ],
  }
);

export default Product;
