import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth } from '../lib/firebase';

const AuthCtx = createContext<any>(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); }), []);

  const value = useMemo(() => ({
    user,
    loading,
    signInEmail: (email: string, password: string) => signInWithEmailAndPassword(auth, email, password),
    signUpEmail: (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password),
    logout: () => signOut(auth),
    sendOtp: async (phone: string) => {
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
      return signInWithPhoneNumber(auth, phone, verifier);
    },
    verifyOtp: async (confirmation: ConfirmationResult, code: string) => confirmation.confirm(code)
  }), [user, loading]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
