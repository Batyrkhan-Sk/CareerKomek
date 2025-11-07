# CareerKomek

## Overview

CareerKomek is a web application designed to assist users in their career development journey. The platform provides intelligent resume analysis, personalized career recommendations, interactive quizzes to assess career readiness, and internship opportunities.

## Deployed Application

**Link:** https://careerbot-3b56a.web.app

**Note:** If the quiz generation fails, please retry the generation.

## Presentation

**Link:** https://www.canva.com/design/DAG357-SWWU/-4klACsVoaLr1ftDITQfXw/edit?utm_content=DAG357-SWWU&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

## Architecture

### Frontend Structure

The application follows a modular component-based architecture using React with Vite as the build tool.
```
frontend/
├── src/
│   ├── assets/              # Static assets (images, icons)
│   ├── common/              # Shared components
│   │   ├── loader/          # Loading indicators
│   │   └── navbar/          # Navigation component
│   ├── components/          # Feature-specific components
│   │   ├── auth/            # Authentication components
│   │   │   ├── Auth.jsx
│   │   │   ├── AuthForm.jsx
│   │   │   ├── GoogleLoginButton.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── home/            # Landing page components
│   │   ├── internships/     # Internship listings
│   │   ├── modal/           # Modal dialogs
│   │   ├── quiz/            # Career assessment quiz
│   │   │   └── steps/       # Multi-step quiz flow
│   │   ├── recommendations/ # Career recommendations
│   │   └── resume/          # Resume upload and analysis
│   ├── const/               # Constants and configuration
│   │   ├── careerFacts.js
│   │   ├── initialProfile.js
│   │   └── quizSteps.js
│   ├── hooks/               # Custom React hooks
│   │   └── useQuizState.js
│   ├── pdf/                 # PDF processing utilities
│   │   └── pdfWorker.js
│   ├── services/            # API and external services
│   │   └── quizService.js
│   ├── utils/               # Helper functions
│   │   └── textHelpers.js
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Application entry point
│   └── firebase.js          # Firebase configuration
├── functions/               # Firebase Cloud Functions
│   ├── analyzeResume.js     # Resume analysis AI function
│   ├── generateQuiz.js      # Quiz generation function
│   └── generateRecommendations.js  # Recommendations AI function
└── public/                  # Public static files
```

### Backend Infrastructure

**Firebase Services:**

- **Authentication:** Handles user registration, login, and session management with Google OAuth integration
- **Cloud Functions:** Serverless functions for AI-powered features
  - Resume analysis and skill extraction
  - Dynamic quiz generation based on user profile
  - Personalized career recommendations
- **Firestore:** NoSQL database for storing user profiles, quiz responses, and application data
- **Hosting:** Static file hosting and deployment

## Technology Stack

### Frontend

- **Framework:** React
- **Build Tool:** Vite
- **Styling:** CSS Modules
- **State Management:** React Hooks (useState, useEffect, custom hooks)
- **Routing:** React Router
- **PDF Processing:** PDF.js
- **Icons:** Lucide React

### Backend

- **Platform:** Firebase
- **Functions:** Node.js Cloud Functions
- **Database:** Cloud Firestore
- **Authentication:** Firebase Auth
- **Hosting:** Firebase Hosting

## Usage

1. **Sign Up/Login:** Create an account or login with Google
2. **Upload Resume:** Upload your resume for AI analysis
3. **Take Assessment:** Complete the career assessment quiz
4. **Get Recommendations:** Receive personalized career guidance
5. **Explore Internships:** Browse and apply to relevant opportunities
