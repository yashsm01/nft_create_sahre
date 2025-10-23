# Share Your NFT - Complete Guide

## Your NFT

- **Address**: `B8ZrqDvtgQ2NuLn28m4FedbQE1ncSftUKJwDYWpNu2RY`
- **Collection**: `8A7r94LZLqgimZLKH5rUtDPxoDe2MUzFg1e33sUfeWAM`
- **Explorer**: https://explorer.solana.com/address/B8ZrqDvtgQ2NuLn28m4FedbQE1ncSftUKJwDYWpNu2RY?cluster=devnet

---

## 🎯 Goal: Share This NFT with Multiple People

You'll create **100 fungible share tokens** that represent fractional ownership of your NFT.

---

## 📝 Step-by-Step Instructions

### Step 1: Get SOL (if needed)

```bash
# Check your balance
solana balance --url devnet

# If low, request airdrop
solana airdrop 2 --url devnet
```

Wait a few minutes if you hit the rate limit, then try again.

---

### Step 2: Create Share Token

```bash
# Create a new token with 0 decimals (whole shares only)
spl-token create-token --decimals 0
```

**Expected output:**
```
Creating token ABC123XYZ... under program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
Signature: ...
```

**IMPORTANT**: Copy the token address (e.g., `ABC123XYZ...`)

---

### Step 3: Create Token Account

```bash
# Replace ABC123XYZ with YOUR token address from Step 2
spl-token create-account ABC123XYZ...
```

---

### Step 4: Mint 100 Shares

```bash
# Mint 100 shares to yourself
spl-token mint ABC123XYZ... 100
```

**Result**: You now have 100 shares representing 100% ownership

---

### Step 5: Distribute Shares

Now send shares to people!

```bash
# Example: Give 25% to Person A
spl-token transfer ABC123XYZ... 25 PersonA_Wallet_Address --fund-recipient

# Example: Give 25% to Person B
spl-token transfer ABC123XYZ... 25 PersonB_Wallet_Address --fund-recipient

# Example: Give 25% to Person C
spl-token transfer ABC123XYZ... 25 PersonC_Wallet_Address --fund-recipient

# You keep 25 shares (25%)
```

---

## 💡 Example Distribution Plans

### Plan A: Equal Split (4 people)

```bash
# Each person gets 25 shares (25%)
spl-token transfer <TOKEN> 25 <PERSON1> --fund-recipient
spl-token transfer <TOKEN> 25 <PERSON2> --fund-recipient  
spl-token transfer <TOKEN> 25 <PERSON3> --fund-recipient
# You keep 25
```

### Plan B: Unequal Split (Founder + Team)

```bash
# You: 40 shares (40% - founder)
# CTO: 20 shares (20%)
# Designer: 20 shares (20%)
# Marketing: 20 shares (20%)

spl-token transfer <TOKEN> 20 <CTO_WALLET> --fund-recipient
spl-token transfer <TOKEN> 20 <DESIGNER_WALLET> --fund-recipient
spl-token transfer <TOKEN> 20 <MARKETING_WALLET> --fund-recipient
# You keep 40
```

### Plan C: Community Sale

```bash
# Sell shares to community members
# Each buyer gets 1-10 shares

spl-token transfer <TOKEN> 5 <BUYER1> --fund-recipient
spl-token transfer <TOKEN> 10 <BUYER2> --fund-recipient
spl-token transfer <TOKEN> 3 <BUYER3> --fund-recipient
# etc...
```

---

## 🔍 Check Share Balance

```bash
# Check how many shares someone has
spl-token accounts <THEIR_WALLET_ADDRESS>

# Check your own shares
spl-token accounts
```

---

## 📊 What This Achieves

✅ **Multiple Owners**: Each person owns shares representing their portion  
✅ **Tradeable**: Shares can be traded like any SPL token  
✅ **Transparent**: All ownership visible onchain  
✅ **Flexible**: Any distribution split you want  

---

## ⚠️ Important Notes

1. **Original NFT**: The NFT itself stays in your wallet
2. **Trust Model**: Share owners trust you to hold the NFT
3. **No Lock**: The NFT is NOT locked/vaulted automatically
4. **Governance**: Consider creating rules for decision-making

### For Production:

- Lock NFT in a multisig or vault program
- Set up governance for major decisions
- Document what shares represent legally
- Consider using Bridgesplit or similar protocols

---

## 🎨 Your Complete Commands

### Quick Copy-Paste:

```bash
# 1. Create share token
spl-token create-token --decimals 0

# 2. Create account (use your token from step 1)
spl-token create-account YOUR_TOKEN_HERE

# 3. Mint shares
spl-token mint YOUR_TOKEN_HERE 100

# 4. Distribute (customize recipients and amounts)
spl-token transfer YOUR_TOKEN_HERE 10 RECIPIENT1 --fund-recipient
spl-token transfer YOUR_TOKEN_HERE 20 RECIPIENT2 --fund-recipient
spl-token transfer YOUR_TOKEN_HERE 30 RECIPIENT3 --fund-recipient
```

---

## 📋 Save Your Addresses

**Share Token Mint**: `_______________________________________`

**Recipients**:
1. Name: __________________ Wallet: __________________ Shares: ____
2. Name: __________________ Wallet: __________________ Shares: ____
3. Name: __________________ Wallet: __________________ Shares: ____
4. Name: __________________ Wallet: __________________ Shares: ____

---

## 🚀 Next Steps

1. Run the commands above
2. Save your share token address
3. Distribute shares
4. Track ownership
5. Consider governance rules

---

**Questions?** Check `SIMPLE_SHARING_GUIDE.md` or `FRACTIONALIZATION_GUIDE.md`!

🎉 **Happy Sharing!**

