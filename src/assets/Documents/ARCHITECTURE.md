# Architecture Documentation

## Overview

This project implements a modular, scalable architecture for creating and managing Solana NFTs using the Metaplex Token Metadata program. The architecture follows the principles of separation of concerns, single responsibility, and dependency injection.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         User Layer                           │
│                                                              │
│  npm run create:collection  │  npm run create:nft  │ ...    │
└──────────────────┬───────────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────────┐
│                      Script Layer                            │
│  ┌────────────────┐  ┌────────────┐  ┌──────────────┐      │
│  │ create-        │  │ create-    │  │ verify-nft   │      │
│  │ collection.ts  │  │ nft.ts     │  │ update-nft   │      │
│  └────────┬───────┘  └─────┬──────┘  └──────┬───────┘      │
└───────────┼──────────────────┼────────────────┼──────────────┘
            │                  │                │
┌───────────▼──────────────────▼────────────────▼──────────────┐
│                     Service Layer                            │
│  ┌──────────────┐  ┌──────────┐  ┌─────────────────┐       │
│  │ collection   │  │   nft    │  │   metadata      │       │
│  │              │  │          │  │                 │       │
│  │ - create     │  │ - create │  │ - prepare       │       │
│  │ - getMetadata│  │ - update │  │ - validate      │       │
│  └──────┬───────┘  └────┬─────┘  └────┬────────────┘       │
└─────────┼───────────────┼─────────────┼────────────────────┘
          │               │             │
┌─────────▼───────────────▼─────────────▼────────────────────┐
│                      Utility Layer                          │
│  ┌─────────┐  ┌───────────┐  ┌──────────────────────┐     │
│  │  umi    │  │ uploader  │  │      helpers         │     │
│  │         │  │           │  │                      │     │
│  │ - setup │  │ - upload  │  │ - loadKeypair        │     │
│  │         │  │   Image   │  │ - ensureFunding      │     │
│  │         │  │ - upload  │  │ - getExplorerLink    │     │
│  │         │  │   Metadata│  │ - display functions  │     │
│  └────┬────┘  └─────┬─────┘  └──────────────────────┘     │
└───────┼─────────────┼────────────────────────────────────────┘
        │             │
┌───────▼─────────────▼──────────────────────────────────────┐
│                   External Services                         │
│  ┌──────────────┐  ┌─────────────┐  ┌─────────────────┐   │
│  │   Solana     │  │    Irys     │  │  Metaplex       │   │
│  │   Network    │  │  (Storage)  │  │  Token Metadata │   │
│  └──────────────┘  └─────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Layer Descriptions

### 1. User Layer
- Entry point for users
- npm scripts defined in `package.json`
- Simple, intuitive commands

### 2. Script Layer (`src/scripts/`)
Executable TypeScript files that:
- Parse command-line arguments (if any)
- Load environment configuration
- Set up connections and Umi instance
- Call appropriate service functions
- Display results to the user

**Files:**
- `create-collection.ts` - Creates NFT collections
- `create-nft.ts` - Creates individual NFTs
- `verify-nft.ts` - Verifies NFT collection membership
- `update-nft.ts` - Updates NFT metadata

### 3. Service Layer (`src/services/`)
Business logic layer that:
- Implements core NFT operations
- Validates inputs
- Coordinates between utilities
- Handles Metaplex program interactions

**Files:**
- `collection.ts` - Collection creation and management
- `nft.ts` - NFT creation, update, verification
- `metadata.ts` - Metadata preparation and validation

**Key Functions:**
```typescript
// collection.ts
createCollection(umi, config, cluster): Promise<CollectionCreationResult>
getCollectionMetadata(umi, address): Promise<Metadata>

// nft.ts
createNFT(umi, config, cluster, collectionAddress?): Promise<NFTCreationResult>
verifyNFTCollection(umi, nftAddress, collectionAddress, cluster): Promise<void>
updateNFT(umi, nftAddress, updateData, cluster, newImagePath?): Promise<void>
getNFTMetadata(umi, nftAddress): Promise<Metadata>

// metadata.ts
prepareNFTMetadata(config, imageUri): NFTMetadata
validateNFTConfig(config): void
validateCollectionConfig(config): void
```

### 4. Utility Layer (`src/utils/`)
Reusable utility functions:
- No business logic
- Pure helper functions
- Can be used across the application

**Files:**
- `umi.ts` - Umi instance setup
- `uploader.ts` - File upload to Irys
- `helpers.ts` - General utilities

**Key Functions:**
```typescript
// umi.ts
createUmiInstance(rpcEndpoint, keypair): Umi

// uploader.ts
uploadImage(umi, filePath): Promise<string>
uploadMetadata(umi, metadata): Promise<string>
uploadImageAndMetadata(umi, imagePath, metadata): Promise<{imageUri, metadataUri}>

// helpers.ts
loadKeypair(): Promise<Keypair>
ensureFunding(connection, keypair): Promise<void>
getExplorerLinkForAddress(address, cluster): string
```

### 5. Configuration Layer (`src/config/`)
Centralized configuration:
- Environment variables
- Constants
- Default values

**Files:**
- `constants.ts` - All project constants

### 6. Type Layer (`src/types/`)
TypeScript type definitions:
- Ensures type safety
- Provides IDE autocomplete
- Documents data structures

**Files:**
- `index.ts` - All type definitions

**Key Types:**
```typescript
interface NFTMetadata
interface NFTConfig
interface CollectionConfig
interface NFTCreationResult
interface CollectionCreationResult
interface NFTUpdateData
interface EnvironmentConfig
```

## Data Flow Examples

### Creating a Collection

