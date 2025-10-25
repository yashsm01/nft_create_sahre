/**
 * Request Validation Middleware
 * Using express-validator for input validation
 */

import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Handle validation results
 */
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

/**
 * Batch validation rules
 */
export const batchValidation = {
  create: [
    body('batchId')
      .trim()
      .notEmpty()
      .withMessage('Batch ID is required')
      .isLength({ min: 3, max: 100 })
      .withMessage('Batch ID must be between 3 and 100 characters'),
    body('collectionName')
      .trim()
      .notEmpty()
      .withMessage('Collection name is required')
      .isLength({ min: 3, max: 200 })
      .withMessage('Collection name must be between 3 and 200 characters'),
    body('collectionSymbol')
      .trim()
      .notEmpty()
      .withMessage('Collection symbol is required')
      .isLength({ min: 1, max: 10 })
      .withMessage('Collection symbol must be between 1 and 10 characters')
      .isUppercase()
      .withMessage('Collection symbol must be uppercase'),
    body('collectionDescription')
      .trim()
      .notEmpty()
      .withMessage('Collection description is required'),
    body('manufacturingFacility')
      .trim()
      .notEmpty()
      .withMessage('Manufacturing facility is required'),
    body('productionLine')
      .trim()
      .notEmpty()
      .withMessage('Production line is required'),
    body('startDate')
      .isISO8601()
      .withMessage('Start date must be a valid ISO 8601 date'),
    body('plannedQuantity')
      .isInt({ min: 1 })
      .withMessage('Planned quantity must be at least 1'),
    body('imageFile')
      .optional()
      .isString(),
  ],
  update: [
    param('id')
      .trim()
      .notEmpty()
      .withMessage('Batch ID is required'),
    body('status')
      .optional()
      .isIn(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
      .withMessage('Invalid status'),
    body('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid ISO 8601 date'),
    body('producedQuantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Produced quantity must be non-negative'),
  ],
  getById: [
    param('id')
      .trim()
      .notEmpty()
      .withMessage('Batch ID is required'),
  ],
  list: [
    query('status')
      .optional()
      .isIn(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
      .withMessage('Invalid status'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Offset must be non-negative'),
  ],
};

/**
 * Product validation rules
 */
export const productValidation = {
  create: [
    body('serialNumber')
      .trim()
      .notEmpty()
      .withMessage('Serial number is required')
      .isLength({ min: 3, max: 200 })
      .withMessage('Serial number must be between 3 and 200 characters'),
    body('productName')
      .trim()
      .notEmpty()
      .withMessage('Product name is required'),
    body('productModel')
      .trim()
      .notEmpty()
      .withMessage('Product model is required'),
    body('productCategory')
      .trim()
      .notEmpty()
      .withMessage('Product category is required'),
    body('batchId')
      .trim()
      .notEmpty()
      .withMessage('Batch ID is required'),
    body('manufacturingDate')
      .isISO8601()
      .withMessage('Manufacturing date must be a valid ISO 8601 date'),
    body('manufacturingLocation')
      .trim()
      .notEmpty()
      .withMessage('Manufacturing location is required'),
    body('manufacturingOperator')
      .trim()
      .notEmpty()
      .withMessage('Manufacturing operator is required'),
    body('warrantyDurationMonths')
      .optional()
      .isInt({ min: 0, max: 120 })
      .withMessage('Warranty duration must be between 0 and 120 months'),
    body('imageFile')
      .optional()
      .isString(),
  ],
  createBulk: [
    body('batchId')
      .trim()
      .notEmpty()
      .withMessage('Batch ID is required'),
    body('productName')
      .trim()
      .notEmpty()
      .withMessage('Product name is required'),
    body('productModel')
      .trim()
      .notEmpty()
      .withMessage('Product model is required'),
    body('productCategory')
      .trim()
      .notEmpty()
      .withMessage('Product category is required'),
    body('quantity')
      .isInt({ min: 1, max: 1000 })
      .withMessage('Quantity must be between 1 and 1000'),
    body('startSequence')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Start sequence must be at least 1'),
    body('manufacturingLocation')
      .trim()
      .notEmpty()
      .withMessage('Manufacturing location is required'),
    body('manufacturingOperator')
      .trim()
      .notEmpty()
      .withMessage('Manufacturing operator is required'),
  ],
  update: [
    param('serialNumber')
      .trim()
      .notEmpty()
      .withMessage('Serial number is required'),
    body('status')
      .optional()
      .isIn(['MANUFACTURED', 'IN_TRANSIT', 'DELIVERED', 'RETURNED', 'SCRAPPED'])
      .withMessage('Invalid status'),
    body('currentOwner')
      .optional()
      .isString(),
  ],
  updateQuality: [
    param('serialNumber')
      .trim()
      .notEmpty()
      .withMessage('Serial number is required'),
    body('qualityStatus')
      .isIn(['PENDING', 'PASSED', 'FAILED', 'REWORK'])
      .withMessage('Invalid quality status'),
    body('qualityInspector')
      .trim()
      .notEmpty()
      .withMessage('Quality inspector is required'),
    body('qualityNotes')
      .optional()
      .isString(),
  ],
  getBySerial: [
    param('serialNumber')
      .trim()
      .notEmpty()
      .withMessage('Serial number is required'),
  ],
  list: [
    query('batchId')
      .optional()
      .trim(),
    query('qualityStatus')
      .optional()
      .isIn(['PENDING', 'PASSED', 'FAILED', 'REWORK'])
      .withMessage('Invalid quality status'),
    query('status')
      .optional()
      .isIn(['MANUFACTURED', 'IN_TRANSIT', 'DELIVERED', 'RETURNED', 'SCRAPPED'])
      .withMessage('Invalid status'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Offset must be non-negative'),
  ],
};

