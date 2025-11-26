import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = async (username, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error('Invalid credentials or server unavailable');

    const profileRes = await fetch(
      `${import.meta.env.VITE_API_URL}/api/profile`,
      {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }
    );

    if (!profileRes.ok) throw new Error('Failed to fetch profile');

    const userData = await profileRes.json();
    setUser(userData);

    return userData;
  };

  const signup = async (username, email, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, email, password }),
    });

    if (!res.ok) throw new Error('Signup failed');

    const data = await res.json();
    setUser({ username, email });
    return { username, email };
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
