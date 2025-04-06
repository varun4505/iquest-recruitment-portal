# iQuest Recruitment Portal

A modern web application for managing recruitment processes, built with React 19, TypeScript, Firebase, Vite, and Tailwind CSS.

## Features

- User authentication and role-based access
- Interactive dashboard for candidates and administrators
- Domain-specific questionnaires
- Real-time countdown timers
- Admin panel for managing the recruitment process
- Matrix and terminal-inspired UI elements

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.0.0 or higher)
- [npm](https://www.npmjs.com/) (v8.0.0 or higher)
- [Git](https://git-scm.com/)

## Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/iquest-portal.git
cd iquest-portal
```

2. **Install dependencies**
```bash
npm install
```

3. **Firebase Setup**
- Create a new project in [Firebase Console](https://console.firebase.google.com/)
- Enable Authentication (Google Sign-in)
- Enable Realtime Database
- Get your Firebase configuration

4. **Environment Setup**
Create a `.env` file in the root directory and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_DATABASE_URL=your-database-url
```

5. **Start the development server**
```bash
npm run dev
```
The application will start running at `http://localhost:5173`

6. **Build for production**
```bash
npm run build
```

## Project Structure

```
iquest-portal/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images, SVGs, and other assets
│   ├── components/     # Reusable UI components
│   │   ├── AOSInitializer.tsx
│   │   ├── CountdownTimer.tsx
│   │   ├── CTASection.tsx
│   │   ├── MatrixBackground.tsx
│   │   ├── TerminalBackground.tsx
│   │   └── ...
│   ├── config/         # Configuration files
│   │   └── firebase.ts # Firebase configuration
│   ├── contexts/       # React Context providers
│   │   └── AuthContext.tsx
│   ├── pages/          # Application pages
│   │   ├── AdminPanel.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Questionnaire.tsx
│   │   └── ...
│   ├── types/          # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/          # Utility functions
│   │   └── setupPublicTimers.js
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Application entry point
│   └── ...
├── vite.config.ts      # Vite configuration
├── tailwind.config.cjs # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── ...
```

## Technologies Used

- **Frontend Framework**: React 19
- **Build Tool**: Vite 6
- **Language**: TypeScript 5.7
- **CSS Framework**: Tailwind CSS 3.3
- **Backend/Database**: Firebase 11
- **Routing**: React Router 7
- **State Management**: Redux Toolkit
- **Animations**: AOS, Framer Motion
- **UI Components**: Headless UI
- **Icons**: Heroicons

## Firebase Database Rules

The application uses the following database rules structure:

```json
{
  "rules": {
    ".read": "auth != null",
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    "timers": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('users').child(auth.uid).child('isAdmin').val() === true"
    },
    "responses": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "notices": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('users').child(auth.uid).child('isAdmin').val() === true"
    },
    "events": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('users').child(auth.uid).child('isAdmin').val() === true"
    }
  }
}
```

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- React team for the amazing framework
- Firebase for the backend services
- Tailwind CSS for the utility-first CSS framework
- All contributors who have helped shape this project

---

Last Updated: April 6, 2025