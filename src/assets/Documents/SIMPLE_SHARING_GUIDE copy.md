# Simple NFT Sharing Guide

## 🎯 Goal: Share Your NFT with Others

You have several options to share or "split" your NFT:

---

## Option 1: Transfer Ownership (Simplest) ✅

**Best for**: Giving the NFT to one person

### Steps:

```bash
# Transfer NFT to another wallet
spl-token transfer <NFT_MINT_ADDRESS> 1 <RECIPIENT_WALLET> --fund-recipient

# Example:
spl-token transfer B8ZrqDvtgQ2NuLn28m4FedbQE1ncSftUKJwDYWpNu2RY 1 RecipientWalletAddress --fund-recipient
```

This transfers the entire NFT to someone else.

---

## Option 2: Create Share Tokens (Recommended for Multiple People) ✅

**Best for**: Splitting ownership among multiple people

Instead of fractionalizing the actual NFT (which is complex), create **fungible tokens** that represent shares:

### Step 1: Create a Share Token

```bash
# Create a new fungible token (shares)
spl-token create-token --decimals 0

# This gives you a TOKEN_MINT address
# Example output: Creating token 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRu3m1wxre
```

### Step 2: Create Token Account

```bash
# Create an account for your share tokens
spl-token create-account <YOUR_SHARE_TOKEN_MINT>
```

### Step 3: Mint Shares

```bash
# Mint 100 shares to yourself
spl-token mint <YOUR_SHARE_TOKEN_MINT> 100
```

### Step 4: Distribute Shares

```bash
# Send shares to people
spl-token transfer <YOUR_SHARE_TOKEN_MINT> 10 <PERSON1_WALLET> --fund-recipient
spl-token transfer <YOUR_SHARE_TOKEN_MINT> 20 <PERSON2_WALLET> --fund-recipient
spl-token transfer <YOUR_SHARE_TOKEN_MINT> 30 <PERSON3_WALLET> --fund-recipient
# You keep 40 shares
```

Now each person owns a portion of the "shares" representing fractional ownership!

---

## Option 3: Using Your Created Share Token ✅

Your NFT: `B8ZrqDvtgQ2NuLn28m4FedbQE1ncSftUKJwDYWpNu2RY`

### Quick Commands:

```bash
# 1. Create share token
spl-token create-token --decimals 0

# Save the output (e.g., 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRu3m1wxre)

# 2. Create account
spl-token create-account 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRu3m1wxre

# 3. Mint 100 shares
spl-token mint 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRu3m1wxre 100

# 4. Send to Friend 1 (25 shares = 25%)
spl-token transfer 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRu3m1wxre 25 FRIEND1_WALLET --fund-recipient

# 5. Send to Friend 2 (25 shares = 25%)
spl-token transfer 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRu3m1wxre 25 FRIEND2_WALLET --fund-recipient

# 6. Send to Friend 3 (25 shares = 25%)
spl-token transfer 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRu3m1wxre 25 FRIEND3_WALLET --fund-recipient

# You keep 25 shares (25%)
```

---

## Option 4: Advanced - True Fractionalization

For **production-grade** fractional NFTs, use existing protocols:

### [Bridgesplit](https://www.bridgesplit.com/)
- Professional NFT fractionalization
- Secure vaulting
- Governance features
- Mainnet ready

### [Solvent Protocol](https://solvent.xyz/)
- NFT liquidity solution
- Fractionalization support
- Trading features

---

## 📊 Comparison

| Method | Complexity | Best For | NFT Status |
|--------|-----------|----------|------------|
| **Transfer** | Easy | Single recipient | Transferred |
| **Share Tokens** | Medium | Multiple people | You keep it |
| **Protocols** | Advanced | Production use | Vaulted |

---

## 🎯 Recommended Approach

**For sharing with friends/team:**

1. **Create Share Tokens** (Option 2)
2. Mint 100 shares
3. Distribute to people
4. Everyone owns shares representing fractional ownership
5. The NFT stays in your wallet (or lock in a vault)

---

## 💡 Example Scenario

You have an NFT worth 10 SOL and 4 co-owners:

```bash
# Create shares
spl-token create-token --decimals 0
# Output: Token mint: ABC123...

# Mint 100 shares
spl-token create-account ABC123...
spl-token mint ABC123... 100

# Distribute:
# You: 25 shares (25% = 2.5 SOL worth)
# Person A: 25 shares (25% = 2.5 SOL worth)
# Person B: 25 shares (25% = 2.5 SOL worth)
# Person C: 25 shares (25% = 2.5 SOL worth)

spl-token transfer ABC123... 25 PersonA_Wallet --fund-recipient
spl-token transfer ABC123... 25 PersonB_Wallet --fund-recipient
spl-token transfer ABC123... 25 PersonC_Wallet --fund-recipient
# You keep your 25
```

Now everyone owns 25% of the NFT (represented by share tokens)!

---

## 🔐 Security Notes

1. **Keep the Original NFT Safe**: Don't sell or transfer the actual NFT
2. **Lock in Vault** (Optional): For production, use a vault program
3. **Smart Contract**: For governance, create rules about share ownership
4. **Legal Agreement**: Document what shares represent

---

## 📝 Your NFT Details

- **Collection**: 8A7r94LZLqgimZLKH5rUtDPxoDe2MUzFg1e33sUfeWAM
- **NFT**: B8ZrqDvtgQ2NuLn28m4FedbQE1ncSftUKJwDYWpNu2RY
- **Explorer**: https://explorer.solana.com/address/B8ZrqDvtgQ2NuLn28m4FedbQE1ncSftUKJwDYWpNu2RY?cluster=devnet

---

## 🚀 Quick Start (3 Commands)

```bash
# 1. Create share token
spl-token create-token --decimals 0

# 2. Mint shares
spl-token create-account <YOUR_TOKEN_FROM_STEP_1>
spl-token mint <YOUR_TOKEN_FROM_STEP_1> 100

# 3. Distribute
spl-token transfer <YOUR_TOKEN_FROM_STEP_1> <AMOUNT> <RECIPIENT> --fund-recipient
```

Done! You've created fractional shares of your NFT! 🎉

---

**Need help?** Ask about specific scenarios!

