import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = async (email, password) => {
    await new Promise((r) => setTimeout(r, 300));

    const fakeUser = {
      username: email.split('@')[0],
      email,
      token: 'fake-jwt',
    };
    localStorage.setItem('user', JSON.stringify(fakeUser));
    setUser(fakeUser);

    return fakeUser;
  };

  const signup = async (username, email, password) => {
    await new Promise((r) => setTimeout(r, 300));

    const fakeUser = { username, email, token: 'fake-jwt' };
    localStorage.setItem('user', JSON.stringify(fakeUser));
    setUser(fakeUser);

    return fakeUser;
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
