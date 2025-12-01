# Quick Start Guide

Get your Health & Safety 2365 Electrical Quiz running in 3 minutes!

## Local Development

### 1. Install Dependencies

```bash
cd quiz-app
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

### 3. Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

That's it! 🎉

## Deploy to Vercel (Production)

### Fastest Method - Vercel CLI

```bash
# Install Vercel CLI globally (one-time)
npm install -g vercel

# Deploy
cd quiz-app
vercel

# For production
vercel --prod
```

You'll get a live URL in seconds!

### Alternative - Vercel Dashboard

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Click "Deploy"

## Project Structure

```
quiz-app/
├── src/
│   ├── app/
│   │   └── page.tsx          # Main entry point
│   ├── components/
│   │   └── Quiz.tsx          # Quiz component
│   └── data/
│       └── questions.ts      # 50 quiz questions
└── package.json
```

## Key Features

- ✅ 50 comprehensive questions
- ✅ Progress tracking
- ✅ Review mode
- ✅ Responsive design
- ✅ Beautiful UI
- ✅ TypeScript
- ✅ Zero configuration needed

## Customization

### Change Questions

Edit `src/data/questions.ts`:

```typescript
{
  id: 1,
  question: "Your question?",
  options: ["A", "B", "C", "D"],
  correctAnswer: 0, // Index 0-3
  category: "Category"
}
```

### Change Colors

Edit `src/components/Quiz.tsx` - look for Tailwind classes like:
- `bg-indigo-600` (primary)
- `bg-green-500` (correct)
- `bg-red-500` (incorrect)

## Scripts

```bash
npm run dev    # Development server
npm run build  # Build for production
npm start      # Run production build
npm run lint   # Check for errors
```

## Troubleshooting

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
```

**Dependencies not installing?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build errors?**
```bash
npm run lint
```

## Need Help?

See [README.md](./README.md) for detailed documentation
See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guide

---

**Happy Quizzing!** 🎓⚡

