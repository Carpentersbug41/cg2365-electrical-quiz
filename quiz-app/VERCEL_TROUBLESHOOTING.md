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
