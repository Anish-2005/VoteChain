import React, { useEffect } from 'react';
import { ThemeProvider } from './ThemeContext';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { onAuthChange, getUserRole, setUserRole, ADMIN_EMAIL, ensureAdminByEmail } from './firebase';
import AdminRoute from './components/AdminRoute';
import Home from './Home';
import VotingInterface from './VotingInterface';
import Results from './Results';
import Login from './Login';
import AdminPanel from './AdminPanel';

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthRedirectHandler />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vote" element={<VotingInterface />} />
          <Route path="/results" element={<Results />} />
          <Route
            path="/adminpanel"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
          <Route path="/login" element={<LoginRoute />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

// Wrapper component to handle navigation after login based on role
function LoginRoute() {
  const navigate = useNavigate();

  const handleLogin = (_user: any, role: 'user' | 'admin') => {
    if (role === 'admin') navigate('/adminpanel');
    else navigate('/');
  };

  return <Login onLogin={handleLogin} />;
}

function AuthRedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthChange(async (user) => {
      if (!user) return;

      // If a role was stored before redirect, apply and navigate
      const stored = localStorage.getItem('selectedRole');
      if (stored) {
        const role = stored === 'admin' ? 'admin' : 'user';
        try {
          await setUserRole(user.uid, role);
        } catch (e) {
          console.warn('Failed to set stored role', e);
        }
        localStorage.removeItem('selectedRole');
        if (role === 'admin') navigate('/adminpanel');
        else navigate('/');
        return;
      }

      // Otherwise check stored role in firestore and navigate accordingly
      try {
        const role = await getUserRole(user.uid);
        if (role === 'admin') navigate('/adminpanel');
        else navigate('/');
      } catch (e) {
        console.warn('Failed to get user role on redirect handler', e);
      }
    });

    return () => unsub();
  }, [navigate]);

  return null;
}

export default App;
