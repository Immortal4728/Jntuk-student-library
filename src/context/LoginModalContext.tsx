import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LoginModalContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const LoginModalContext = createContext<LoginModalContextType>({
  isOpen: false,
  open: () => {},
  close: () => {},
});

export function useLoginModal() {
  return useContext(LoginModalContext);
}

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  useEffect(() => {
    const handler = () => open();
    window.addEventListener('open-login-modal', handler);
    return () => window.removeEventListener('open-login-modal', handler);
  }, []);

  return (
    <LoginModalContext.Provider value={{ isOpen, open, close }}>
      {children}
    </LoginModalContext.Provider>
  );
}
