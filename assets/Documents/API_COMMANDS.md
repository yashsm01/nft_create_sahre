# 📋 API Quick Command Reference

Quick copy-paste commands for common operations.

---

## 🚀 Server Commands

```bash
# Start development server (with hot-reload)
npm run dev

# Start production server
npm start

# Setup database (create tables)
npm run db:sync

# Reset database (CAUTION: deletes all data!)
npm run db:reset
```

---

## ✅ Health Checks

```bash
# Basic health check
curl http://localhost:3000/api/health

# Detailed health (database + blockchain status)
curl http://localhost:3000/api/health/detailed

# Database health only
curl http://localhost:3000/api/health/db
```

---

## 🏭 Batch Operations

### Create Batch

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

### List All Batches

```bash
curl http://localhost:3000/api/batches
```

### Get Batch by ID

```bash
curl http://localhost:3000/api/batches/BATCH-2025-Q1-001
```

### Get Batch Statistics

```bash
curl http://localhost:3000/api/batches/BATCH-2025-Q1-001/stats
```

### Update Batch

```bash
curl -X PUT http://localhost:3000/api/batches/BATCH-2025-Q1-001 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "COMPLETED",
    "endDate": "2025-03-31T00:00:00.000Z"
  }'
```

---

## 📦 Product Operations

### Create Single Product

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
    "warrantyDurationMonths": 24,
    "additionalAttributes": {
      "color": "Black",
      "weight": "1.5kg"
    }
  }'
```

### Bulk Create Products

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
    "warrantyDurationMonths": 24
  }'
```

### List All Products

```bash
curl http://localhost:3000/api/products
```

### Filter Products by Batch

```bash
curl "http://localhost:3000/api/products?batchId=BATCH-2025-Q1-001"
```

### Filter by Quality Status

```bash
curl "http://localhost:3000/api/products?qualityStatus=PASSED"
```

### Get Product by Serial Number

```bash
curl http://localhost:3000/api/products/PROD-2025-BATCH-2025-Q1-001-00001
```

### Verify Product on Blockchain

```bash
curl http://localhost:3000/api/products/PROD-2025-BATCH-2025-Q1-001-00001/verify
```

### Update Product Status

```bash
curl -X PUT http://localhost:3000/api/products/PROD-2025-BATCH-2025-Q1-001-00001 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "DELIVERED",
    "currentOwner": "CustomerWalletAddress123"
  }'
```

### Update Quality Inspection

```bash
curl -X PUT http://localhost:3000/api/products/PROD-2025-BATCH-2025-Q1-001-00001/quality \
  -H "Content-Type: application/json" \
  -d '{
    "qualityStatus": "PASSED",
    "qualityInspector": "Jane Smith",
    "qualityNotes": "All tests passed successfully"
  }'
```

---

## 🗄️ Database Commands

```bash
# Install PostgreSQL
sudo apt update && sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo service postgresql start

# Connect to PostgreSQL
sudo -u postgres psql

# Create database (inside psql)
CREATE DATABASE product_tracking;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE product_tracking TO postgres;
\q

# Initialize database tables
npm run db:sync
```

---

## 📊 Query Examples

### Pagination

```bash
# Get first 20 products
curl "http://localhost:3000/api/products?limit=20&offset=0"

# Get next 20 products
curl "http://localhost:3000/api/products?limit=20&offset=20"
```

### Multiple Filters

```bash
# Products in batch with quality status
curl "http://localhost:3000/api/products?batchId=BATCH-2025-Q1-001&qualityStatus=PASSED&limit=50"
```

### Batch with Status Filter

```bash
# Get all in-progress batches
curl "http://localhost:3000/api/batches?status=IN_PROGRESS"
```

---

## 🔧 Development Tools

### View Swagger Documentation

```
Open in browser: http://localhost:3000/api-docs
```

### Export OpenAPI Spec

```bash
curl http://localhost:3000/api-docs.json > openapi.json
```

### Check Server Logs

