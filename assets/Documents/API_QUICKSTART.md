# ⚡ API Quick Start Guide

Get your Product Tracking API running in 5 minutes!

---

## 🎯 What You'll Get

✅ **REST API Server** with Express.js  
✅ **PostgreSQL Database** for data storage  
✅ **Solana NFT Integration** for blockchain tracking  
✅ **Swagger Documentation** at `/api-docs`  
✅ **Full CRUD Operations** for batches and products  

---

## 📦 Installation (1 minute)

```bash
# Already done if dependencies are installed
npm install
```

---

## 🗄️ Database Setup (2 minutes)

### Option 1: Quick Setup (Recommended)

```bash
# Install PostgreSQL (if not installed)
sudo apt update && sudo apt install postgresql -y

# Start PostgreSQL
sudo service postgresql start

# Create database automatically
npm run db:sync
```

### Option 2: Manual Setup

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE product_tracking;
CREATE USER postgres WITH PASSWORD 'postgres';// 123456
GRANT ALL PRIVILEGES ON DATABASE product_tracking TO postgres;
\q
```

---

## ⚙️ Configuration (1 minute)

### 1. Copy Environment File

```bash
cp .env.example .env
```

### 2. Edit Configuration (if needed)

```bash
nano .env
```

**Minimum required:**

```bash
DB_NAME=product_tracking
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3000
SOLANA_CLUSTER=devnet
```

---

## 🚀 Start Server (30 seconds)

```bash
# Development mode (with auto-reload)
npm run dev
```

**You should see:**

```
✅ Server started successfully!

╔═══════════════════════════════════════════════════╗
║                                                   ║
║        Product Tracking API v1.0.0                ║
║                                                   ║
╚═══════════════════════════════════════════════════╝

🌐 Server:          http://localhost:3000
📖 API Docs:        http://localhost:3000/api-docs
💚 Health Check:    http://localhost:3000/api/health
```

---

## ✅ Test API (30 seconds)

### 1. Health Check

```bash
curl http://localhost:3000/api/health
```

**Expected:**

```json
{
  "success": true,
  "message": "API is running"
}
```

### 2. View API Documentation

Open browser: **http://localhost:3000/api-docs**

---

## 🎨 First API Call: Create a Batch

```bash
curl -X POST http://localhost:3000/api/batches \
  -H "Content-Type: application/json" \
  -d '{
    "batchId": "BATCH-TEST-001",
    "collectionName": "Test Batch",
    "collectionSymbol": "TEST",
    "collectionDescription": "My first batch",
    "manufacturingFacility": "Factory-A",
    "productionLine": "Line-1",
    "startDate": "2025-01-15T00:00:00.000Z",
    "plannedQuantity": 10
  }'
```

**Success! You created:**
- ✅ Database record
- ✅ NFT collection on Solana blockchain

---

## 📊 Available Commands

```bash
# Start server
npm run dev              # Development mode
npm start                # Production mode

# Database
npm run db:sync          # Create/sync tables (safe)
npm run db:reset         # Reset database (CAUTION!)

# Product tracking (existing scripts)
npm run product:batch         # Create batch via script
npm run product:create-batch  # Create products via script
```

---

## 🔥 Common Operations

### Create Product NFT

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "serialNumber": "PROD-001",
    "productName": "Model-X",
    "productModel": "MX-2025",
    "productCategory": "Electronics",
    "batchId": "BATCH-TEST-001",
    "manufacturingDate": "2025-01-15T08:00:00.000Z",
    "manufacturingLocation": "Factory-A",
    "manufacturingOperator": "John Doe",
    "warrantyDurationMonths": 24
  }'
```

### Bulk Create 10 Products

```bash
curl -X POST http://localhost:3000/api/products/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "batchId": "BATCH-TEST-001",
    "productName": "Model-X",
    "productModel": "MX-2025",
    "productCategory": "Electronics",
    "quantity": 10,
    "manufacturingLocation": "Factory-A",
    "manufacturingOperator": "John Doe"
  }'
```

### Get All Products

```bash
curl http://localhost:3000/api/products
```

### Verify Product on Blockchain

```bash
curl http://localhost:3000/api/products/PROD-001/verify
```

---

## 🎯 Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Check if API is running |
| `/api-docs` | GET | Interactive API documentation |
| `/api/batches` | GET | List all batches |
| `/api/batches` | POST | Create batch + NFT collection |
| `/api/products` | GET | List all products |
| `/api/products` | POST | Create product NFT |
| `/api/products/bulk` | POST | Bulk create products |
| `/api/products/:serial/verify` | GET | Verify on blockchain |

---

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
sudo service postgresql status

# If not running
sudo service postgresql start

# Check connection
psql -U postgres -d product_tracking
```

### Port 3000 Already in Use

```bash
# Change port in .env
PORT=3001

# Or kill process using port
lsof -i :3000
kill -9 <PID>
```

### Solana RPC Error

```bash
# Check Solana wallet
solana balance --url devnet

# Request devnet SOL
solana airdrop 2 --url devnet
```

---

## 📚 Next Steps

1. **Explore Swagger UI**: http://localhost:3000/api-docs
2. **Read Full Documentation**: See `API_DOCUMENTATION.md`
3. **Test with Postman**: Import OpenAPI spec from `/api-docs.json`
4. **Add Authentication**: Implement JWT or API keys
5. **Deploy to Production**: Use PM2 + Nginx + SSL

---

## 🎉 Success!

You now have a fully functional Product Tracking API running! 🚀

**What's working:**
- ✅ REST API server
- ✅ PostgreSQL database
- ✅ Solana blockchain integration
- ✅ NFT creation and verification
- ✅ Swagger documentation
- ✅ Input validation
- ✅ Error handling

**Try it out:**
- Open http://localhost:3000/api-docs
- Create a batch
- Create some products
- Verify them on blockchain

**Need help?**
- Check `API_DOCUMENTATION.md` for detailed docs
- Visit http://localhost:3000/api/health/detailed for system status

---

Happy coding! 🎊

