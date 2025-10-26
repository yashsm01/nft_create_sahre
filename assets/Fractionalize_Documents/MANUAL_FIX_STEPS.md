# 🔧 Manual Fix for "Connection Refused" Error

## The Problem
PostgreSQL is only listening on `localhost` (127.0.0.1), not on your network interface (172.17.90.183).

---

## ✅ Solution - Run These Commands in Your WSL Terminal

### **Step 1: Edit postgresql.conf**

```bash
sudo nano /etc/postgresql/16/main/postgresql.conf
```

**Find this line** (around line 59):
```conf
#listen_addresses = 'localhost'
```

**Change it to:**
```conf
listen_addresses = '*'
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

---

### **Step 2: Edit pg_hba.conf**

```bash
sudo nano /etc/postgresql/16/main/pg_hba.conf
```

**Go to the end of the file** and add these lines:

```conf
# Allow connections from Windows (WSL network)
host    all             all             172.0.0.0/8            md5
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

---

### **Step 3: Restart PostgreSQL**

```bash
sudo service postgresql restart
```

---

### **Step 4: Verify It's Working**

```bash
# Check if PostgreSQL is listening on network
sudo netstat -tulpn | grep 5432
```

**You should see:**
```
tcp        0      0 0.0.0.0:5432            0.0.0.0:*               LISTEN
```

The important part is `0.0.0.0:5432` (not `127.0.0.1:5432`)

---

### **Step 5: Test Connection from WSL**

```bash
psql -h 172.17.90.183 -U postgres -d product_tracking
```

When prompted for password, enter: `postgres`

If it connects successfully, you'll see:
```
psql (16.x)
Type "help" for help.

product_tracking=#
```

Type `\q` to exit.

---

## 🌐 DBeaver Connection Settings

Once the above steps are complete, use these settings in DBeaver:

| Field | Value |
|-------|-------|
| **Host** | `172.17.90.183` |
| **Port** | `5432` |
| **Database** | `product_tracking` |
| **Username** | `postgres` |
| **Password** | `postgres` |

---

## 🆘 Still Not Working?

### Check PostgreSQL Logs:
```bash
sudo tail -50 /var/log/postgresql/postgresql-16-main.log
```

### Check PostgreSQL Status:
```bash
sudo service postgresql status
```

### Check Current Configuration:
```bash
# Should show: listen_addresses = '*'
sudo grep "listen_addresses" /etc/postgresql/16/main/postgresql.conf | grep -v "^#"

# Should show the host entry for 172.0.0.0/8
sudo grep "^host" /etc/postgresql/16/main/pg_hba.conf
```

---

## 🔥 Windows Firewall (if still blocked)

If you still can't connect after the above steps, you may need to allow PostgreSQL in Windows Firewall:

### Option 1: Quick Allow (PowerShell as Administrator)
```powershell
New-NetFirewallRule -DisplayName "PostgreSQL WSL" -Direction Inbound -Protocol TCP -LocalPort 5432 -Action Allow
```

### Option 2: GUI Method
1. Open **Windows Defender Firewall with Advanced Security**
2. Click **Inbound Rules** → **New Rule**
3. Select **Port** → Click **Next**
4. Select **TCP**, enter **5432** → Click **Next**
5. Select **Allow the connection** → Click **Next**
6. Select all profiles → Click **Next**
7. Name it "PostgreSQL WSL" → Click **Finish**

---

## ✅ Success Indicators

You know it's working when:
1. ✅ `netstat` shows `0.0.0.0:5432` (not `127.0.0.1:5432`)
2. ✅ `psql -h 172.17.90.183` connects successfully
3. ✅ DBeaver test connection succeeds
4. ✅ You can see your 5 database tables in DBeaver

---

**Good luck!** 🚀


