import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load saved session on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedRole = localStorage.getItem("role");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setRole(savedRole);
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      console.log('Attempting login with:', credentials);
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('Login response status:', response.status);
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Login failed:', errorData);
        throw new Error(`Login failed: ${response.status}`);
      }

      const data = await response.json();
      const { user: userData, tokens } = data;
      
      setUser(userData);
      setRole(userData.role);
      setToken(tokens.access);
      setIsAuthenticated(true);
      
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", userData.role);
      localStorage.setItem("token", tokens.access);
      localStorage.setItem("refresh_token", tokens.refresh);
      
      return { success: true, user: userData };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('Attempting registration with:', userData);
      const response = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('Registration response status:', response.status);
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Registration failed:', errorData);
        throw new Error(`Registration failed: ${response.status}`);
      }

      const data = await response.json();
      const { user: newUser, tokens } = data;
      
      setUser(newUser);
      setRole(newUser.role);
      setToken(tokens.access);
      setIsAuthenticated(true);
      
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("role", newUser.role);
      localStorage.setItem("token", tokens.access);
      localStorage.setItem("refresh_token", tokens.refresh);
      
      return { success: true, user: newUser };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Registration failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
  };

  const value = {
    user,
    role,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