```
User runs: npm run create:collection
    ↓
create-collection.ts script
    ↓ 1. Load config
    ↓ 2. Create connection
    ↓ 3. Load keypair
    ↓ 4. Ensure funding
    ↓ 5. Create Umi instance
    ↓
createCollection(umi, config, cluster)
    ↓ 1. Validate config
    ↓ 2. Upload image → Irys
    ↓ 3. Upload metadata → Irys
    ↓ 4. Create collection NFT → Solana
    ↓
Return CollectionCreationResult
    ↓
Display to user with explorer link
```

### Creating and Verifying an NFT

```
User runs: npm run create:nft
    ↓
create-nft.ts script
    ↓
createNFT(umi, config, cluster, collectionAddress)
    ↓ 1. Validate config
    ↓ 2. Upload image and metadata
    ↓ 3. Create NFT (with collection reference)
    ↓
Return NFTCreationResult
    ↓
Display to user

Later...

User runs: npm run verify:nft
    ↓
verify-nft.ts script
    ↓
verifyNFTCollection(umi, nftAddress, collectionAddress, cluster)
    ↓ 1. Find metadata PDA
    ↓ 2. Call verifyCollectionV1
    ↓ 3. Sign with update authority
    ↓
NFT verified field set to true
```

## Design Principles

### 1. Separation of Concerns
Each layer has a distinct responsibility:
- Scripts handle user interaction
- Services contain business logic
- Utilities provide reusable functions
- Types ensure type safety

### 2. Single Responsibility
Each module has one clear purpose:
- `collection.ts` only handles collections
- `uploader.ts` only handles uploads
- Each function does one thing well

### 3. Dependency Injection
Dependencies are passed as parameters:
```typescript
// Good: Dependencies injected
function createNFT(umi: Umi, config: NFTConfig) { }

// Avoid: Dependencies created inside
function createNFT(config: NFTConfig) {
  const umi = createUmi(...) // Bad!
}
```

### 4. Type Safety
Full TypeScript coverage:
- All functions have typed parameters
- All return values are typed
- No `any` types (except when interfacing with untyped libraries)

### 5. Error Handling
Comprehensive error handling:
- Validation at service layer
- Try-catch in scripts
- User-friendly error messages

### 6. Reusability
Code can be easily reused:
```typescript
// Services can be imported anywhere
import { createNFT } from '../services/nft.js';

// Utilities can be used in any service
import { uploadImage } from '../utils/uploader.js';
```

## Extension Points

### Adding New NFT Operations

1. **Add types** in `src/types/index.ts`
2. **Add service function** in appropriate service file
3. **Create script** in `src/scripts/`
4. **Add npm command** in `package.json`

Example: Adding batch NFT creation

```typescript
// 1. types/index.ts
export interface BatchNFTConfig {
  nfts: NFTConfig[];
  collection: string;
}

// 2. services/nft.ts
export async function createBatchNFTs(
  umi: Umi,
  configs: NFTConfig[],
  cluster: string
): Promise<NFTCreationResult[]> {
  // Implementation
}

// 3. scripts/create-batch-nfts.ts
import { createBatchNFTs } from '../services/nft.js';
// Script implementation

// 4. package.json
"scripts": {
  "create:batch": "npx esrun src/scripts/create-batch-nfts.ts"
}
```

### Adding New Storage Providers

Currently using Irys, but Umi supports multiple uploaders:

```typescript
// utils/umi.ts
import { nftStorageUploader } from '@metaplex-foundation/umi-uploader-nft-storage';

export function createUmiInstance(rpcEndpoint: string, keypair: Keypair): Umi {
  const umi = createUmi(rpcEndpoint);
  const umiKeypair = umi.eddsa.createKeypairFromSecretKey(keypair.secretKey);
  
  umi
    .use(keypairIdentity(umiKeypair))
    .use(mplTokenMetadata())
    .use(nftStorageUploader({ token: 'YOUR_TOKEN' })); // Change uploader
  
  return umi;
}
```

### Adding Custom Metadata Fields

```typescript
// types/index.ts
export interface ExtendedNFTMetadata extends NFTMetadata {
  animation_url?: string;
  external_url?: string;
  background_color?: string;
}

// services/metadata.ts
export function prepareExtendedMetadata(
  config: NFTConfig,
  imageUri: string,
  animationUri?: string
): ExtendedNFTMetadata {
  // Implementation
}
```

## Testing Strategy

### Unit Tests
Test individual functions:
- Metadata validation
- Path resolution
- Data transformation

### Integration Tests
Test service functions:
- Collection creation
- NFT creation
- Verification

### End-to-End Tests
Test complete workflows:
- Create collection → Create NFT → Verify
- Create NFT → Update NFT

## Performance Considerations

1. **Parallel Operations**: Upload multiple NFTs in parallel
2. **Batch Transactions**: Use Solana's transaction batching
3. **Caching**: Cache frequently used data (metadata, addresses)
4. **Connection Pooling**: Reuse connections

## Security Considerations

1. **Private Key Management**
   - Never hardcode private keys
   - Use environment variables
   - Exclude from version control

2. **Input Validation**
   - Validate all user inputs
   - Sanitize file paths
   - Check address formats

3. **Transaction Verification**
   - Wait for finalized commitment
   - Verify transaction signatures
   - Handle failed transactions

## Future Enhancements

1. **CLI Arguments**: Accept parameters from command line
2. **Batch Operations**: Create multiple NFTs at once
3. **Progress Bars**: Visual progress for long operations
4. **Retry Logic**: Automatic retry on transient failures
5. **Logging**: File-based logging for audit trails
6. **Testing Suite**: Comprehensive test coverage
7. **Web Interface**: Optional web UI for non-technical users

---

This architecture provides a solid foundation for building complex NFT applications on Solana while remaining simple and easy to understand.

