# ⚡ QUICK FIX: Render Root Directory Issue

## The Problem
```
Error: Cannot find module '/opt/render/project/src/server/server.js'
```

Render is looking in the wrong directory because **Root Directory is not set to `Server`**.

---

## The Fix (2 Steps - 15 minutes)

### STEP 1: Set Root Directory in Render (1 minute)

1. Go to https://render.com
2. Click on `pay-build-api` service
3. Click **Settings** (bottom of page)
4. Find **Root Directory** field
5. Type: `Server`
6. Click **Save**

### STEP 2: Redeploy (10 minutes)

1. Go to **Events** tab
2. Click **Redeploy** on latest deployment
3. Wait for deployment to complete
4. Check logs for:
   - ✅ "Build successful"
   - ✅ "Server listening on port 5000"
   - ✅ "MongoDB connected"

---

## Why This Works

When Root Directory is set to `Server`:
- ✅ Render changes to `Server/` directory
- ✅ Finds `Server/package.json`
- ✅ Runs `npm install` from `Server/`
- ✅ Runs `npm start` which executes `node src/server.js`
- ✅ Server starts correctly

---

## Verify It Works

1. Check Render logs
2. Look for "Server listening on port 5000"
3. Look for "MongoDB connected"
4. No "Cannot find module" errors

---

## If Still Not Working

**Delete and Recreate Service**:
1. Go to Render
2. Click `pay-build-api`
3. Settings → Danger Zone → Delete Web Service
4. Create new service
5. Make sure to set Root Directory to `Server` during creation

---

## Vercel Deprecation Warning (Optional)

The warning is harmless but can be fixed:

```bash
cd Client
npm install react-scripts@latest
git add .
git commit -m "Update react-scripts"
git push origin main
```

---

## Timeline

```
Set Root Directory:  1 min
Redeploy:           10 min
Verify:              2 min
─────────────────────────
Total:             ~13 minutes
```

---

## Success Checklist

- [ ] Went to Render dashboard
- [ ] Clicked `pay-build-api` service
- [ ] Clicked Settings
- [ ] Set Root Directory to `Server`
- [ ] Clicked Save
- [ ] Clicked Redeploy
- [ ] Waited for deployment
- [ ] Checked logs for success
- [ ] No "Cannot find module" errors
- [ ] Logs show "Server listening on port 5000"

---

**Status**: ✅ Ready to Fix
**Time Required**: ~15 minutes
**Difficulty**: Easy ⭐
**Next Action**: Go to Render and set Root Directory to `Server`
