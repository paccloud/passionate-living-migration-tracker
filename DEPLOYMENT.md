# Deploying to Vercel

## Quick Deploy

1. **One-Click Deploy:**

   Click this button: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/paccloud/passionate-living-migration-tracker)

   OR run this command:

   ```bash
   vercel --prod
   ```

2. **Set Environment Variables** in the Vercel dashboard:

   - Go to your project → Settings → Environment Variables
   - Add: `DATABASE_URL` = Your Neon connection string

3. **That's it!** Your app is now live with full database integration.

## Manual Deployment Steps

### Option 1: Vercel CLI (Recommended)

```bash
# Make sure you're in the project directory
cd "/Users/ryanhorwath/Dev/Client Progress/Passionate Living Website Migration App"

# Deploy to production
vercel --prod

# When prompted, add the DATABASE_URL environment variable
```

### Option 2: GitHub Integration

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository: `paccloud/passionate-living-migration-tracker`
4. Vercel will auto-detect Vite settings
5. Add `DATABASE_URL` environment variable during setup
6. Click "Deploy"

## Vercel Will Automatically:

- ✅ Detect it's a Vite project
- ✅ Use `npm run build` as build command
- ✅ Use `dist` as output directory
- ✅ Set up serverless functions from `/api` folder
- ✅ Enable automatic deployments on Git push

## After Deployment

- Your app will be live at: `https://your-project-name.vercel.app`
- Every push to the `LLMs` branch will auto-deploy
- API routes will work at: `https://your-project-name.vercel.app/api/*`

## Testing the Deployed App

Once deployed, the app will:

- Load data from your Neon database
- Save all changes to the database
- Work for multiple users simultaneously

The yellow "development mode" message will disappear!

## Troubleshooting

**If you see errors:**

1. Check Vercel logs: `vercel logs`
2. Verify `DATABASE_URL` is set correctly
3. Make sure your Neon database is accessible

**Need to redeploy:**

```bash
git push origin LLMs
```

Vercel will automatically deploy the latest changes.
