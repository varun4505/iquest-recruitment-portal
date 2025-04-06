import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DomainSelection from './pages/DomainSelection';
import Questionnaire from './pages/Questionnaire';
import AdminPanel from './pages/AdminPanel';
import Members from './pages/Members';
import MatrixBackground from './components/MatrixBackground';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        {/* Loading Screen */}
        <LoadingScreen />
        <div className="min-h-screen bg-terminal-bg">
          {/* Matrix raining code animation in the background */}
          <MatrixBackground />
          
          {/* Terminal scan line effect */}
          <div className="scan-line"></div>
          
          <Navbar />
          <main className="container mx-auto px-4 pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/members" element={<Members />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/domain-selection"
                element={
                  <PrivateRoute>
                    <DomainSelection />
                  </PrivateRoute>
                }
              />
              <Route
                path="/questionnaire"
                element={
                  <PrivateRoute>
                    <Questionnaire />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <AdminPanel />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#101410',
              color: '#92d992',
              border: '1px solid #00a000',
              fontFamily: "'JetBrains Mono', 'Source Code Pro', monospace",
            },
            success: {
              iconTheme: {
                primary: '#00ee00',
                secondary: '#101410',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#101410',
              },
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
