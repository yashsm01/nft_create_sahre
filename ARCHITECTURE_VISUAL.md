# Architecture Visualization

## 📦 Project Structure

```
hotel/
│
├── 📄 DOCUMENTATION (7 files)
│   ├── README.md                  Main documentation
│   ├── QUICKSTART.md             Fast setup guide
│   ├── ARCHITECTURE.md           Detailed architecture
│   ├── PROJECT_SUMMARY.md        Complete overview
│   ├── ARCHITECTURE_DIAGRAM.txt  ASCII diagrams
│   ├── SETUP_CHECKLIST.md        Interactive checklist
│   └── CREATED_FILES.md          File inventory
│
├── ⚙️ CONFIGURATION (3 files)
│   ├── package.json              Dependencies & scripts
│   ├── tsconfig.json             TypeScript config
│   └── .gitignore                Git exclusions
│
├── 💻 SOURCE CODE
│   └── src/
│       │
│       ├── 📂 scripts/ (4 files) - ENTRY POINTS
│       │   ├── create-collection.ts   Create NFT collection
│       │   ├── create-nft.ts          Create individual NFT
│       │   ├── verify-nft.ts          Verify NFT in collection
│       │   └── update-nft.ts          Update NFT metadata
│       │
│       ├── 📂 services/ (3 files) - BUSINESS LOGIC
│       │   ├── collection.ts          Collection operations
│       │   ├── nft.ts                 NFT operations
│       │   └── metadata.ts            Metadata handling
│       │
│       ├── 📂 utils/ (3 files) - UTILITIES
│       │   ├── umi.ts                 Umi setup
│       │   ├── uploader.ts            File uploads
│       │   └── helpers.ts             Helper functions
│       │
│       ├── 📂 types/ (1 file) - TYPE DEFINITIONS
│       │   └── index.ts               TypeScript interfaces
│       │
│       └── 📂 config/ (1 file) - CONFIGURATION
│           └── constants.ts           Constants & env config
│
└── 📁 ASSETS
    └── assets/
        ├── images/                    NFT images
        │   └── .gitkeep
        └── metadata/                  Metadata templates
            └── templates/
                └── .gitkeep
```

## 🔄 Data Flow

```
┌─────────────┐
│    USER     │
└──────┬──────┘
       │ npm run create:collection
       ▼
┌─────────────────────┐
│  SCRIPT LAYER       │
│  create-collection  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  SERVICE LAYER      │
│  createCollection() │
└──────┬──────────────┘
       │
       ├─► Upload Image (utils/uploader)
       ├─► Upload Metadata (utils/uploader)
       └─► Mint NFT (Umi → Metaplex)
       │
       ▼
┌─────────────────────┐
│  BLOCKCHAIN         │
│  Solana + Irys      │
└─────────────────────┘
```

## 🏗️ Architecture Layers

```
┌───────────────────────────────────────┐
│         SCRIPTS (4 files)             │  ← User runs these
│  Entry points for NFT operations      │
└─────────────┬─────────────────────────┘
              │ calls
┌─────────────▼─────────────────────────┐
│        SERVICES (3 files)             │  ← Business logic
│  Collection, NFT, Metadata logic      │
└─────────────┬─────────────────────────┘
              │ uses
┌─────────────▼─────────────────────────┐
│         UTILS (3 files)               │  ← Helpers
│  Umi setup, Uploader, Helpers         │
└─────────────┬─────────────────────────┘
              │ reads
┌─────────────▼─────────────────────────┐
│   CONFIG (1) + TYPES (1)              │  ← Configuration
│  Constants and TypeScript types       │
└───────────────────────────────────────┘
```

## 📊 File Distribution

```
TypeScript Source Code:
  Scripts   ████ 4 files  (33%)
  Services  ███  3 files  (25%)
  Utils     ███  3 files  (25%)
  Types     █    1 file   (8%)
  Config    █    1 file   (8%)
  ────────────────────────────
  Total:    12 files

Documentation:
  Guides    ██████████████ 7 files

Configuration:
  Config    ██████ 3 files
```

## 🎯 Component Responsibilities

### Scripts Layer
```
┌─────────────────────────────────┐
│  create-collection.ts           │
│  • Load environment             │
│  • Setup wallet                 │
│  • Call createCollection()      │
│  • Display results              │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  create-nft.ts                  │
│  • Load environment             │
│  • Setup wallet                 │
│  • Call createNFT()             │
│  • Display results              │
└─────────────────────────────────┘
```

### Service Layer
```
┌─────────────────────────────────┐
│  collection.ts                  │
│  • Validate config              │
│  • Upload assets                │
│  • Create collection NFT        │
│  • Return result                │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  nft.ts                         │
│  • Validate config              │
│  • Upload assets                │
│  • Create/update/verify NFT     │
│  • Return result                │
└─────────────────────────────────┘
```

### Utility Layer
```
┌─────────────────────────────────┐
│  uploader.ts                    │
│  • Read files                   │
│  • Upload to Irys               │
│  • Return URIs                  │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  helpers.ts                     │
│  • Load keypairs                │
│  • Fund wallets                 │
│  • Format output                │
└─────────────────────────────────┘
```

## 🔐 Security Architecture

```
┌─────────────────────────────────┐
│  Environment Variables          │
│  • Cluster selection            │
│  • RPC endpoints                │
│  • Addresses                    │
└─────────────────────────────────┘
            │
┌─────────────▼───────────────────┐
│  Keypair Management             │
│  • Load from file system        │
│  • Never in code                │
│  • Excluded from git            │
└─────────────────────────────────┘
            │
┌─────────────▼───────────────────┐
│  Input Validation               │
│  • Type checking                │
│  • Config validation            │
│  • Error handling               │
└─────────────────────────────────┘
```

## 📈 Extension Points

Want to add new features? Here's where to add them:

```
New NFT Operation:
  1. Add type      → types/index.ts
  2. Add service   → services/nft.ts
  3. Add script    → scripts/new-operation.ts
  4. Add command   → package.json

New Utility:
  1. Add function  → utils/helpers.ts
  2. Export it
  3. Use anywhere

New Configuration:
  1. Add constant  → config/constants.ts
  2. Export it
  3. Use in services
```

---

**Total Files**: 25
**Lines of Code**: ~1,300
**Documentation**: ~2,500 lines
**Architecture**: Modular, 5 layers
**Status**: ✅ Production Ready
