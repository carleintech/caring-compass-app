# Master Accounts Setup

## 📋 Quick Start

Run this command to create the two master accounts:

```bash
pnpm --filter database seed:master
```

## 🔐 Credentials

### Admin Master Account
- **Email:** `admin@caringcompass.com`
- **Password:** `CaringAdmin2025!`
- **Access:** Full system control
- **Who uses it:** Agency owner, system administrators

### Coordinator Master Account  
- **Email:** `coordinator@caringcompass.com`
- **Password:** `CaringCoord2025!`
- **Access:** Operations & scheduling only
- **Who uses it:** All office coordinators

## 🌐 Login

Both accounts log in at: `http://localhost:3000/login`

The system will automatically redirect to the appropriate dashboard based on role:
- Admin → `/admin/dashboard`
- Coordinator → `/coordinator/dashboard`

## 🛡️ Security Notes

- These accounts are **shared among staff** - not personal accounts
- All admin staff can use the admin login
- All coordinator staff can use the coordinator login
- Caregivers will have separate personal accounts (future feature)
- Passwords are stored in `.env` and Supabase Auth (encrypted)

## 🔧 Changing Passwords

1. Update credentials in `apps/web/.env`:
   ```env
   ADMIN_EMAIL=admin@caringcompass.com
   ADMIN_PASSWORD=YourNewPassword123!
   
   COORDINATOR_EMAIL=coordinator@caringcompass.com
   COORDINATOR_PASSWORD=YourNewPassword456!
   ```

2. Re-run the seed script:
   ```bash
   pnpm --filter database seed:master
   ```

## 📝 What the Script Does

1. **Checks if accounts exist** in Supabase Auth
2. **Creates new accounts** if they don't exist
3. **Updates passwords** if accounts already exist
4. **Creates user records** in Prisma database
5. **Creates coordinator profiles** with names and titles
6. **Confirms emails** automatically (no verification needed)

## ✅ Verification

After running the script, you should see:
- ✅ Both accounts created/updated in Supabase Auth
- ✅ Both user records in Prisma `users` table
- ✅ Both profiles in `coordinator_profiles` table
- ✅ Login works at `/login`
- ✅ Dashboards load correctly

## 🚀 Benefits of This Approach

✅ **Fast onboarding** - No need to create accounts for every staff member
✅ **Easy management** - Only 2 credentials to manage
✅ **Low friction** - Staff can start working immediately
✅ **Simple training** - Everyone uses the same login
✅ **Secure** - Role-based access control still enforced
✅ **Scalable** - Can add personal accounts later if needed

## 🔄 Re-running the Script

You can safely run the script multiple times:
- It won't create duplicate accounts
- It will update passwords to match `.env`
- It won't affect existing data

## 🐛 Troubleshooting

**Error: "Cannot find SUPABASE_SERVICE_KEY"**
- Make sure `apps/web/.env` has `SUPABASE_SERVICE_KEY` defined
- This key has admin privileges to create users

**Error: "Failed to create user in Supabase Auth"**
- Check Supabase project is running
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are correct
- Check Supabase Auth is enabled in your project

**Login fails after seeding**
- Verify accounts exist in Supabase Auth dashboard
- Check email and password match exactly
- Try logout and login again
- Check browser console for errors

## 📊 Database Schema

The script creates records in these tables:

```prisma
model users {
  id         String   @id @db.Uuid
  email      String   @unique
  role       UserRole  // ADMIN or COORDINATOR
  isActive   Boolean
  // ... other fields
}

model coordinator_profiles {
  id         String  @id @db.Uuid
  userId     String  @unique @db.Uuid
  firstName  String
  lastName   String
  title      String?
  department String?
  // ... other fields
}
```

Note: Admins use `coordinator_profiles` for name storage (not a separate admin_profiles table).
