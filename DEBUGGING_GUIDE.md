# 🐛 Debugging Guide for Your Product Tracking System

This guide shows you how to debug your TypeScript code in VS Code.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Available Debug Configurations](#available-debug-configurations)
3. [How to Use Breakpoints](#how-to-use-breakpoints)
4. [Debugging Examples](#debugging-examples)
5. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Step 1: Open Debug Panel
- Press `Ctrl+Shift+D` (or `Cmd+Shift+D` on Mac)
- Or click the "Run and Debug" icon in the left sidebar (🐛)

### Step 2: Set a Breakpoint
1. Open any TypeScript file (e.g., `api/controllers/batchController.ts`)
2. Click in the gutter (left of line numbers) to set a red dot ⭕
3. This is your breakpoint - code will pause here

### Step 3: Start Debugging
1. Select a debug configuration from the dropdown at the top
2. Press `F5` or click the green play button ▶️
3. Your code will run and stop at breakpoints

---

## 🎯 Available Debug Configurations

### 1. 🚀 Debug API Server
**Use when**: You want to debug API endpoints

**How to use**:
1. Set breakpoints in controller files:
   - `api/controllers/batchController.ts`
   - `api/controllers/productController.ts`
   - `api/controllers/itemController.ts`
2. Select "🚀 Debug API Server" from dropdown
3. Press `F5`
4. Server starts in debug mode
5. Make API requests (curl, Postman, or browser)
6. Code pauses at your breakpoints!

**Example**:
```typescript
// In api/controllers/batchController.ts line 105
export const createBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByPk(productId);
    // ⭕ Set breakpoint here to inspect product data
    console.log(product); // You can inspect values here
```

---

### 2. 🔨 Debug Current File
**Use when**: You want to debug the file you're currently viewing

**How to use**:
1. Open any TypeScript file
2. Set breakpoints where you want
3. Select "🔨 Debug Current File"
4. Press `F5`
5. That file runs in debug mode

**Great for**:
- Testing utility functions
- Running individual scripts
- Quick debugging sessions

---

### 3. 🧪 Debug Batch Creation Script
**Use when**: You want to debug the batch creation process

**How to use**:
1. Open `src/scripts/create-batch-collection.ts`
2. Set breakpoints in the script or in `src/services/product.ts`
3. Select "🧪 Debug Batch Creation Script"
4. Press `F5`

---

### 4. 🔗 Attach to Running Process
**Use when**: Server is already running and you want to attach debugger

**How to use**:
1. Start server with debug flag:
   ```bash
   node --inspect=9229 node_modules/.bin/tsx api/server.ts
   ```
2. Select "🔗 Attach to Running Process"
3. Press `F5`
4. Debugger connects to running server

---

## 🎮 Debugger Controls

Once code is paused at a breakpoint, you'll see these controls:

| Button | Shortcut | Action |
|--------|----------|--------|
| ▶️ Continue | `F5` | Resume execution until next breakpoint |
| ⤵️ Step Over | `F10` | Execute current line, don't go into functions |
| ⤴️ Step Into | `F11` | Go inside function calls |
| ⤴️ Step Out | `Shift+F11` | Finish current function and return |
| 🔄 Restart | `Ctrl+Shift+F5` | Restart debugging session |
| ⏹️ Stop | `Shift+F5` | Stop debugging |

---

## 🔍 Debugging Examples

### Example 1: Debug Batch Creation

```typescript
// File: api/controllers/batchController.ts

export const createBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, batchName } = req.body;
    
    // ⭕ Breakpoint 1: Check incoming data
    console.log('Received:', { productId, batchName });
    
    const product = await Product.findByPk(productId);
    
    // ⭕ Breakpoint 2: Verify product exists
    if (!product) {
      res.status(404).json({ success: false });
      return;
    }
    
    // ⭕ Breakpoint 3: Check GTIN
    if (!product.gtin) {
      res.status(400).json({ success: false });
      return;
    }
    
    // ⭕ Breakpoint 4: Before blockchain call
    const umi = createUmiInstance(rpcEndpoint, keypair);
    
    // When paused, you can:
    // - Hover over variables to see their values
    // - Use Debug Console to run code: product.gtin
    // - Watch variables in the Watch panel
  }
};
```

**How to debug this**:
1. Set breakpoints at lines marked ⭕
2. Select "🚀 Debug API Server"
3. Press `F5`
4. Make a POST request to `/api/batches`
5. Code pauses at each breakpoint
6. Inspect variables in the left panel

---

### Example 2: Debug Product Service

```typescript
// File: src/services/product.ts

export async function createBatchCollection(
  umi: Umi,
  config: BatchConfig,
  cluster: "devnet" | "testnet" | "mainnet-beta"
): Promise<BatchCreationResult> {
  
  // ⭕ Breakpoint 1: Check config
  console.log('Config:', config);
  
  const collectionMint = generateSigner(umi);
  
  // ⭕ Breakpoint 2: Check signer
  console.log('Collection mint:', collectionMint.publicKey);
  
  const collectionMetadata = {
    name: `${config.productLine} - ${config.batchId}`,
    symbol: config.batchId.replace(/-/g, "").substring(0, 10).toUpperCase(),
    // ...
  };
  
  // ⭕ Breakpoint 3: Check metadata before upload
  console.log('Metadata:', collectionMetadata);
  
  const metadataUri = await umi.uploader.uploadJson(collectionMetadata);
  
  // ⭕ Breakpoint 4: Check uploaded URI
  console.log('Metadata URI:', metadataUri);
  
  // Continue debugging...
}
```

---

## 🔎 Inspecting Variables

When paused at a breakpoint, you can inspect variables in 3 ways:

### 1. **Variables Panel** (Left sidebar)
- Shows all local variables, closures, and globals
- Expand objects to see nested properties
- Click values to copy them

### 2. **Hover Over Code**
- Hover your mouse over any variable name
- See its current value in a tooltip
- Works for nested properties too: `product.gtin`

### 3. **Debug Console** (Bottom panel)
- Type any JavaScript/TypeScript expression
- Examples:
  ```javascript
  product.gtin
  product.productName.length
  JSON.stringify(batchConfig)
  items.filter(i => i.qualityStatus === 'PASSED')
  ```

---

## 🎯 Common Debugging Scenarios

### Scenario 1: "Why is my API returning an error?"

```typescript
// Set breakpoints at:
1. Start of controller function
2. After database queries
3. Before sending response
4. In try/catch error handler

// Example:
export const createBatch = async (req: Request, res: Response) => {
  try {
    // ⭕ Breakpoint: Check request data
    const { productId } = req.body;
    
    const product = await Product.findByPk(productId);
    // ⭕ Breakpoint: Did we find the product?
    
    if (!product.gtin) {
      // ⭕ Breakpoint: Why is GTIN missing?
      res.status(400).json({ ... });
    }
  } catch (error) {
    // ⭕ Breakpoint: What error happened?
    console.error(error);
  }
};
```

---

### Scenario 2: "Why is blockchain call failing?"

```typescript
// File: src/services/product.ts

export async function createBatchCollection(...) {
  // ⭕ Breakpoint: Check inputs
  console.log({ umi, config, cluster });
  
  // ⭕ Breakpoint: Check metadata
  const collectionMetadata = { ... };
  
  // ⭕ Breakpoint: Before upload
  const metadataUri = await umi.uploader.uploadJson(collectionMetadata);
  
  // ⭕ Breakpoint: After upload
  console.log('Uploaded:', metadataUri);
}
```

---

### Scenario 3: "Why is data not saving to database?"

```typescript
// Set breakpoints before and after Sequelize calls:

// ⭕ Breakpoint: Before create
const batch = await Batch.create({
  batchName,
  productId,
  // ...
});

// ⭕ Breakpoint: After create - inspect batch
console.log('Created batch:', batch.id);

// In Debug Console, you can check:
batch.toJSON()  // See all fields
batch.batchName  // Check specific field
```

---

## 🛠️ Troubleshooting

### Problem: Breakpoints show gray circle ⚪ instead of red ⭕

**Solution**:
- Make sure you're debugging the right configuration
- Check that source maps are enabled (they are in your tsconfig.json)
- Try restarting VS Code

---

### Problem: "Cannot find module" errors

**Solution**:
- Make sure `.env` file exists with correct paths
- Check that `node_modules` is installed: `npm install`
- Verify imports use correct paths

---

### Problem: Variables show "undefined" or "not available"

**Solution**:
- Make sure you're stopped at a breakpoint (code is paused)
- Variable might be out of scope
- Try using Debug Console to evaluate expressions

---

### Problem: Debugger doesn't stop at breakpoints

**Solution 1**: Restart debugging session (`Ctrl+Shift+F5`)

**Solution 2**: Check that breakpoint is in code that actually runs
```typescript
// ✅ This will hit:
export const createBatch = async (req: Request, res: Response) => {
  // ⭕ Breakpoint here hits when endpoint is called
}

// ❌ This won't hit if not called:
function unusedFunction() {
  // ⭕ Breakpoint here never hits
}
```

**Solution 3**: Clear all breakpoints and set them again

---

## 📝 Pro Tips

### Tip 1: Conditional Breakpoints
Right-click on a breakpoint → "Edit Breakpoint" → Add condition

```typescript
// Only pause when productId is 2:
if (productId === 2) {
  // Conditional breakpoint
}

// Or right-click breakpoint and set: productId === 2
```

---

### Tip 2: Logpoints (Breakpoints that don't pause)
Right-click in gutter → "Add Logpoint"

```typescript
// Instead of: console.log('Product:', product.gtin)
// Use logpoint: Product: {product.gtin}
// Code continues without pausing!
```

---

### Tip 3: Watch Expressions
Add expressions to Watch panel:
- `product.gtin`
- `items.length`
- `batch.producedQuantity >= batch.plannedQuantity`

Values update automatically as you step through code!

---

### Tip 4: Debug Console is JavaScript REPL
You can run any code while paused:

```javascript
// Check database
await Product.findAll()

// Test functions
collectionMetadata.name.length

// Modify variables (careful!)
productId = 1
```

---

## 🎓 Learning Resources

### Keyboard Shortcuts Summary

| Action | Windows/Linux | Mac |
|--------|--------------|-----|
| Start/Continue | `F5` | `F5` |
| Step Over | `F10` | `F10` |
| Step Into | `F11` | `F11` |
| Step Out | `Shift+F11` | `Shift+F11` |
| Stop | `Shift+F5` | `Shift+F5` |
| Restart | `Ctrl+Shift+F5` | `Cmd+Shift+F5` |
| Toggle Breakpoint | `F9` | `F9` |
| Open Debug Panel | `Ctrl+Shift+D` | `Cmd+Shift+D` |

---

## 🚀 Next Steps

1. **Try it now!**
   - Open `api/controllers/batchController.ts`
   - Set a breakpoint in `createBatch` function
   - Select "🚀 Debug API Server"
   - Press `F5`
   - Make a POST request to `/api/batches`
   - Watch it pause at your breakpoint! 🎉

2. **Experiment**
   - Try all debug configurations
   - Use Step Over, Step Into, Step Out
   - Inspect variables in different ways
   - Use Debug Console

3. **Debug real issues**
   - When something doesn't work, set breakpoints
   - Step through code line by line
   - Find exactly where the problem is

---

## ✅ Summary

You now have:
- ✅ 4 debug configurations ready to use
- ✅ Source maps enabled
- ✅ Proper VS Code settings
- ✅ Knowledge of how to use breakpoints
- ✅ Tips for effective debugging

**Happy debugging! 🐛➡️✅**

---

*Need help? The debugger is your best friend for understanding how code works and finding bugs!*