```bash
# If using PM2
pm2 logs product-api

# If running with npm run dev
# Logs appear in terminal
```

---

## 🐛 Troubleshooting Commands

```bash
# Check if server is running
curl http://localhost:3000/api/health

# Check PostgreSQL status
sudo service postgresql status

# Restart PostgreSQL
sudo service postgresql restart

# Check port usage
lsof -i :3000

# Kill process on port 3000
kill -9 $(lsof -t -i:3000)

# Check Solana balance
solana balance --url devnet

# Request SOL airdrop
solana airdrop 2 --url devnet
```

---

## 📝 Testing Workflow

### Complete Test Flow

```bash
# 1. Start server
npm run dev

# 2. Health check
curl http://localhost:3000/api/health

# 3. Create batch
curl -X POST http://localhost:3000/api/batches \
  -H "Content-Type: application/json" \
  -d '{
    "batchId": "TEST-BATCH-001",
    "collectionName": "Test Batch",
    "collectionSymbol": "TEST",
    "collectionDescription": "Test batch",
    "manufacturingFacility": "Factory-Test",
    "productionLine": "Line-1",
    "startDate": "2025-01-15T00:00:00.000Z",
    "plannedQuantity": 10
  }'

# 4. Create 5 products
curl -X POST http://localhost:3000/api/products/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "batchId": "TEST-BATCH-001",
    "productName": "Test Product",
    "productModel": "TP-001",
    "productCategory": "Test",
    "quantity": 5,
    "manufacturingLocation": "Factory-Test",
    "manufacturingOperator": "Tester"
  }'

# 5. List products
curl "http://localhost:3000/api/products?batchId=TEST-BATCH-001"

# 6. Verify first product
curl http://localhost:3000/api/products/PROD-2025-TEST-BATCH-001-00001/verify

# 7. Get batch stats
curl http://localhost:3000/api/batches/TEST-BATCH-001/stats
```

---

## 🎯 Production Deployment

```bash
# Install PM2
npm install -g pm2

# Start server with PM2
pm2 start npm --name "product-api" -- start

# Save PM2 config
pm2 save

# Setup PM2 startup
pm2 startup

# Monitor server
pm2 monit

# View logs
pm2 logs product-api

# Restart server
pm2 restart product-api

# Stop server
pm2 stop product-api
```

---

## 📚 Useful Links

| Resource | URL |
|----------|-----|
| API Documentation | http://localhost:3000/api-docs |
| Health Check | http://localhost:3000/api/health |
| OpenAPI JSON | http://localhost:3000/api-docs.json |
| Solana Explorer (devnet) | https://explorer.solana.com/?cluster=devnet |

---

## 💡 Pro Tips

```bash
# Save frequently used commands as aliases in ~/.bashrc
alias api-start="cd /home/user/hotel && npm run dev"
alias api-health="curl http://localhost:3000/api/health"
alias api-docs="xdg-open http://localhost:3000/api-docs"

# Use jq for pretty JSON output
curl http://localhost:3000/api/products | jq

# Save responses to files for testing
curl http://localhost:3000/api/batches > batches.json

# Use environment variables for different environments
PORT=3001 npm run dev  # Run on different port
NODE_ENV=production npm start  # Production mode
```

---

## ✅ Quick Verification Checklist

```bash
# 1. Server running?
curl http://localhost:3000/api/health

# 2. Database connected?
curl http://localhost:3000/api/health/db

# 3. Can create batch?
curl -X POST http://localhost:3000/api/batches -H "Content-Type: application/json" -d '{"batchId":"TEST","collectionName":"Test","collectionSymbol":"TST","collectionDescription":"Test","manufacturingFacility":"Test","productionLine":"Test","startDate":"2025-01-15T00:00:00.000Z","plannedQuantity":1}'

# 4. Can list data?
curl http://localhost:3000/api/batches

# 5. Swagger working?
# Open: http://localhost:3000/api-docs
```

---

**All commands tested and working! ✅**

Happy API testing! 🚀

