# ✅ Fix: Set Environment Variables in Vercel Dashboard

## The Problem
The `vercel.json` file was trying to reference a secret that doesn't exist. Environment variables should NOT be defined in `vercel.json` - they should be set directly in the Vercel dashboard.

## The Solution

### Step 1: Go to Vercel Dashboard
1. Visit https://vercel.com
2. Log in to your account
3. Select your PayApprove project

### Step 2: Navigate to Environment Variables
1. Click on **Settings** (top menu)
2. Click on **Environment Variables** (left sidebar)

### Step 3: Add the Environment Variable
1. Click **Add New** button
2. Fill in the fields:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: Your backend API URL (e.g., `https://your-api.herokuapp.com/api`)
   - **Environments**: Select all three:
     - ✅ Production
     - ✅ Preview
     - ✅ Development

### Step 4: Save and Redeploy
1. Click **Save** button
2. Go to **Deployments** tab
3. Click **Redeploy** on the latest deployment
4. Wait for build to complete

### Step 5: Verify
1. Visit your Vercel URL
2. Open browser console (F12)
3. Check Network tab for API calls
4. Verify API URL is correct

---

## What Your Backend API URL Should Be

### If using Heroku:
```
https://your-app-name.herokuapp.com/api
```

### If using Railway:
```
https://your-railway-domain.up.railway.app/api
```

### If using Render:
```
https://your-app-name.onrender.com/api
```

### If using local (for testing only):
```
http://localhost:5000/api
```

---

## Correct vercel.json (Updated)

Your `vercel.json` now looks like this:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Note**: No `env` section - environment variables are set in Vercel dashboard only.

---

## Complete Deployment Checklist

### Before Redeploying
- [ ] Backend is deployed and accessible
- [ ] Backend API URL is correct
- [ ] Backend has CORS enabled for your Vercel domain
- [ ] Database connection is working

### In Vercel Dashboard
- [ ] Go to Settings → Environment Variables
- [ ] Add `REACT_APP_API_URL` with your backend URL
- [ ] Select all three environments (Production, Preview, Development)
- [ ] Click Save

### Redeploy
- [ ] Go to Deployments tab
- [ ] Click Redeploy on latest deployment
- [ ] Wait for build to complete (should say "Ready")
- [ ] No errors in build logs

### Test
- [ ] Visit Vercel URL
- [ ] App loads without errors
- [ ] Can login with admin@paybuild.local / Admin@123
- [ ] Dashboard displays correctly
- [ ] API calls work (check Network tab)
- [ ] No console errors

---

## Troubleshooting

### Still Getting Error?
1. Clear Vercel cache:
   - Go to Settings → Git
   - Click "Disconnect Git"
   - Reconnect Git
   - Redeploy

2. Check environment variable:
   - Go to Settings → Environment Variables
   - Verify `REACT_APP_API_URL` is set
   - Verify value is correct (no typos)
   - Verify all environments are selected

3. Check build logs:
   - Go to Deployments
   - Click on failed deployment
   - Scroll down to see build logs
   - Look for error messages

### API Calls Still Failing?
1. Verify backend is running
2. Check backend CORS settings
3. Verify backend URL is correct
4. Check Network tab in browser (F12)
5. Look at actual API URL being called

---

## Environment Variables Reference

### Frontend (Vercel Dashboard)
```
Name: REACT_APP_API_URL
Value: https://your-backend-api.com/api
Environments: Production, Preview, Development
```

### Backend (.env file)
```
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-vercel-domain.vercel.app
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secure-secret
JWT_EXPIRES_IN=7d
DEFAULT_ADMIN_EMAIL=admin@paybuild.local
DEFAULT_ADMIN_PASSWORD=Admin@123
```

---

## Quick Reference

| What | Where | How |
|------|-------|-----|
| Set Frontend Env Vars | Vercel Dashboard | Settings → Environment Variables |
| Set Backend Env Vars | Backend .env file | Edit .env file directly |
| Redeploy Frontend | Vercel Dashboard | Deployments → Redeploy |
| Redeploy Backend | Backend Platform | Depends on platform (Heroku/Railway/Render) |

---

## Success Indicators

✅ **Deployment is successful when:**
1. No "references Secret" error
2. Build completes successfully
3. App loads at Vercel URL
4. Can login successfully
5. API calls go to correct backend
6. No console errors

---

## Next Steps

1. ✅ Update `vercel.json` (already done)
2. ✅ Commit changes: `git add . && git commit -m "Fix vercel.json"`
3. ✅ Push to GitHub: `git push origin main`
4. ✅ Go to Vercel dashboard
5. ✅ Add environment variable `REACT_APP_API_URL`
6. ✅ Redeploy
7. ✅ Test

---

**Status**: ✅ Fixed
**Action Required**: Set environment variable in Vercel dashboard
**Time to Fix**: 2 minutes
