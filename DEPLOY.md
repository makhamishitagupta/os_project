# Deployment Guide - Render

## Prerequisites

- GitHub account with your repository pushed
- Render account (https://render.com)
- Supabase project URL and anon key

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Create Render Account

- Go to https://render.com
- Sign up with GitHub (recommended for easy integration)

### 3. Create New Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure as follows:
   - **Name**: `vehicle-verification` (or your preferred name)
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free (or Starter for better performance)

### 4. Add Environment Variables

In the "Environment" section, add:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
NODE_ENV=production
```

To find your Supabase credentials:

1. Go to your Supabase Project Settings
2. Copy the Project URL
3. Copy the anon public key (under API keys)

### 5. Deploy

- Click "Create Web Service"
- Render will automatically build and deploy
- Your site will be live at `https://your-service-name.onrender.com`

### 6. Enable Auto-Deploy (Optional)

- In Render dashboard, go to Settings → Deploy Hook
- Every push to your GitHub `main` branch will automatically redeploy

## Troubleshooting

### Build Fails

- Check "Logs" tab in Render dashboard
- Ensure all dependencies are in `package.json`
- Run `npm run build` locally to test

### Blank Page / Routing Issues

- The `server.js` serves `index.html` for all routes (SPA routing)
- Check browser DevTools Console for errors
- Verify Supabase environment variables are set correctly

### Environment Variables Not Working

- Ensure `VITE_` prefix is used for frontend variables
- Environment variables are baked during build time
- After changing env vars, trigger a new deploy

## Cost

- **Free Tier**:
  - 750 compute hours/month
  - Auto-spins down after 15 min of inactivity
  - Sufficient for development/testing

- **Starter Plan** ($7/month):
  - Always-on service
  - Better for production
  - Can scale easily

## Next Steps

- Set up custom domain (optional)
- Configure Database backups in Supabase
- Set up monitoring and alerts
