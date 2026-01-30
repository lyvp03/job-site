import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context for global data
const AuthContext = createContext();

// Create provider component provide data
export const AuthProvider = ({ children }) => {
  // Data share for all app
  const [user, setUser] = useState(null); // user info
  const [token, setToken] = useState(localStorage.getItem('token')); // get token from BE
  const [loading, setLoading] = useState(true); // ← add loading state

  // Restore user from localStorage khi app khởi động
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        // if parse failed, clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false); 
  }, []);

  // Login
  const login = (userData, authToken) => {
    setUser(userData); // save user info
    setToken(authToken); // save token
    localStorage.setItem('token', authToken); // save in localStorage to keep login
    localStorage.setItem('user', JSON.stringify(userData)); //save user in4
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user'); //delete user
  };

  // Provide data for children
  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};