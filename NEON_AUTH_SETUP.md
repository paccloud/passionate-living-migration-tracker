# Neon Auth Setup Guide

## ✅ What's Been Fixed

Your app is now properly configured for **Neon Auth** (2025). The previous issue was that we were using generic Stack Auth configuration instead of Neon's specific implementation.

### Changes Made:

1. **Updated `src/stack.js`**: Changed to use `cookie` tokenStore (recommended by Neon)
2. **Updated `src/main.jsx`**: Added `StackHandler` and `StackTheme` components (required for Neon Auth)
3. **Updated `src/MigrationTracker.jsx`**: Changed sign-in to use `/handler/sign-in` route
4. **Fixed `.env`**: Removed quotes from environment variables

## 🔑 Getting Your Neon Auth Keys

Since you're using **Vercel + Neon**, you have two options:

### Option 1: Automatic (Recommended for Vercel Users)

If you're using the [Vercel-Neon Integration](https://neon.com/docs/guides/vercel):

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Integrations**
3. Find or add the **Neon** integration
4. Connect your Neon database
5. **The environment variables will be automatically added to Vercel!**

### Option 2: Manual Setup

1. Go to [https://console.neon.tech](https://console.neon.tech)
2. Select your project
3. Click **"Auth"** in the sidebar
4. Click the **"Configuration"** tab
5. Select **"React (Vite)"** from the framework dropdown
6. Copy the environment variables shown:
   ```env
   VITE_STACK_PROJECT_ID=your_actual_project_id
   VITE_STACK_PUBLISHABLE_CLIENT_KEY=your_actual_publishable_key
   STACK_SECRET_SERVER_KEY=your_actual_secret_key
   DATABASE_URL=your_neon_database_url
   ```
7. Paste these into your `.env` file (for local development)
8. Add them to Vercel environment variables (for production)

## 📋 Current Environment Variables in `.env`

Your current `.env` file has:
```env
VITE_STACK_PROJECT_ID=837ab57c-98f2-4c53-880c-12ea476e6fc7
VITE_STACK_PUBLISHABLE_CLIENT_KEY=pck_yy4mcfyd4tqtw71ampwgaxdkk30kns180qcj2gbjywy60
STACK_SECRET_SERVER_KEY=ssk_adp1djetjhnxry3mea3vdfw318gv8f4ea6g4hhyrh7t0r
DATABASE_URL=postgresql://neondb_owner:npg_kXWAGdj6tns3@ep-orange-wave-ae2g3aec-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**⚠️ Important**: Verify these match what's in your Neon Console → Auth → Configuration page!

## 🚀 How Neon Auth Works

Neon Auth uses the **StackHandler** component to automatically handle authentication routes:

- `/handler/sign-in` - Sign in page
- `/handler/sign-up` - Sign up page
- `/handler/forgot-password` - Password reset
- `/handler/email-verification` - Email verification

When a user clicks "Sign In to Access", they're redirected to `/handler/sign-in`, which is rendered by the `<StackHandler />` component you now have in `main.jsx`.

## 🧪 Testing the Setup

### Step 1: Restart Dev Server

Kill any running dev servers and start fresh:

```bash
# Stop all running servers (Ctrl+C if running in terminal)
# Then restart:
npm run dev
```

### Step 2: Check Console Logs

Open your browser console and look for:
```
=== NEON AUTH INITIALIZATION ===
Project ID from env: 837ab57c-98f2-4c53-880c-12ea476e6fc7
Client Key from env: pck_yy4mcfyd4tqtw71ampwgaxdkk30kns180qcj2gbjywy60
✅ Neon Auth client created
Stack URLs: { ... }
```

### Step 3: Test Sign-In Flow

1. Visit `http://localhost:5174/`
2. You should see the "Passionate Living" welcome screen
3. Click **"Sign In to Access"**
4. You should be redirected to `/handler/sign-in` with Neon Auth's sign-in UI
5. Create an account or sign in
6. You should be redirected back to `/` and see the migration tracker

### Step 4: Test Sign-Up

You can also directly visit:
- `http://localhost:5174/handler/sign-up` to create a new account
- The first user you create will be able to access the tracker

## 🌐 Deploying to Vercel

### If Using Vercel-Neon Integration (Recommended):

1. Push your code to Git
2. Deploy to Vercel
3. The environment variables will be automatically set by the Neon integration
4. Your app should work immediately!

### Manual Vercel Setup:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - `VITE_STACK_PROJECT_ID`
   - `VITE_STACK_PUBLISHABLE_CLIENT_KEY`
   - `STACK_SECRET_SERVER_KEY`
   - `DATABASE_URL`
4. Redeploy your app

**⚠️ Important**: For Vite apps, environment variables starting with `VITE_` are exposed to the client-side code. Variables without `VITE_` prefix (like `STACK_SECRET_SERVER_KEY`) are only available server-side.

## 🔒 Security Notes

- ✅ `.env` is in `.gitignore` (don't commit it!)
- ✅ Only `VITE_STACK_PROJECT_ID` and `VITE_STACK_PUBLISHABLE_CLIENT_KEY` are exposed to the browser
- ✅ `STACK_SECRET_SERVER_KEY` stays server-side only
- ✅ Using `cookie` tokenStore for better security

## 🐛 Troubleshooting

### Issue: "Missing Neon Auth environment variables" Error

**Cause**: Environment variables not loaded
**Solution**:
1. Restart your dev server: `npm run dev`
2. Verify `.env` file exists and has correct values
3. Ensure no quotes around values in `.env`

### Issue: Sign-in page not showing

**Cause**: `StackHandler` not rendering properly
**Solution**: Check browser console for errors and ensure `@stackframe/react` is installed correctly

### Issue: After signing in, immediately logged out

**Cause**: Token storage or cookie issues
**Solution**:
1. Clear browser cookies and localStorage
2. Ensure `tokenStore: 'cookie'` is set in `stack.js`
3. Check browser console for errors

### Issue: Can't access `/handler/sign-in`

**Cause**: `StackHandler` component not rendering
**Solution**: Verify `src/main.jsx` has `<StackHandler fullPage />` inside `<StackProvider>`

## 📚 Resources

- [Neon Auth React Quickstart](https://neon.com/docs/neon-auth/quick-start/react)
- [Neon Console](https://console.neon.tech)
- [Vercel-Neon Integration](https://neon.com/docs/guides/vercel)
- [StackClientApp API Reference](https://neon.com/docs/neon-auth/sdk/react/objects/stack-app)

## ✅ Checklist

Before considering Neon Auth "working":

- [ ] Environment variables in `.env` match Neon Console
- [ ] Dev server restarted after changing `.env`
- [ ] Console shows "✅ Neon Auth client created"
- [ ] Visiting `/handler/sign-in` shows sign-in UI
- [ ] Can create account and sign in
- [ ] After sign-in, redirected back to main app
- [ ] User info appears in browser console logs
- [ ] If deployed to Vercel, environment variables are set there too

## 🎉 Expected Final Behavior

### Before Sign-In:
- Shows "Passionate Living" welcome screen
- "Sign In to Access" button visible
- Clicking button redirects to `/handler/sign-in`

### At `/handler/sign-in`:
- Neon Auth's beautiful sign-in UI appears
- Can switch between sign-in and sign-up
- Email/password fields work

### After Sign-In:
- Redirected back to `/`
- Migration tracker interface loads
- Console shows user info
- "Sign Out" button works in header

---

**Need Help?**

1. Check browser console for errors
2. Visit Neon Auth documentation
3. Verify environment variables in Neon Console
4. If on Vercel, check deployment logs
