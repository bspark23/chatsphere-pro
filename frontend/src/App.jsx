import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import PhoneVerification from './pages/PhoneVerification';
import Chat from './pages/Chat';
import Analytics from './pages/Analytics';

function App() {
  const { user } = useAuthStore();

  const RequireVerification = ({ children }) => {
    if (!user) return <Navigate to="/login" />;
    if (!user.phoneVerified) return <Navigate to="/verify-phone" />;
    return children;
  };

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={!user ? <Landing /> : <Navigate to="/chat" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/chat" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/chat" />} />
        <Route 
          path="/verify-phone" 
          element={user && !user.phoneVerified ? <PhoneVerification /> : <Navigate to="/chat" />} 
        />
        <Route 
          path="/chat" 
          element={<RequireVerification><Chat /></RequireVerification>} 
        />
        <Route 
          path="/analytics" 
          element={<RequireVerification><Analytics /></RequireVerification>} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
