# Vercel Deployment Troubleshooting Guide

## Issue: Pushes to GitHub not triggering Vercel deployments

### Step 1: Verify GitHub Webhook
1. Go to your GitHub repository: `https://github.com/Carpentersbug41/cg2365-electrical-quiz`
2. Navigate to: **Settings** → **Webhooks**
3. Look for a webhook pointing to `vercel.com`
4. If missing:
   - Go to Vercel Dashboard → Your Project → Settings → Git
   - Disconnect the repository
   - Reconnect it (this will recreate the webhook)

### Step 2: Check Vercel GitHub App Permissions
1. On GitHub: **Settings** → **Installed GitHub Apps** → **Vercel**
2. Ensure it's installed for:
   - **All repositories** OR
   - Specifically for `cg2365-electrical-quiz`
3. If not installed, install it and grant access to your repository

### Step 3: Verify Commit Author Email
Your current git config:
- Name: `carpentersbug`
- Email: `carpentersbug41@gmail.com`

**Action Required:**
- Ensure `carpentersbug41@gmail.com` is the email associated with your GitHub account
- Ensure this same email is connected to your Vercel account
- If different, update git config:
  ```bash
  git config user.email "your-github-email@example.com"
  ```
- Then amend the last commit and force push:
  ```bash
  git commit --amend --reset-author --no-edit
  git push --force-with-lease
  ```

### Step 4: Check Vercel Project Settings
1. Go to Vercel Dashboard → Your Project → **Settings** → **Git**
2. Verify:
   - **Production Branch**: Should be `main`
   - **Root Directory**: Should be `quiz-app` (since your Next.js app is in that folder)
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: `.next` (or leave default)

### Step 5: Manual Deployment Test
Try triggering a manual deployment:
1. Vercel Dashboard → Your Project → **Deployments**
2. Click **Redeploy** on the latest deployment
3. If manual deploy works but auto-deploy doesn't, it's a webhook/authorization issue

### Step 6: Check Recent Deployments
1. Vercel Dashboard → Your Project → **Deployments**
2. Look for any failed deployments or error messages
3. Check if there are any pending approvals required

### Step 7: Verify Repository Connection
1. Vercel Dashboard → Your Project → **Settings** → **Git**
2. Confirm the repository shows: `Carpentersbug41/cg2365-electrical-quiz`
3. If incorrect, disconnect and reconnect

### Step 8: Check Build Logs
1. Vercel Dashboard → Your Project → **Deployments**
2. Click on the latest deployment
3. Check **Build Logs** for any errors that might prevent deployment

## Quick Fix: Force a New Deployment

If all else fails, you can manually trigger a deployment:

```bash
cd quiz-app
npx vercel --prod
```

Or create an empty commit to trigger webhook:
```bash
git commit --allow-empty -m "Trigger Vercel deployment"
git push
```

## Still Not Working?

If none of the above works:
1. Check Vercel status page: https://www.vercel-status.com/
2. Review Vercel documentation: https://vercel.com/docs/deployments/overview
3. Contact Vercel support with:
   - Repository URL
   - Project name
   - Recent commit SHA
   - Screenshot of webhook settings

---

## Adding Environment Variables (API Keys)

Your application requires Google Gemini API keys to function. Here's how to add them to Vercel:

### Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey) or [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new API key for Google Gemini
3. Copy the API key (it will look like: `AIzaSy...`)

### Step 2: Add Environment Variables in Vercel

1. **Go to Vercel Dashboard**
   - Navigate to: https://vercel.com/dashboard
   - Select your project: `cg2365-electrical-quiz`

2. **Open Settings**
   - Click on **Settings** tab
   - Click on **Environment Variables** in the left sidebar

3. **Add Required Variables**

   **Required:**
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Your Google Gemini API key (e.g., `AIzaSy...`)
   - **Environment:** Select all (Production, Preview, Development)
   - Click **Save**

   **Optional (but recommended):**
   - **Name:** `GEMINI_MODEL`
   - **Value:** `gemini-3-flash-preview` (or your preferred model)
   - **Environment:** Select all
   - Click **Save**

   - **Name:** `GEMINI_FALLBACK_MODEL`
   - **Value:** `gemini-2.5-flash` (fallback if primary model fails)
   - **Environment:** Select all
   - Click **Save**

### Step 3: Redeploy Your Application

After adding environment variables:

1. **Option A: Redeploy from Dashboard**
   - Go to **Deployments** tab
   - Click **⋯** (three dots) on the latest deployment
   - Click **Redeploy**
   - ✅ Environment variables will be included

2. **Option B: Trigger New Deployment**
   - Make a small change and push to GitHub
   - Or create an empty commit:
     ```bash
     git commit --allow-empty -m "Trigger deployment with env vars"
     git push
     ```

### Step 4: Verify Environment Variables Are Set

After deployment, check the build logs:

1. Go to **Deployments** → Latest deployment → **Build Logs**
2. Look for:
   ```
   GEMINI_MODEL from env: gemini-3-flash-preview
   GEMINI_API_KEY present: true
   ```
3. If you see `GEMINI_API_KEY present: false`, the variable wasn't set correctly

### Troubleshooting Environment Variables

**Problem: Variables not showing up in build**
- ✅ Make sure you selected all environments (Production, Preview, Development)
- ✅ Redeploy after adding variables (they don't apply to existing deployments)
- ✅ Check for typos in variable names (case-sensitive!)

**Problem: API calls failing**
- ✅ Verify your API key is valid and has quota remaining
- ✅ Check Google Cloud Console for API key restrictions
- ✅ Ensure the model name matches a valid Gemini model

**Problem: Variables work locally but not on Vercel**
- ✅ Local `.env.local` file doesn't sync to Vercel
- ✅ You must add variables in Vercel dashboard
- ✅ `.env.local` is gitignored (as it should be!)

### Environment Variable Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | - | Google Gemini API key |
| `GEMINI_MODEL` | ❌ No | `gemini-1.5-flash` | Primary model to use |
| `GEMINI_FALLBACK_MODEL` | ❌ No | `gemini-2.5-flash` | Fallback model if primary fails |

### Security Best Practices

1. **Never commit API keys to Git**
   - ✅ `.env.local` is already in `.gitignore`
   - ✅ Only add keys in Vercel dashboard

2. **Use different keys for different environments** (optional)
   - Production: Production environment only
   - Preview: Preview environment only
   - Development: Development environment only

3. **Rotate keys periodically**
   - If a key is exposed, regenerate it immediately
   - Update in Vercel dashboard
   - Redeploy application
