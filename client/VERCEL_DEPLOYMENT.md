# PayApprove - Vercel Deployment Guide

## Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository with the project
- Backend API deployed and accessible

## Step 1: Prepare Environment Variables

### Local Development
Create `.env.local` in the `Client` directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Production (Vercel)
You'll set this in Vercel dashboard.

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI
```bash
cd Client
npm install -g vercel
vercel
```

### Option B: Using GitHub Integration
1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Select your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Create React App
   - **Root Directory**: `Client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

## Step 3: Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: Your backend API URL (e.g., `https://your-api.herokuapp.com/api`)
   - **Environments**: Select `Production`, `Preview`, and `Development`

## Step 4: Configure Rewrites (Already in vercel.json)

The `vercel.json` file in the Client directory handles:
- SPA routing (all routes redirect to index.html)
- Environment variable mapping
- Build configuration

## Step 5: Verify Deployment

After deployment:
1. Visit your Vercel URL
2. Test role selection page loads
3. Try logging in with test credentials
4. Check browser console for API errors
5. Verify API calls go to correct backend URL

## Troubleshooting

### Issue: "Cannot GET /" or 404 on page refresh
**Solution**: Ensure `vercel.json` rewrites are configured correctly. The file is already set up.

### Issue: API calls failing (CORS errors)
**Solution**: 
1. Check backend API URL in Vercel environment variables
2. Ensure backend has CORS enabled for your Vercel domain
3. Update backend `.env` with correct `CLIENT_URL`

### Issue: Styles not loading
**Solution**:
1. Clear browser cache
2. Check that styled-components is in dependencies
3. Verify GlobalStyles.js is imported in App.jsx

### Issue: Fonts not loading
**Solution**:
1. Fonts are loaded from Google Fonts CDN in GlobalStyles.js
2. Check network tab for font requests
3. Ensure internet connection is available

### Issue: Environment variables not working
**Solution**:
1. Verify variable names start with `REACT_APP_`
2. Redeploy after adding environment variables
3. Check Vercel build logs for errors

## Backend Deployment

### For Heroku:
```bash
cd Server
heroku create your-app-name
git push heroku main
```

### For Railway/Render:
Follow their documentation for Node.js deployment.

### Environment Variables for Backend:
```
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-vercel-domain.vercel.app
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secure-jwt-secret
JWT_EXPIRES_IN=7d
DEFAULT_ADMIN_EMAIL=admin@paybuild.local
DEFAULT_ADMIN_PASSWORD=Admin@123
```

## Production Checklist

- [ ] Backend API deployed and accessible
- [ ] Environment variables set in Vercel
- [ ] CORS configured on backend for Vercel domain
- [ ] Database connection verified
- [ ] JWT secret is secure and unique
- [ ] Admin credentials changed from defaults
- [ ] API URL in Vercel matches backend deployment
- [ ] Test login with all roles
- [ ] Test payment request creation
- [ ] Verify database operations work
- [ ] Check browser console for errors
- [ ] Test on mobile devices

## Monitoring

1. **Vercel Analytics**: Check deployment logs and performance
2. **Backend Logs**: Monitor API errors and database operations
3. **Browser Console**: Check for client-side errors
4. **Network Tab**: Verify API calls and responses

## Rollback

If deployment fails:
1. Go to Vercel dashboard
2. Select your project
3. Go to **Deployments**
4. Click on a previous successful deployment
5. Click **Promote to Production**

## Support

For issues:
1. Check Vercel build logs
2. Check backend API logs
3. Check browser console and network tab
4. Verify environment variables are set correctly
5. Ensure backend is running and accessible
