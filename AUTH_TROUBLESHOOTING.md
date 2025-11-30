# Stack Auth Troubleshooting Guide

## Issue Identified

Based on the console logs, the main issue is that `app.urls.signIn` is **undefined**, which prevents the sign-in button from redirecting users to the authentication page.

## Root Causes (Most Likely to Least Likely)

### 1. **Stack Auth Dashboard Configuration Missing** ⭐ MOST LIKELY
The Stack Auth project needs to be properly configured in their dashboard.

#### Steps to Fix:
1. Go to [https://app.stack-auth.com](https://app.stack-auth.com)
2. Log in and select your project with ID: `837ab57c-98f2-4c53-880c-12ea476e6fc7`
3. Navigate to **Settings** or **Configuration**
4. Ensure the following are configured:
   - **Authentication Methods**: Enable at least one method (Email/Password, Magic Link, OAuth, etc.)
   - **Domains**: Add `http://localhost:5173` for development
   - **Redirect URLs**: Add allowed callback URLs
   - **Project Status**: Ensure it's not in "Setup" mode - should be "Development" or "Production"

### 2. **Environment Variables Had Quotes** ✅ FIXED
The `.env` file had quotes around the values which can cause issues in Vite.

**Before:**
```env
VITE_STACK_PROJECT_ID='837ab57c-98f2-4c53-880c-12ea476e6fc7'
```

**After (FIXED):**
```env
VITE_STACK_PROJECT_ID=837ab57c-98f2-4c53-880c-12ea476e6fc7
```

### 3. **Stack Auth Package Version**
Ensure you're using a compatible version of `@stackframe/react`.

#### Check Current Version:
```bash
npm list @stackframe/react
```

#### Update if Needed:
```bash
npm update @stackframe/react
```

### 4. **Browser Cache/LocalStorage Issues**
Old authentication tokens or cached data might be interfering.

#### Clear and Test:
1. Open Developer Tools (F12)
2. Go to Application > Storage
3. Click "Clear site data"
4. Reload the page

## Testing Steps

### Step 1: Check Environment Variables are Loading
```bash
# Restart dev server to reload .env
npm run dev
```

Then visit: `http://localhost:5173/?debug`

This will show you:
- ✅ All environment variables loaded correctly
- ✅ Stack app object structure
- ✅ Whether URLs are present

### Step 2: Verify Stack Auth Dashboard Configuration
1. Log into Stack Auth dashboard
2. Check Authentication Methods are enabled
3. Verify domain configuration includes your local dev URL
4. Ensure project is not in "incomplete setup" status

### Step 3: Test Sign-In Flow
Once the debug page shows that `app.urls.signIn` has a value:
1. Visit `http://localhost:5173` (without `?debug`)
2. Click "Sign In to Access"
3. You should be redirected to Stack Auth's hosted sign-in page

### Step 4: Verify Redirect Back
After signing in on Stack Auth's page:
1. You should be redirected back to `http://localhost:5173`
2. The app should recognize you're logged in
3. You should see the main tracker interface

## Common Issues and Solutions

### Issue: "Sign in URL is missing" alert
**Cause**: Stack Auth `urls` object is not populated
**Solution**: Complete Stack Auth dashboard configuration (see #1 above)

### Issue: Environment variables showing as `undefined`
**Cause**: Dev server not restarted after changing `.env`
**Solution**: Kill and restart `npm run dev`

### Issue: Redirect to sign-in page fails
**Cause**: Domain not whitelisted in Stack Auth
**Solution**: Add `http://localhost:5173` to allowed domains in Stack Auth dashboard

### Issue: Can sign in but immediately signed out
**Cause**: Token storage issues
**Solution**: Clear browser localStorage and try again

## Debug Mode

Access debug information at any time by visiting:
```
http://localhost:5173/?debug
```

This will show:
- Environment variable values
- Stack app object structure
- Current user state
- All loaded URLs

## Manual Override (If Stack Auth URLs Won't Load)

If Stack Auth's automatic URL generation isn't working, you can manually set them in `src/stack.js`:

```javascript
export const stack = new StackClientApp({
  projectId: import.meta.env.VITE_STACK_PROJECT_ID,
  publishableClientKey: import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY,
  urls: {
    signIn: 'https://YOUR_STACK_DOMAIN/signin', // Get this from Stack Auth dashboard
    signUp: 'https://YOUR_STACK_DOMAIN/signup',
    afterSignIn: '/',
    afterSignOut: '/',
  },
  // ... rest of config
});
```

## Expected Behavior

### Before Sign-In:
- User sees "Passionate Living" welcome screen
- "Sign In to Access" button is visible
- Debug info shows user: null

### After Sign-In:
- User is redirected back from Stack Auth
- Main tracker interface loads
- Debug info shows user object with email/ID

## Contact Stack Auth Support

If issues persist after trying all steps above:

1. Visit [Stack Auth Discord](https://discord.gg/stack-auth) or support
2. Provide:
   - Project ID: `837ab57c-98f2-4c53-880c-12ea476e6fc7`
   - Debug output from `http://localhost:5173/?debug`
   - Browser console screenshots

## Files Modified

- ✅ `.env` - Removed quotes from environment variables
- ✅ `src/stack.js` - Added debug logging and explicit `urls` config
- ✅ `src/AuthDebug.jsx` - Created debug component
- ✅ `src/App.jsx` - Added debug mode toggle

## Next Steps

1. **Restart your dev server** to load the fixed `.env` file
2. **Visit** `http://localhost:5173/?debug` to see current status
3. **Check** Stack Auth dashboard configuration
4. **Test** sign-in flow once `app.urls.signIn` shows a value
