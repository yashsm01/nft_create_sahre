/**
 * Product Model (Master Product Definition)
 * Represents a company's product with unique GTIN code
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Product attributes interface
export interface ProductAttributes {
  id: number;
  gtin: string;  // Global Trade Item Number (unique barcode)
  productName: string;
  company: string;
  category: string;
  description?: string;
  model?: string;
  specifications?: object;
  warrantyMonths?: number;
  imageUrl?: string;
  metadata?: object;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional fields for creation
interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'description' | 'model' | 'specifications' | 'warrantyMonths' | 'imageUrl' | 'metadata' | 'isActive'> { }

/**
 * Product Model Class
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - gtin
 *         - productName
 *         - company
 *         - category
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         gtin:
 *           type: string
 *           description: Global Trade Item Number (barcode)
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
  declare id: number;
  declare gtin: string;
  declare productName: string;
  declare company: string;
  declare category: string;
  declare description?: string;
  declare model?: string;
  declare specifications?: object;
  declare warrantyMonths?: number;
  declare imageUrl?: string;
  declare metadata?: object;
  declare isActive: boolean;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

// Initialize model
Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    gtin: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        is: /^[0-9]+$/i, // Only numbers
      },
      comment: 'Global Trade Item Number (barcode)',
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
    ],
  }
);

export default Product;
