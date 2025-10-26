/**
 * Models Index
 * Export all database models
 * 
 * Hierarchy:
 * Product (GTIN) → Batch → Item
 * FractionalToken → ShareTransfer
 */

import Product from './Product';
import Batch from './Batch';
import Item from './Item';
import FractionalToken from './FractionalToken';
import ShareTransfer from './ShareTransfer';

// Export models
export { Product, Batch, Item, FractionalToken, ShareTransfer };

// Export model initialization
export const initModels = () => {
  // Models are already initialized in their respective files
  // Associations are defined in model files
  console.log('✅ All models initialized');
  console.log('   • Product (GTIN-based master products)');
  console.log('   • Batch (Manufacturing runs per product)');
  console.log('   • Item (Individual manufactured items with NFTs)');
  console.log('   • FractionalToken (Fractionalized NFT share tokens)');
  console.log('   • ShareTransfer (Share token transfer history)');
};

export default {
  Product,
  Batch,
  Item,
  FractionalToken,
  ShareTransfer,
  initModels,
};

