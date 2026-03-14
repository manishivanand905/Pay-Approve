# ✅ CORRECT FIX: Use Lowercase Folder Names

## The Issue
Your folders are **lowercase**:
- ✅ `server/` (not `Server/`)
- ✅ `client/` (not `Client/`)

But the instructions were using uppercase names.

---

## Correct Render Configuration

### Step 1: Go to Render Settings

1. Go to https://render.com
2. Click on `pay-build-api` service
3. Click **Settings** (bottom of page)

### Step 2: Set Root Directory to `server` (lowercase)

1. Find **Root Directory** field
2. Type: `server` (lowercase!)
3. Click **Save**

### Step 3: Verify Build & Start Commands

Make sure these are set:
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Step 4: Redeploy

1. Go to **Events** tab
2. Click **Redeploy**
3. Wait for deployment (5-10 minutes)
4. Check logs for:
   - ✅ "Build successful"
   - ✅ "Server listening on port 5000"
   - ✅ "MongoDB connected"

---

## Correct Vercel Configuration

### Root Directory for Vercel

When you set up Vercel, use: `client` (lowercase)

**Settings**:
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `build`

---

## Correct Environment Variables

### Render (Backend)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-secret
JWT_EXPIRES_IN=7d
DEFAULT_ADMIN_EMAIL=admin@paybuild.local
DEFAULT_ADMIN_PASSWORD=Admin@123
CLIENT_URL=https://your-vercel-domain.vercel.app
```

### Vercel (Frontend)
```
REACT_APP_API_URL=https://your-render-backend.onrender.com/api
```

---

## Correct File Paths

| Component | Folder | Path |
|-----------|--------|------|
| Backend | `server/` | `server/src/server.js` |
| Frontend | `client/` | `client/src/App.jsx` |
| Backend Config | `server/` | `server/package.json` |
| Frontend Config | `client/` | `client/package.json` |

---

## Quick Summary

### For Render
- **Root Directory**: `server` (lowercase)
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### For Vercel
- **Root Directory**: `client` (lowercase)
- **Build Command**: `npm run build`
- **Output Directory**: `build`

---

## Verification

### Render Logs Should Show
```
✅ Build successful
✅ Server listening on port 5000
✅ MongoDB connected
```

### Vercel Logs Should Show
```
✅ Build Completed
✅ Deployment completed
```

---

## Next Steps

1. ✅ Go to Render dashboard
2. ✅ Click `pay-build-api` service
3. ✅ Click Settings
4. ✅ Set Root Directory to: `server` (lowercase!)
5. ✅ Click Save
6. ✅ Redeploy
7. ✅ Wait for deployment
8. ✅ Check logs

---

**Status**: ✅ Ready to Deploy
**Time Required**: ~15 minutes
**Difficulty**: Easy ⭐
**Next Action**: Set Root Directory to `server` (lowercase)
