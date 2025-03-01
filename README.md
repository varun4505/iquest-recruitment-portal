# iQuest Recruitment Portal

A web application for managing recruitment processes, built with React, TypeScript, Firebase, and Tailwind CSS.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14.0.0 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Git](https://git-scm.com/)

## Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/varun4505/iquest-recruitment.git
cd iquest-recruitment
```

2. **Install dependencies**

First, remove any existing node_modules and package-lock.json if they exist:
```bash
rm -rf node_modules package-lock.json
```

Then install all required dependencies:

```bash
# Install React and core dependencies
npm install react react-dom react-scripts typescript @types/react @types/react-dom @types/node

# Install routing and navigation
npm install react-router-dom @types/react-router-dom

# Install Firebase
npm install firebase

# Install UI components and icons
npm install @heroicons/react react-spinners

# Install utility libraries
npm install react-hot-toast xlsx

# Install development dependencies
npm install -D tailwindcss postcss autoprefixer @types/jest @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Initialize Tailwind CSS
npx tailwindcss init -p
```

3. **Firebase Setup**
- Create a new project in [Firebase Console](https://console.firebase.google.com/)
- Enable Authentication (Google Sign-in)
- Enable Realtime Database
- Get your Firebase configuration

4. **Environment Setup**
Create a `.env` file in the root directory and add your Firebase configuration:
```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_DATABASE_URL=your-database-url
```

5. **Update package.json**
Make sure your package.json has these scripts:
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

6. **Configure Tailwind CSS**
Update your `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-in': 'slideIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
```

7. **Add base CSS**
Create or update `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply bg-primary-600 text-white hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800;
  }

  .card {
    @apply bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700;
  }

  .card-hover {
    @apply transition-all duration-300 hover:shadow-xl hover:-translate-y-1;
  }

  .section {
    @apply py-16 px-4;
  }

  .container {
    @apply max-w-7xl mx-auto px-4;
  }
}
```

8. **Firebase Database Rules**
Set up your Firebase Realtime Database rules:
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
      ".write": "auth != null && root.child('users').child(auth.uid).child('email').val() === 'varun452005@gmail.com'"
    },
    "responses": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "notices": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('users').child(auth.uid).child('email').val() === 'varun452005@gmail.com'"
    },
    "events": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('users').child(auth.uid).child('email').val() === 'varun452005@gmail.com'"
    }
  }
}
```

9. **Start the Development Server**
```bash
npm start
```
The application will start running at `http://localhost:3000`

## Project Structure 