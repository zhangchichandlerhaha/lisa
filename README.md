# LISA Crazy Eights

A high-performance, interactive Crazy Eights card game built with React, Tailwind CSS, and Framer Motion.

## 🚀 Deployment to Vercel

To deploy this project to Vercel, follow these steps:

### 1. Push to GitHub
1. Create a new repository on [GitHub](https://github.com/new).
2. Initialize your local directory as a git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Connect to your GitHub repository:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### 2. Deploy to Vercel
1. Go to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** and select **"Project"**.
3. Import your GitHub repository.
4. **Environment Variables**:
   - Add `GEMINI_API_KEY` with your Google AI API Key.
5. Click **"Deploy"**.

Vercel will automatically detect the Vite configuration and build the project.

## 🛠 Tech Stack
- **Framework**: React 19
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion (motion/react)
- **Icons**: Lucide React
- **Build Tool**: Vite
