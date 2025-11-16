import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = async (email, password) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/users?email=${email}&password=${password}`
    );

    if (!res.ok) throw new Error('Server error');

    const users = await res.json();

    if (users.length === 0) {
      throw new Error('Invalid email or password');
    }

    const foundUser = users[0];

    localStorage.setItem('user', JSON.stringify(foundUser));
    setUser(foundUser);

    return foundUser;
  };

  const signup = async (username, email, password) => {
    const newUser = { username, email, password };

    const existing = await fetch(
      `${import.meta.env.VITE_API_URL}/users?email=${email}`
    );
    const exists = await existing.json();
    if (exists.length > 0) {
      throw new Error('User with this email already exists');
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });

    if (!res.ok) throw new Error('Signup failed');

    const createdUser = await res.json();

    localStorage.setItem('user', JSON.stringify(createdUser));
    setUser(createdUser);

    return createdUser;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
