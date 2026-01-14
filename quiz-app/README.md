# Health & Safety 2365 Electrical Quiz

A comprehensive multiple-choice quiz application with 50 questions covering health and safety topics for the 2365 electrical qualification. Built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- ⚡ **50 Comprehensive Questions** - Covering all major health and safety topics for 2365 electrical
- 🤖 **AI Chat Assistant** - Get help understanding questions and concepts with Google Gemini AI
- 🎯 **Interactive UI** - Beautiful, modern interface with smooth transitions
- 📊 **Progress Tracking** - Visual progress bar and question counter
- 🔍 **Review Mode** - Review all answers with correct/incorrect indicators
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Clean design with Tailwind CSS
- ⏱️ **No Time Pressure** - Take your time to answer each question
- 🔄 **Restart Functionality** - Retake the quiz as many times as you want

## Quiz Topics Covered

- Basic Electrical Safety
- Safety Equipment & PPE
- Protection Devices (RCD, RCBO, AFDD, MCB)
- Installation Requirements
- Wiring Standards & Color Codes
- Electrical Standards & Regulations (BS 7671)
- Testing & Inspection (EICR)
- Bonding & Earthing Systems
- Fire Safety
- Emergency Procedures
- Safe Isolation
- Working at Height
- Special Locations (Bathrooms, etc.)
- Cable Sizing & Standards
- Legal Requirements
- And much more!

## Getting Started

### Prerequisites

- Node.js 18+ installed on your system
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd quiz-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Chat Assistant Setup (Optional)

The quiz includes an AI-powered chat assistant to help students understand questions and concepts. To enable this feature:

1. **Get a Gemini API Key:**
   - **Important:** This is different from a general Google Cloud API key
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey) (not Google Cloud Console)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy your API key (it will start with `AIza...`)

2. **Configure the API Key:**
   - Rename `env.txt` to `.env.local` in the quiz-app directory
   - Open `.env.local` and replace `your_gemini_api_key_here` with your actual API key
   - Save the file

3. **Restart the development server** if it's already running

**Note:** The chat assistant will gracefully degrade if no API key is configured. The quiz will work normally, but the chat feature won't be available.

#### Chat Assistant Features:
- 🎓 Educational tutor specialized in 2365 Electrical Installation
- 💬 3 queries per question to help you understand concepts
- 🔄 Fresh context for each question
- 📱 Responsive design (sidebar on desktop, modal on mobile)
- 🚫 Rate limiting to prevent abuse

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to the quiz-app directory:
```bash
cd quiz-app
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts to deploy your application

### Option 2: Deploy via Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Go to [vercel.com](https://vercel.com) and sign in

3. Click "Add New Project"

4. Import your repository

5. Vercel will automatically detect it's a Next.js project

6. Click "Deploy"

Your quiz will be live in seconds! Vercel will provide you with a URL like `your-quiz.vercel.app`

### Option 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/your-repo)

## Project Structure

```
quiz-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Main page
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   └── Quiz.tsx         # Main quiz component
│   └── data/
│       └── questions.ts     # All 50 quiz questions
├── public/                  # Static assets
├── package.json            # Dependencies
└── README.md              # This file
```

## Customization

### Adding More Questions

Edit `src/data/questions.ts` and add new questions following this format:

```typescript
{
  id: 51,
  question: "Your question here?",
  options: ["Option A", "Option B", "Option C", "Option D"],
  correctAnswer: 0, // Index of correct answer (0-3)
  category: "Category Name"
}
```

### Changing Colors

The quiz uses Tailwind CSS. You can customize colors by editing the className properties in `src/components/Quiz.tsx`.

Primary colors used:
- Indigo: Primary brand color
- Green: Correct answers
- Red: Incorrect answers
- Gray: Neutral elements

## Technologies Used

- **Next.js 15** - React framework for production
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **Vercel** - Deployment platform

## Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please contact the maintainer or open an issue in the repository.

---

**Note**: This quiz is designed for educational purposes to help students prepare for the 2365 electrical qualification. Always refer to the latest BS 7671 regulations and official course materials for the most up-to-date information.
