# Setup Checklist ✅

Follow this checklist to get your Solana NFT project up and running.

---

## ☑️ Prerequisites

- [ ] Node.js v16+ installed
  ```bash
  node --version  # Should be v16 or higher
  ```

- [ ] npm installed
  ```bash
  npm --version
  ```

- [ ] Solana CLI installed (optional but recommended)
  ```bash
  solana --version
  ```

---

## ☑️ Project Setup

### Step 1: Install Dependencies

- [ ] Install all npm packages
  ```bash
  npm install
  ```

- [ ] Verify installation
  ```bash
  ls node_modules/@metaplex-foundation  # Should list packages
  ```

### Step 2: Wallet Setup

- [ ] Generate or locate your Solana keypair
  ```bash
  # Generate new keypair (if needed)
  solana-keygen new
  
  # Or verify existing keypair
  solana address
  ```

- [ ] Note your wallet address: `_______________________`

### Step 3: Add Images

- [ ] Download collection image
  ```bash
  cd assets/images
  curl -o collection.png https://raw.githubusercontent.com/solana-developers/professional-education/main/labs/metaplex-umi/collection.png
  ```

- [ ] Download NFT image
  ```bash
  curl -o nft.png https://raw.githubusercontent.com/solana-developers/professional-education/main/labs/metaplex-umi/nft.png
  ```

- [ ] Or add your own images:
  - [ ] `assets/images/collection.png` exists
  - [ ] `assets/images/nft.png` exists

### Step 4: Environment Configuration (Optional)

- [ ] Create `.env` file (optional - defaults work fine)
  ```bash
  touch .env
  ```

- [ ] Add configuration (if needed):
  ```env
  SOLANA_CLUSTER=devnet
  RPC_ENDPOINT=https://api.devnet.solana.com
  ```

---

## ☑️ First Run - Create Collection

- [ ] Run the create collection script
  ```bash
  npm run create:collection
  ```

- [ ] Verify output shows:
  - [ ] ✅ Wallet loaded successfully
  - [ ] ✅ Image uploaded to Arweave
  - [ ] ✅ Metadata uploaded
  - [ ] ✅ Collection created
  - [ ] ✅ Explorer link displayed

- [ ] **IMPORTANT**: Save collection address
  - Collection Address: `_______________________`

- [ ] View on Solana Explorer:
  - [ ] Collection appears
  - [ ] Metadata loads correctly
  - [ ] Image displays

- [ ] Update `.env` with collection address:
  ```env
  COLLECTION_NFT_ADDRESS=<your-collection-address>
  ```

---

## ☑️ Second Run - Create NFT

- [ ] Ensure collection address is in `.env`

- [ ] Run the create NFT script
  ```bash
  npm run create:nft
  ```

- [ ] Verify output shows:
  - [ ] ✅ NFT created
  - [ ] ✅ Associated with collection
  - [ ] ✅ Explorer link displayed

- [ ] **IMPORTANT**: Save NFT address
  - NFT Address: `_______________________`

- [ ] View on Solana Explorer:
  - [ ] NFT appears
  - [ ] Metadata loads
  - [ ] Image displays
  - [ ] Collection field shows (verified: false)

- [ ] Update `.env` with NFT address:
  ```env
  NFT_ADDRESS=<your-nft-address>
  ```

---

## ☑️ Third Run - Verify NFT

- [ ] Ensure both addresses are in `.env`:
  - [ ] `COLLECTION_NFT_ADDRESS` is set
  - [ ] `NFT_ADDRESS` is set

- [ ] Run the verify script
  ```bash
  npm run verify:nft
  ```

- [ ] Verify output shows:
  - [ ] ✅ NFT verified successfully

- [ ] Check on Solana Explorer:
  - [ ] Collection field shows (verified: true) ✅

---

## ☑️ Optional - Update NFT

- [ ] Edit `src/scripts/update-nft.ts` with new values

