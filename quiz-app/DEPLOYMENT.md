# Deployment Guide for Vercel

This guide will walk you through deploying your Health & Safety 2365 Electrical Quiz to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Git installed on your computer
- Your code in a Git repository (GitHub, GitLab, or Bitbucket)

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push to Git Repository

If you haven't already, initialize a Git repository and push to GitHub:

```bash
cd quiz-app
git init
git add .
git commit -m "Initial commit - Health & Safety Quiz"
git branch -M main
git remote add origin https://github.com/yourusername/hs-quiz.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your repository from the list
5. If it's not showing, click **"Add GitHub Account"** and authorize Vercel

### Step 3: Configure Project

Vercel will automatically detect that this is a Next.js project. You should see:

- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` or `quiz-app` (adjust if needed)
- **Build Command**: `next build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 1-2 minutes)
3. Once complete, you'll get a URL like: `https://your-project-name.vercel.app`
4. Click the URL to view your live quiz!

### Step 5: Custom Domain (Optional)

1. In your Vercel project dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Follow the DNS configuration instructions
4. Your quiz will be available at your custom domain!

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### Step 3: Deploy

Navigate to your quiz-app directory and run:

```bash
cd quiz-app
vercel
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Select your account
- **Link to existing project**: No
- **Project name**: hs-quiz (or your preferred name)
- **Directory**: ./ (current directory)

### Step 4: Production Deployment

For production deployment:

```bash
vercel --prod
```

## Method 3: Deploy from Local Directory (No Git)

If you don't want to use Git:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to quiz-app directory:
```bash
cd quiz-app
```

3. Run:
```bash
vercel
```

4. Follow the prompts
5. Your site will be deployed!

## Post-Deployment

### Automatic Deployments

If you used Method 1 (Git integration):
- Every push to your `main` branch will automatically trigger a new deployment
- Pull requests will get preview deployments
- You can view deployment history in the Vercel dashboard

### Environment Variables

If you need to add environment variables:

1. Go to your project in Vercel dashboard
2. Click **Settings** → **Environment Variables**
3. Add your variables
4. Redeploy for changes to take effect

### Analytics (Optional)

Enable Vercel Analytics to track visitor data:

1. Go to your project dashboard
2. Click **Analytics** tab
3. Click **Enable**

## Troubleshooting

### Build Fails

**Error: "Module not found"**
- Make sure all dependencies are in `package.json`
- Run `npm install` locally to verify
- Check that all import paths use `@/` prefix correctly

**Error: "Build exceeded maximum duration"**
- This shouldn't happen with this small app
- Check for infinite loops or large files

### Site Not Loading

- Check the build logs in Vercel dashboard
- Verify all environment variables are set
- Check browser console for errors

### Wrong Directory

If Vercel is building the wrong directory:
1. Go to **Settings** → **General**
2. Set **Root Directory** to `quiz-app`
3. Save and redeploy

## Performance Optimization

Your quiz is already optimized, but here are some tips:

1. **Enable Edge Functions** (automatic on Vercel)
2. **Use CDN** (automatic on Vercel)
3. **Enable Compression** (automatic on Vercel)

## Monitoring

Monitor your deployment:

1. **Real-time Logs**: View in Vercel dashboard
2. **Performance**: Check Core Web Vitals
3. **Errors**: Monitor error rates

## Updating Your Quiz

To update your quiz after deployment:

### If using Git integration:
```bash
# Make your changes
git add .
git commit -m "Update questions"
git push
```

Vercel will automatically deploy your changes!

### If using CLI:
```bash
# Make your changes
vercel --prod
```

## Cost

- **Free tier includes**:
  - Unlimited deployments
  - 100GB bandwidth per month
  - Automatic HTTPS
  - Global CDN
  - Preview deployments

This quiz app will easily run on the free tier!

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)
- [Next.js Documentation](https://nextjs.org/docs)

---

**That's it!** Your quiz is now live and accessible worldwide. Share the URL with your students and colleagues!

Example URLs:
- Production: `https://hs-quiz.vercel.app`
- Custom: `https://yourname.com`
- Preview: `https://hs-quiz-git-branch-name.vercel.app`

