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

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || 'Invalid credentials');
    }

    const data = await res.json();
    setUser(data.user);
    return data.user;
  };

  const signup = async (username, email, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, email, password }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || 'Signup failed');
    }

    const data = await res.json();
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };
  const updateUser = (newData) => {
    setUser((prev) => ({ ...prev, ...newData }));
    console.log('authUser after update:', user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