- [ ] Run the update script
  ```bash
  npm run update:nft
  ```

- [ ] Verify changes on Solana Explorer

---

## ☑️ Verification Checklist

### Collection Verification

Visit your collection on Solana Explorer and verify:

- [ ] Name is correct
- [ ] Symbol is correct
- [ ] Image loads
- [ ] Metadata URI is accessible
- [ ] "Is Collection" flag is true

### NFT Verification

Visit your NFT on Solana Explorer and verify:

- [ ] Name is correct
- [ ] Symbol is correct
- [ ] Image loads
- [ ] Attributes display correctly
- [ ] Collection address matches
- [ ] Verified flag is true (after verification)
- [ ] Supply is 1
- [ ] Decimals is 0

---

## ☑️ Customization Checklist

### Customize Collection

- [ ] Edit collection config in `src/scripts/create-collection.ts`:
  - [ ] Change name
  - [ ] Change symbol
  - [ ] Change description
  - [ ] Set royalty percentage
  - [ ] Update image path

### Customize NFT

- [ ] Edit NFT config in `src/scripts/create-nft.ts`:
  - [ ] Change name
  - [ ] Change symbol
  - [ ] Change description
  - [ ] Add/modify attributes
  - [ ] Set royalty percentage
  - [ ] Update image path

---

## ☑️ Production Deployment (Mainnet)

⚠️ **ONLY after thorough testing on devnet!**

- [ ] Test everything on devnet first
- [ ] Prepare mainnet wallet with sufficient SOL
- [ ] Update environment to mainnet:
  ```env
  SOLANA_CLUSTER=mainnet-beta
  ```
- [ ] Prepare production images
- [ ] Run collection creation
- [ ] Run NFT creation
- [ ] Verify on mainnet explorer
- [ ] Test marketplace compatibility

---

## ☑️ Troubleshooting

### Issue: "Insufficient balance"
- [ ] Re-run the command (auto-airdrops on devnet)
- [ ] Check wallet balance: `solana balance`

### Issue: "Collection address not found"
- [ ] Verify `COLLECTION_NFT_ADDRESS` in `.env`
- [ ] Ensure collection was created successfully

### Issue: "Image not found"
- [ ] Check `assets/images/` directory
- [ ] Verify image filenames match config

### Issue: "Keypair not found"
- [ ] Run `solana-keygen new`
- [ ] Verify keypair location: `~/.config/solana/id.json`

### Issue: TypeScript errors
- [ ] Run `npm install` again
- [ ] Check Node.js version (v16+)
- [ ] Clear cache: `rm -rf node_modules && npm install`

---

## ☑️ Success Criteria

You've successfully set up the project when:

✅ Collection created and visible on Solana Explorer
✅ NFT created and visible on Solana Explorer  
✅ NFT verified as part of collection
✅ All metadata displays correctly
✅ Images load properly
✅ No errors in console output

---

## 📝 Notes

Use this space to track your addresses and important information:

### Addresses

**Collection Address:**
```
___________________________________________________________
```

**NFT Address:**
```
___________________________________________________________
```

**Wallet Address:**
```
___________________________________________________________
```

### Explorer Links

**Collection:**
```
https://explorer.solana.com/address/_________________?cluster=devnet
```

**NFT:**
```
https://explorer.solana.com/address/_________________?cluster=devnet
```

### Metadata URIs

**Collection Metadata:**
```
https://arweave.net/___________________________________________
```

**NFT Metadata:**
```
https://arweave.net/___________________________________________
```

---

## 🎉 Congratulations!

If you've checked all boxes, you now have:

✅ A fully functional NFT collection on Solana
✅ A verified NFT as part of that collection
✅ Permanent storage on Arweave via Irys
✅ A production-ready codebase for creating more NFTs

**Next Steps:**
- Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand the code
- Customize the scripts for your use case
- Create more NFTs
- Build amazing projects! 🚀

