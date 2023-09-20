import { createContext } from 'react';

export const AuthContext = createContext({
  user: null,
  userData: null,
  setUser: () => {},
});
