# 📸 Visual Guide: Set Environment Variables in Vercel

## The Error You Got
```
Environment Variable "REACT_APP_API_URL" references Secret "react_app_api_url", 
which does not exist.
```

## Why This Happened
The `vercel.json` file was trying to use a secret reference that doesn't exist. This is now fixed.

---

## Step-by-Step Visual Guide

### Step 1: Go to Vercel Dashboard
```
https://vercel.com
    ↓
[Log In]
    ↓
Select "PayApprove" Project
```

**What you'll see:**
- Your project name at the top
- Tabs: Overview, Deployments, Settings, etc.

---

### Step 2: Click Settings Tab
```
┌─────────────────────────────────────────┐
│  PayApprove                             │
├─────────────────────────────────────────┤
│ Overview | Deployments | Settings ← CLICK HERE
└─────────────────────────────────────────┘
```

---

### Step 3: Click Environment Variables
```
Left Sidebar:
├─ General
├─ Git
├─ Environment Variables ← CLICK HERE
├─ Domains
├─ Functions
└─ ...
```

---

### Step 4: Click "Add New" Button
```
┌─────────────────────────────────────────┐
│ Environment Variables                   │
├─────────────────────────────────────────┤
│ [Add New] ← CLICK HERE                  │
│                                         │
│ No environment variables yet            │
└─────────────────────────────────────────┘
```

---

### Step 5: Fill in the Form

```
┌─────────────────────────────────────────┐
│ Add Environment Variable                │
├─────────────────────────────────────────┤
│                                         │
│ Name: [REACT_APP_API_URL]               │
│       ↑ Type this exactly               │
│                                         │
│ Value: [https://your-api.herokuapp.com/api]
│        ↑ Your backend API URL           │
│                                         │
│ Environments:                           │
│ ☑ Production                            │
│ ☑ Preview                               │
│ ☑ Development                           │
│ (All three should be checked)           │
│                                         │
│ [Save] ← CLICK WHEN DONE                │
└─────────────────────────────────────────┘
```

---

### Step 6: Verify It's Saved
```
┌─────────────────────────────────────────┐
│ Environment Variables                   │
├─────────────────────────────────────────┤
│ Name: REACT_APP_API_URL                 │
│ Value: https://your-api.herokuapp.com/api
│ Environments: Production, Preview, Dev  │
│                                         │
│ [Edit] [Delete]                         │
└─────────────────────────────────────────┘
```

---

### Step 7: Go to Deployments Tab
```
┌─────────────────────────────────────────┐
│  PayApprove                             │
├─────────────────────────────────────────┤
│ Overview | Deployments ← CLICK HERE | Settings
└─────────────────────────────────────────┘
```

---

### Step 8: Click Redeploy
```
┌─────────────────────────────────────────┐
│ Deployments                             │
├─────────────────────────────────────────┤
│ Latest Deployment:                      │
│ ├─ Status: Ready                        │
│ ├─ Time: 2 minutes ago                  │
│ └─ [Redeploy] ← CLICK HERE              │
│                                         │
│ Previous Deployments:                   │
│ ├─ ...                                  │
│ └─ ...                                  │
└─────────────────────────────────────────┘
```

---

### Step 9: Wait for Build
```
Building...
├─ Installing dependencies... ✓
├─ Building application... ✓
├─ Optimizing... ✓
└─ Ready! ✓

Status: Ready
```

---

### Step 10: Test Your App
```
1. Click "Visit" button
   ↓
2. App loads at https://your-domain.vercel.app
   ↓
3. Role selection page appears
   ↓
4. Click on Admin role
   ↓
5. Login page appears
   ↓
6. Enter: admin@paybuild.local / Admin@123
   ↓
7. Dashboard loads
   ↓
✅ SUCCESS!
```

---

## What Your Backend API URL Should Look Like

### Heroku Example
```
https://my-paybuild-api.herokuapp.com/api
                    ↑
            Your app name on Heroku
```

