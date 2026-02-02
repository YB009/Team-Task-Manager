import { createContext, useContext } from 'react';

const LenisContext = createContext(null);

export const LenisProvider = ({ children, lenis }) => {
  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
};

export const useLenis = () => {
  return useContext(LenisContext);
};