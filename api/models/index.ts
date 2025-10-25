/**
 * Models Index
 * Export all database models
 * 
 * Hierarchy:
 * Product (GTIN) → Batch → Item
 */

import Product from './Product';
import Batch from './Batch';
import Item from './Item';

// Export models
export { Product, Batch, Item };

// Export model initialization
export const initModels = () => {
  // Models are already initialized in their respective files
  // Associations are defined in model files
  console.log('✅ All models initialized');
  console.log('   • Product (GTIN-based master products)');
  console.log('   • Batch (Manufacturing runs per product)');
  console.log('   • Item (Individual manufactured items with NFTs)');
};

export default {
  Product,
  Batch,
  Item,
  initModels,
};

