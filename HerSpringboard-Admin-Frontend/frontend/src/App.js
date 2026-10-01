import React, { useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogin = (email, password) => {
    const validEmail = 'prasi@gmail.com';
    const validPassword = 'prasiii';
    if (email === validEmail && password === validPassword) {
      setIsLoggedIn(true);
    } else {
      alert('Invalid email or password!');
    }
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
  };
  return (
    <div>
      {isLoggedIn ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <AdminLogin onLogin={handleLogin} />
      )}
    </div>
  );
}
export default App;
