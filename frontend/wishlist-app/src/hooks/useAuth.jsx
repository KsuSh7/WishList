import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch {}
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error('Invalid credentials');

    const profileRes = await fetch(
      `${import.meta.env.VITE_API_URL}/api/profile`,
      {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }
    );

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

    const profileRes = await fetch(
      `${import.meta.env.VITE_API_URL}/api/profile`,
      {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }
    );

    const userData = await profileRes.json();
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, signup, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
