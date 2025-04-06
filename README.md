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

3. **Start the Development Server**
```bash
npm start
```
The application will start running at `http://localhost:3000`
