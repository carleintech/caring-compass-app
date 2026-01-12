# 🔐 Master Account Credentials

## Quick Reference Card

### 👑 ADMIN ACCOUNT
```
Email:    admin@caringcompass.com
Password: CaringAdmin2025!
URL:      http://localhost:3000/login
```
**Access:** Full system control  
**Who:** Agency owner, system administrators

---

### 👥 COORDINATOR ACCOUNT
```
Email:    coordinator@caringcompass.com
Password: CaringCoord2025!
URL:      http://localhost:3000/login
```
**Access:** Operations & scheduling only  
**Who:** All office coordinators and staff

---

## ✅ Status

✓ Both accounts created in Supabase Auth  
✓ Profiles created in database  
✓ Passwords set and active  
✓ Ready to use immediately

## 🔄 To Reset or Update

```bash
pnpm --filter database seed:master
```

This will:
- Update passwords to match `.env` file
- Reset account status to active
- Preserve all existing data

## 📍 Direct Links

- **Login Page:** http://localhost:3000/login
- **Admin Dashboard:** http://localhost:3000/admin/dashboard
- **Coordinator Dashboard:** http://localhost:3000/coordinator/dashboard

---

**Note:** Keep these credentials secure. Share only with authorized staff members.
