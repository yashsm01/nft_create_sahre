# Programmatic Share Distribution Guide

## 🎯 Overview

You now have **two ways** to distribute shares:
1. **CLI Method** - Manual, one at a time
2. **Programmatic Method** - Automated, multiple recipients

---

## 🚀 Quick Start

### Run the Script

```bash
npm run distribute:program
```

That's it! The script will distribute shares to all recipients defined in the code.

---

## 📝 How to Customize

### Step 1: Edit the Distribution List

Open `src/scripts/distribute-shares-programmatic.ts` and find this section:

```typescript
const distributions: ShareDistribution[] = [
  {
    recipient: "7Shg2Wm3nSiEG13FuVJnNmgZM3Tj57KGDSkMJFc1omFM",
    amount: 5,
    description: "First recipient - 5%",
  },
  // Add more recipients here
];
```

### Step 2: Add More Recipients

```typescript
const distributions: ShareDistribution[] = [
  {
    recipient: "7Shg2Wm3nSiEG13FuVJnNmgZM3Tj57KGDSkMJFc1omFM",
    amount: 10,
    description: "Alice - Co-founder (10%)",
  },
  {
    recipient: "5fNfvyp5czQVX77yoACa3JJVEhdRaWjPuazuWgjhTqEX",
    amount: 15,
    description: "Bob - Lead Developer (15%)",
  },
  {
    recipient: "DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK",
    amount: 20,
    description: "Carol - Designer (20%)",
  },
  // Add as many as you need!
];
```

### Step 3: Run the Script

```bash
npm run distribute:program
```

The script will:
1. ✅ Validate all addresses
2. ✅ Check your balance
3. ✅ Send to each recipient
4. ✅ Show success/failure for each
5. ✅ Display transaction links

---

## 🆚 CLI vs Programmatic

### CLI Method (Manual)

**Good for:**
- Quick one-off transfers
- Simple distributions
- Testing

**How to use:**
```bash
spl-token transfer <TOKEN> <AMOUNT> <WALLET> --fund-recipient --url devnet
```

**Example:**
```bash
spl-token transfer 5VWBGCtochHAJ993YbLVBwg8dp3hqpPPs31Whjr99M5H 10 7Shg2Wm3nSiEG13FuVJnNmgZM3Tj57KGDSkMJFc1omFM --fund-recipient --url devnet
```

---

### Programmatic Method (Automated)

**Good for:**
- Multiple recipients
- Automated distributions
- Repeatable processes
- Integration with other systems
- Batch operations

**How to use:**
```bash
npm run distribute:program
```

**Benefits:**
- ✅ Send to many people at once
- ✅ Automatic error handling
- ✅ Detailed logging
- ✅ Transaction tracking
- ✅ Can be scheduled/automated

---

## 📊 Real-World Examples

### Example 1: Team Distribution

```typescript
const distributions: ShareDistribution[] = [
  {
    recipient: "FounderWalletAddress",
    amount: 40,
    description: "Founder - 40%",
  },
  {
    recipient: "CTOWalletAddress",
    amount: 20,
    description: "CTO - 20%",
  },
  {
    recipient: "DesignerWalletAddress",
    amount: 20,
    description: "Designer - 20%",
  },
  {
    recipient: "MarketingWalletAddress",
    amount: 20,
    description: "Marketing - 20%",
  },
];
```

### Example 2: Investor Distribution

```typescript
const distributions: ShareDistribution[] = [
  {
    recipient: "Investor1Address",
    amount: 15,
    description: "Angel Investor 1 - 15%",
  },
  {
    recipient: "Investor2Address",
    amount: 10,
    description: "Angel Investor 2 - 10%",
  },
  {
    recipient: "Investor3Address",
    amount: 5,
    description: "Angel Investor 3 - 5%",
  },
];
```

### Example 3: Community Airdrop

```typescript
const distributions: ShareDistribution[] = [
  {
    recipient: "CommunityMember1",
    amount: 1,
    description: "Community Member #1",
  },
  {
    recipient: "CommunityMember2",
    amount: 1,
    description: "Community Member #2",
  },
  {
    recipient: "CommunityMember3",
    amount: 1,
    description: "Community Member #3",
  },
  // ... up to 50 members with 1 share each
];
```

---

## 🔧 Technical Details

### What The Script Does

1. **Loads Environment**
   - Gets share token address from `.env`
   - Connects to Solana network
   - Loads your keypair

2. **Validates Distribution**
   - Checks all recipient addresses
   - Verifies you have enough shares
   - Calculates total distribution

3. **Processes Each Recipient**
   ```typescript
   For each recipient:
     1. Get/Create their token account
     2. Transfer shares
     3. Log success/failure
     4. Save transaction signature
   ```

