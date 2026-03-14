# ⚡ QUICK FIX: Render Deployment Error

## The Problem
```
Error: Cannot find module '/opt/render/project/src/server/server.js'
```

Render is looking in the wrong directory. The `render.yaml` file isn't being used.

---

## The Solution (3 Steps - 15 minutes)

### STEP 1: Delete Old Service (2 minutes)

1. Go to https://render.com
2. Click on `pay-build-api` service
3. Click **Settings** (bottom)
4. Scroll to **Danger Zone**
5. Click **Delete Web Service**
6. Confirm

### STEP 2: Create New Service (5 minutes)

1. Go to https://render.com
2. Click **New +**
3. Select **Web Service**
4. Click **Connect** next to your repo
5. Select `Pay-Approve` repository

**Fill in**:
```
Name: pay-build-api
Environment: Node
Branch: main
Build Command: cd Server && npm install
Start Command: cd Server && npm start
```

### STEP 3: Add Environment Variables (3 minutes)

Click "Add Environment Variable" for each:

```
NODE_ENV = production
PORT = 5000
MONGODB_URI = your-mongodb-uri
JWT_SECRET = your-secret-key
JWT_EXPIRES_IN = 7d
DEFAULT_ADMIN_NAME = System Admin
DEFAULT_ADMIN_EMAIL = admin@paybuild.local
DEFAULT_ADMIN_PASSWORD = Admin@123
CLIENT_URL = https://your-vercel-domain.vercel.app
```

### STEP 4: Deploy (5 minutes)

1. Click **Create Web Service**
2. Wait for deployment
3. Check logs for "Server listening on port 5000"
4. Copy the URL when done

---

## STEP 5: Update Vercel (2 minutes)

1. Go to https://vercel.com
2. Select PayApprove project
3. Settings → Environment Variables
4. Update `REACT_APP_API_URL`:
   - **Value**: `https://pay-build-api.onrender.com/api`
   - (Replace with your Render URL)
5. Click Save
6. Go to Deployments → Redeploy

---

## Test (2 minutes)

1. Visit your Vercel URL
2. App should load
3. Login: `admin@paybuild.local` / `Admin@123`
4. Dashboard should display
5. ✅ Success!

---

## Key Points

✅ **Build Command**: `cd Server && npm install`
✅ **Start Command**: `cd Server && npm start`
✅ These commands tell Render to go into Server directory first
✅ All environment variables must be set

---

## Troubleshooting

### Still Getting Module Not Found
- [ ] Build Command is: `cd Server && npm install`
- [ ] Start Command is: `cd Server && npm start`
- [ ] Delete and recreate service
- [ ] Check logs for errors

### Build Fails
- [ ] Check build logs
- [ ] Verify MONGODB_URI is correct
- [ ] Verify all env vars are set
- [ ] Check Server/package.json exists

### Can't Login
- [ ] Verify backend is running
- [ ] Check Render logs
- [ ] Verify MONGODB_URI is correct
- [ ] Verify JWT_SECRET is set

---

## Timeline

```
Delete service:    2 min
Create service:    5 min
Add env vars:      3 min
Deploy:            5 min
Update Vercel:     2 min
─────────────────────────
Total:            ~17 minutes
```

---

## Success Checklist

- [ ] Deleted old Render service
- [ ] Created new Render service
- [ ] Set Build Command: `cd Server && npm install`
- [ ] Set Start Command: `cd Server && npm start`
- [ ] Added all environment variables
- [ ] Deployment shows "Live"
- [ ] Logs show "Server listening on port 5000"
- [ ] Updated Vercel REACT_APP_API_URL
- [ ] Redeployed Vercel
- [ ] App loads without errors
- [ ] Can login

---

## Documentation

For detailed information, see:
- `RENDER_MANUAL_SETUP.md` - Complete setup guide

---

**Status**: ✅ Ready to Deploy
**Time Required**: ~17 minutes
**Difficulty**: Easy ⭐
**Next Action**: Delete old Render service
