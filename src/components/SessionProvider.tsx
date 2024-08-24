import { useStorageState } from '@/src/hooks/useStorageState';
import { createContext, useContext, type PropsWithChildren } from 'react';

const AuthContext = createContext<{
    signIn: (session: string | null) => void;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
}>({
    signIn: () => null,
    signOut: () => null,
    session: null,
    isLoading: false,
});

export function useSession() {
    const value = useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }

    return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState('auth_session');

    return (
        <AuthContext.Provider
            value={{
                signIn: (session: string | null) => {
                    setSession(session);
                },
                signOut: () => {
                    setSession(null);
                },
                session,
                isLoading,
            }}>
            {children}
        </AuthContext.Provider>
    );
}
