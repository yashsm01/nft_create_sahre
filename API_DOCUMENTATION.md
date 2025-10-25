# 🚀 Product Tracking API Documentation

Complete REST API documentation for the blockchain-powered Product Traceability System.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Examples](#examples)
- [Testing](#testing)

---

## 🎯 Overview

### What is This API?

A production-ready REST API that combines:
- ✅ **Express.js** backend with TypeScript
- ✅ **PostgreSQL** database with Sequelize ORM
- ✅ **Solana blockchain** integration (NFTs via Metaplex)
- ✅ **Swagger/OpenAPI** documentation
- ✅ **Input validation** and error handling
- ✅ **MVC architecture** for maintainability

### Key Features

| Feature | Description |
|---------|-------------|
| 🏭 **Batch Management** | Create and manage manufacturing batches with NFT collections |
| 📦 **Product NFTs** | Generate unique product NFTs with full traceability |
| ✅ **Quality Control** | Track quality inspections and status updates |
| 🔍 **Blockchain Verification** | Verify product authenticity on-chain |
| 📊 **Analytics** | Get batch statistics and production metrics |
| 🔐 **Data Persistence** | PostgreSQL database for reliable storage |

---

## 🚀 Quick Start

### Prerequisites

```bash
# Required software
- Node.js 18+ 
- PostgreSQL 14+
- Solana CLI tools
```

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup PostgreSQL Database

```bash
# Install PostgreSQL (if not already installed)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo service postgresql start

# Create database
sudo -u postgres psql
CREATE DATABASE product_tracking;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE product_tracking TO postgres;
\q
```

### 3. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Required environment variables:**

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=product_tracking
DB_USER=postgres
DB_PASSWORD=postgres

# Server
PORT=3000
NODE_ENV=development

# Solana
SOLANA_CLUSTER=devnet
SOLANA_KEYPAIR_PATH=/home/user/.config/solana/id.json
```

### 4. Initialize Database

```bash
# Sync database (create tables)
npm run db:sync

# Or reset database (CAUTION: drops all tables!)
npm run db:reset
```

### 5. Start Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 6. Access API Documentation

Open your browser:
- **API Docs:** http://localhost:3000/api-docs
- **Health Check:** http://localhost:3000/api/health
- **Root:** http://localhost:3000

---

## 🏗️ Architecture

### MVC Structure

```
api/
├── config/
│   ├── database.ts         # Sequelize configuration
│   └── swagger.ts          # OpenAPI specification
├── models/
│   ├── Batch.ts           # Batch model
│   ├── Product.ts         # Product model
│   └── index.ts           # Model exports
├── controllers/
│   ├── batchController.ts    # Batch business logic
│   └── productController.ts  # Product business logic
├── routes/
│   ├── batchRoutes.ts        # Batch endpoints
│   ├── productRoutes.ts      # Product endpoints
│   └── healthRoutes.ts       # Health checks
├── middleware/
│   ├── validator.ts          # Input validation
│   └── errorHandler.ts       # Error handling
└── server.ts                 # Express server
```

### Technology Stack

```
┌─────────────────────────────────────────┐
│          Client Applications             │
│    (Mobile App, Web App, Scanner)        │
└─────────────┬───────────────────────────┘
              │ HTTP/REST
              ▼
┌─────────────────────────────────────────┐
│         Express.js REST API              │
│  ┌───────────────────────────────────┐  │
│  │  Routes → Controllers → Services  │  │
│  │  (MVC Pattern with Validation)    │  │
│  └───────────────────────────────────┘  │
└──────────┬─────────────────┬────────────┘
           │                 │
           ▼                 ▼
┌──────────────────┐  ┌──────────────────┐
│   PostgreSQL     │  │  Solana Blockchain│
│   (Sequelize)    │  │   (Metaplex NFT)  │
│                  │  │                   │
│  • Batches       │  │  • NFT Collections│
│  • Products      │  │  • Product NFTs   │
│  • Quality Data  │  │  • Verification   │
└──────────────────┘  └──────────────────┘
```

---

## 💾 Database Setup

### Automated Setup

```bash
# Sync database (safe - doesn't drop data)
npm run db:sync

# Reset database (CAUTION - drops all data!)
npm run db:reset
```

### Manual Setup

If you prefer manual database setup:

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE product_tracking;

-- Connect to database
\c product_tracking

-- Tables will be auto-created by Sequelize on first run
-- Or you can run migrations manually
```

### Database Schema

#### Batches Table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER (PK) | Auto-increment ID |
| batchId | STRING (UNIQUE) | Unique batch identifier |
| collectionName | STRING | NFT collection name |
| collectionSymbol | STRING | Collection symbol |
| manufacturingFacility | STRING | Facility location |
| productionLine | STRING | Production line |
| startDate | DATE | Batch start date |
| endDate | DATE | Batch completion date |
| plannedQuantity | INTEGER | Planned production |
| producedQuantity | INTEGER | Actual production |
| status | ENUM | PLANNED, IN_PROGRESS, COMPLETED, CANCELLED |
| nftCollectionAddress | STRING | Solana collection address |
| metadata | JSONB | Additional metadata |

#### Products Table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER (PK) | Auto-increment ID |
| serialNumber | STRING (UNIQUE) | Unique serial number |
| productName | STRING | Product name |
| productModel | STRING | Product model |
| productCategory | STRING | Product category |
| batchId | STRING (FK) | Reference to batch |
| manufacturingDate | DATE | Manufacturing date |
| manufacturingLocation | STRING | Manufacturing location |
| manufacturingOperator | STRING | Operator name |
| qualityStatus | ENUM | PENDING, PASSED, FAILED, REWORK |
| qualityInspector | STRING | Inspector name |
| qualityInspectionDate | DATE | Inspection date |
| warrantyStartDate | DATE | Warranty start |
| warrantyDurationMonths | INTEGER | Warranty duration |
| nftMintAddress | STRING | Solana NFT address |
| nftExplorerLink | STRING | Blockchain explorer link |
| status | ENUM | MANUFACTURED, IN_TRANSIT, DELIVERED, RETURNED, SCRAPPED |
| additionalAttributes | JSONB | Custom attributes |
| metadata | JSONB | Additional metadata |

---

## 🔌 API Endpoints

### Base URL

```
Development: http://localhost:3000
Production:  https://your-domain.com
```

### Endpoints Overview

| Category | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| **Health** | GET | `/api/health` | Basic health check |
| **Health** | GET | `/api/health/detailed` | Detailed status |
| **Health** | GET | `/api/health/db` | Database health |
| **Batches** | GET | `/api/batches` | List all batches |
| **Batches** | GET | `/api/batches/:id` | Get batch by ID |
| **Batches** | POST | `/api/batches` | Create batch + NFT collection |
| **Batches** | PUT | `/api/batches/:id` | Update batch |
| **Batches** | DELETE | `/api/batches/:id` | Delete batch |
| **Batches** | GET | `/api/batches/:id/stats` | Get batch statistics |
| **Products** | GET | `/api/products` | List all products |
| **Products** | GET | `/api/products/:serial` | Get product by serial |
| **Products** | POST | `/api/products` | Create single product NFT |
| **Products** | POST | `/api/products/bulk` | Bulk create products |
| **Products** | PUT | `/api/products/:serial` | Update product |
| **Products** | PUT | `/api/products/:serial/quality` | Update quality inspection |
| **Products** | GET | `/api/products/:serial/verify` | Verify on blockchain |
| **Products** | DELETE | `/api/products/:serial` | Delete product |

---

## 📡 API Usage Examples

### 1. Health Check

```bash
curl http://localhost:3000/api/health
```

**Response:**

```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

### 2. Create Batch (with NFT Collection)

```bash
curl -X POST http://localhost:3000/api/batches \
  -H "Content-Type: application/json" \
  -d '{
    "batchId": "BATCH-2025-Q1-001",
    "collectionName": "Model-X Pro Batch Q1-2025",
    "collectionSymbol": "MXPB25Q1",
    "collectionDescription": "Manufacturing batch for Model-X Pro Q1 2025",
    "manufacturingFacility": "Factory-A, Mumbai",
    "productionLine": "Line-1",
    "startDate": "2025-01-15T00:00:00.000Z",
    "plannedQuantity": 1000
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Batch created successfully",
  "data": {
    "batch": {
      "id": 1,
      "batchId": "BATCH-2025-Q1-001",
      "collectionName": "Model-X Pro Batch Q1-2025",
      "status": "IN_PROGRESS",
      "nftCollectionAddress": "ABC123...XYZ",
      "createdAt": "2025-01-15T10:30:00.000Z"
    },
    "blockchain": {
      "collectionAddress": "ABC123...XYZ",
      "explorerLink": "https://explorer.solana.com/address/ABC123...XYZ?cluster=devnet"
    }
  }
}
```

### 3. Create Single Product NFT

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "serialNumber": "PROD-2025-BATCH-2025-Q1-001-00001",
    "productName": "Model-X Pro",
    "productModel": "MXP-2025",
    "productCategory": "Electronics",
    "batchId": "BATCH-2025-Q1-001",
    "manufacturingDate": "2025-01-15T08:00:00.000Z",
    "manufacturingLocation": "Factory-A, Line-1",
    "manufacturingOperator": "John Doe",
    "qualityInspector": "Jane Smith",
    "qualityNotes": "All tests passed",
    "warrantyDurationMonths": 24,
    "warrantyTerms": "Standard 2-year warranty",
    "additionalAttributes": {
      "color": "Black",
      "weight": "1.5kg",
      "processor": "Intel i7"
    }
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product": {
      "id": 1,
      "serialNumber": "PROD-2025-BATCH-2025-Q1-001-00001",
      "productName": "Model-X Pro",
      "qualityStatus": "PASSED",
      "nftMintAddress": "XYZ789...ABC",
      "createdAt": "2025-01-15T10:35:00.000Z"
    },
    "blockchain": {
      "mintAddress": "XYZ789...ABC",
      "explorerLink": "https://explorer.solana.com/address/XYZ789...ABC?cluster=devnet"
    }
  }
}
```

### 4. Bulk Create Products

```bash
curl -X POST http://localhost:3000/api/products/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "batchId": "BATCH-2025-Q1-001",
    "productName": "Model-X Pro",
    "productModel": "MXP-2025",
    "productCategory": "Electronics",
    "quantity": 10,
    "startSequence": 1,
    "manufacturingLocation": "Factory-A, Line-1",
    "manufacturingOperator": "John Doe",
    "warrantyDurationMonths": 24,
    "additionalAttributes": {
      "color": "Black",
      "weight": "1.5kg"
    }
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Created 10/10 products successfully",
  "data": {
    "successCount": 10,
    "failureCount": 0,
    "products": [
      {
        "id": 1,
        "serialNumber": "PROD-2025-BATCH-2025-Q1-001-00001",
        "nftMintAddress": "..."
      },
      // ... 9 more products
    ]
  }
}
```

### 5. Verify Product on Blockchain

```bash
curl http://localhost:3000/api/products/PROD-2025-BATCH-2025-Q1-001-00001/verify
```

**Response:**

```json
{
  "success": true,
  "message": "Product verified successfully",
  "data": {
    "product": {
      "serialNumber": "PROD-2025-BATCH-2025-Q1-001-00001",
      "nftMintAddress": "XYZ789...ABC"
    },
    "verification": {
      "isVerified": true,
      "inCollection": true,
      "collectionAddress": "ABC123...XYZ",
      "explorerLink": "https://explorer.solana.com/address/XYZ789...ABC?cluster=devnet"
    }
  }
}
```

### 6. Get Batch Statistics

```bash
curl http://localhost:3000/api/batches/BATCH-2025-Q1-001/stats
```

**Response:**

```json
{
  "success": true,
  "data": {
    "batchId": "BATCH-2025-Q1-001",
    "plannedQuantity": 1000,
    "producedQuantity": 950,
    "completionRate": "95.00%",
    "qualityStats": {
      "passed": 900,
      "failed": 30,
      "pending": 10,
      "rework": 10
    },
    "status": "IN_PROGRESS"
  }
}
```

### 7. List Products with Filters

```bash
# Get all products in a batch
curl "http://localhost:3000/api/products?batchId=BATCH-2025-Q1-001&limit=50&offset=0"

# Get products by quality status
curl "http://localhost:3000/api/products?qualityStatus=PASSED&limit=20"

# Get products by status
curl "http://localhost:3000/api/products?status=MANUFACTURED"
```

---

## 🔐 Authentication

Currently, the API is open (no authentication required). To add authentication:

### Option 1: API Key (Simple)

Add middleware:

```typescript
// api/middleware/auth.ts
export const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
};
```

### Option 2: JWT (Recommended)

```bash
npm install jsonwebtoken
```

See full JWT implementation in standard Express.js guides.

---

## ⚠️ Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "batchId",
      "message": "Batch ID is required"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 500 | Internal Server Error |

---

## 🧪 Testing

### Using cURL

```bash
# Test health
curl http://localhost:3000/api/health

# Test batch creation
curl -X POST http://localhost:3000/api/batches \
  -H "Content-Type: application/json" \
  -d @test-data/batch.json
```

### Using Postman

1. Import API documentation: http://localhost:3000/api-docs.json
2. Create environment with variables
3. Run collection tests

### Using Thunder Client (VS Code)

1. Install Thunder Client extension
2. Import OpenAPI spec
3. Test endpoints interactively

---

## 📊 Monitoring

### Health Endpoints

```bash
# Basic health
curl http://localhost:3000/api/health

# Detailed health (includes DB and blockchain status)
curl http://localhost:3000/api/health/detailed

# Database health only
curl http://localhost:3000/api/health/db
```

---

## 🚢 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong database password
- [ ] Configure CORS properly
- [ ] Set up SSL/TLS (HTTPS)
- [ ] Use process manager (PM2)
- [ ] Configure firewall
- [ ] Set up database backups
- [ ] Monitor logs and errors
- [ ] Use environment variables (never commit .env!)

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start npm --name "product-api" -- start

# Monitor
pm2 monit

# Logs
pm2 logs product-api

# Restart
pm2 restart product-api
```

---

## 📚 Additional Resources

- **Swagger UI:** http://localhost:3000/api-docs
- **OpenAPI JSON:** http://localhost:3000/api-docs.json
- **Express.js Docs:** https://expressjs.com
- **Sequelize Docs:** https://sequelize.org
- **Solana Docs:** https://docs.solana.com
- **Metaplex Docs:** https://docs.metaplex.com

---

## 🆘 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL status
sudo service postgresql status

# Restart PostgreSQL
sudo service postgresql restart

# Check connection
psql -U postgres -d product_tracking
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=3001
```

### Solana Connection Issues

```bash
# Check Solana CLI
solana --version

# Check balance
solana balance --url devnet

# Request airdrop
solana airdrop 2 --url devnet
```

---

## 🎉 Success!

Your Product Tracking API is now ready to use! 🚀

Visit http://localhost:3000/api-docs to explore the interactive API documentation.