### Railway Example
```
https://my-paybuild-api.up.railway.app/api
                    ↑
            Your Railway domain
```

### Render Example
```
https://my-paybuild-api.onrender.com/api
                    ↑
            Your Render service name
```

### Local Testing (Don't use in production)
```
http://localhost:5000/api
```

---

## Verification Checklist

### In Vercel Dashboard
- [ ] Settings → Environment Variables
- [ ] `REACT_APP_API_URL` is listed
- [ ] Value is your backend API URL
- [ ] All three environments checked (Production, Preview, Development)

### After Redeploy
- [ ] Build completed successfully
- [ ] Status shows "Ready"
- [ ] No error messages in build logs

### Testing the App
- [ ] Visit Vercel URL
- [ ] App loads without errors
- [ ] Can login
- [ ] Dashboard displays
- [ ] No console errors (F12)

---

## Common Mistakes to Avoid

### ❌ Wrong Name
```
REACT_APP_api_url  ← WRONG (lowercase)
REACT_APP_API_URL  ← CORRECT (uppercase)
```

### ❌ Wrong Value
```
http://localhost:5000/api  ← WRONG (localhost won't work)
https://my-api.herokuapp.com/api  ← CORRECT
```

### ❌ Missing /api
```
https://my-api.herokuapp.com  ← WRONG (missing /api)
https://my-api.herokuapp.com/api  ← CORRECT
```

### ❌ Not Selecting All Environments
```
Only Production checked  ← WRONG
All three checked  ← CORRECT
```

---

## If It Still Doesn't Work

### Check 1: Verify Environment Variable
1. Go to Settings → Environment Variables
2. Confirm `REACT_APP_API_URL` exists
3. Confirm value is correct
4. Confirm all environments are selected

### Check 2: Check Build Logs
1. Go to Deployments
2. Click on the deployment
3. Scroll down to see build logs
4. Look for error messages

### Check 3: Test Backend
1. Visit your backend API URL directly
2. Should see API response (not 404)
3. Example: `https://my-api.herokuapp.com/api/health`

### Check 4: Check Browser Console
1. Open your Vercel app
2. Press F12 to open developer tools
3. Go to Console tab
4. Look for error messages
5. Go to Network tab
6. Look for failed API requests

---

## Success Indicators

✅ **Everything is working when:**
1. No "references Secret" error
2. Build completes with "Ready" status
3. App loads at Vercel URL
4. Can login with admin credentials
5. Dashboard displays correctly
6. API calls show correct backend URL in Network tab
7. No red errors in console

---

## Quick Reference

| Step | Action | Where |
|------|--------|-------|
| 1 | Go to Vercel | https://vercel.com |
| 2 | Select project | Dashboard |
| 3 | Click Settings | Top menu |
| 4 | Click Env Vars | Left sidebar |
| 5 | Add new | Click "Add New" |
| 6 | Fill form | Name & Value |
| 7 | Save | Click "Save" |
| 8 | Redeploy | Deployments tab |
| 9 | Wait | Build completes |
| 10 | Test | Visit URL |

---

## Time Required
- Setting environment variable: **1 minute**
- Redeploy: **2-3 minutes**
- Testing: **2 minutes**
- **Total: ~5 minutes**

---

## Next Steps

1. ✅ Commit the fixed `vercel.json`:
   ```bash
   git add Client/vercel.json
   git commit -m "Fix vercel.json - remove incorrect secret reference"
   git push origin main
   ```

2. ✅ Go to Vercel dashboard

3. ✅ Add environment variable:
   - Name: `REACT_APP_API_URL`
   - Value: Your backend API URL
   - Environments: All three

4. ✅ Redeploy

5. ✅ Test

---

**Status**: ✅ Ready to Deploy
**Action Required**: Set environment variable in Vercel dashboard
**Time to Complete**: 5 minutes