4. **Reports Results**
   - Summary of successful/failed transfers
   - Transaction links for each
   - Updated balances

---

## 📋 Output Example

```
============================================================

🚀 Starting Programmatic Share Distribution

============================================================

📋 Distribution Plan:
   Share Token: 5VWBGCtochHAJ993YbLVBwg8dp3hqpPPs31Whjr99M5H
   Recipients: 3
   Total Shares to Distribute: 45

📤 Recipients:
   1. Alice... → 10 shares (Co-founder)
   2. Bob... → 15 shares (Developer)
   3. Carol... → 20 shares (Designer)

============================================================

📤 [1/3] Distributing to Alice...
   ✅ Success!
   → Signature: ABC123...

📤 [2/3] Distributing to Bob...
   ✅ Success!
   → Signature: DEF456...

📤 [3/3] Distributing to Carol...
   ✅ Success!
   → Signature: GHI789...

============================================================

✅ Distribution complete!

📊 Distribution Summary:
   Total Recipients: 3
   Successful: 3
   Failed: 0
   Total Shares Distributed: 45
```

---

## ⚙️ Configuration

### Environment Variables Required

Create/update `.env`:

```env
# Required
SHARE_TOKEN_MINT=5VWBGCtochHAJ993YbLVBwg8dp3hqpPPs31Whjr99M5H
SOLANA_CLUSTER=devnet
```

### Edit Distribution

File: `src/scripts/distribute-shares-programmatic.ts`

Line: ~40 (look for `const distributions`)

---

## 🚨 Error Handling

The script handles errors gracefully:

### Common Errors

**"SHARE_TOKEN_MINT not set"**
→ Add `SHARE_TOKEN_MINT` to your `.env` file

**"Invalid recipient address"**
→ Check the wallet address format

**"Insufficient balance"**
→ You don't have enough shares to distribute

**"Account not found"**
→ The script will auto-create the recipient's token account

---

## 🔐 Security Notes

### Best Practices

1. ✅ **Test on devnet first**
2. ✅ **Verify all recipient addresses**
3. ✅ **Double-check amounts**
4. ✅ **Keep your keypair secure**
5. ✅ **Review the distribution list before running**

### For Production

```typescript
// Always verify addresses
const distributions = [
  {
    recipient: "VERIFY_THIS_ADDRESS_IS_CORRECT",
    amount: 1000,  // Double-check amounts!
    description: "Important transfer",
  },
];
```

---

## 📈 Advanced Usage

### Batch Processing

```typescript
// Read from CSV or database
import { readFileSync } from 'fs';

const csvData = readFileSync('recipients.csv', 'utf-8');
const distributions = csvData.split('\n').map(line => {
  const [address, amount, description] = line.split(',');
  return { recipient: address, amount: parseInt(amount), description };
});
```

### Conditional Distribution

```typescript
const distributions = allRecipients
  .filter(r => r.eligible === true)
  .map(r => ({
    recipient: r.address,
    amount: calculateAmount(r.contribution),
    description: r.name,
  }));
```

---

## 📊 Your Current Status

### Successful Distributions

✅ **CLI Transfer**: 10 shares to 7Shg2W...omFM  
✅ **Programmatic Transfer**: 5 shares to 7Shg2W...omFM

**Total**: 15 shares distributed (15%)  
**Remaining**: 85 shares (85%)

---

## 🎯 Next Steps

1. **Edit the distribution list** in `distribute-shares-programmatic.ts`
2. **Add your recipients** with amounts
3. **Run**: `npm run distribute:program`
4. **Verify** on Solana Explorer
5. **Repeat** as needed!

---

## 💡 Tips

### Tip 1: Start Small
Test with 1-2 shares first to make sure everything works.

### Tip 2: Keep Records
Save the output to a file:
```bash
npm run distribute:program > distribution-log.txt
```

### Tip 3: Verify on Explorer
Check each transaction link to confirm success.

### Tip 4: Check Balances
```bash
spl-token balance <SHARE_TOKEN> --url devnet
```

---

## 🆘 Need Help?

### Check These Files

- **Script**: `src/scripts/distribute-shares-programmatic.ts`
- **Environment**: `.env`
- **Package**: `package.json` (scripts section)

### Common Commands

```bash
# Run distribution
npm run distribute:program

# Check your balance
spl-token balance 5VWBGCtochHAJ993YbLVBwg8dp3hqpPPs31Whjr99M5H --url devnet

# View all your tokens
spl-token accounts --url devnet
```

---

**Happy Distributing! 🚀**

You now have a complete, automated share distribution system!

