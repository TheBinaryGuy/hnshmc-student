import { useStorageState } from '@/src/hooks/useStorageState';
import { createContext, useContext, type PropsWithChildren } from 'react';

const AuthContext = createContext<{
    signInOrRefresh: (headers: Headers) => boolean;
    signInOrRefreshAdmin: (headers: Headers) => boolean;
    signOut: () => void;
    signOutAdmin: () => void;
    session?: string | null;
    adminSession?: string | null;
    isLoading: boolean;
    isAdminLoading: boolean;
}>({
    signInOrRefresh: () => false,
    signInOrRefreshAdmin: () => false,
    signOut: () => null,
    signOutAdmin: () => null,
    isLoading: false,
    isAdminLoading: false,
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
    const [[isLoading, session], setSession] = useStorageState('sessionid');
    const [[isAdminLoading, adminSession], setAdminSession] = useStorageState('admin-sessionid');

    return (
        <AuthContext.Provider
            value={{
                signInOrRefresh: (headers: Headers) => {
                    const session = headers.get('sessionid');
                    if (session !== null && session !== undefined && session !== '') {
                        setSession(session);
                        return true;
                    }
                    return false;
                },
                signInOrRefreshAdmin: (headers: Headers) => {
                    const session = headers.get('admin-sessionid');
                    if (session !== null && session !== undefined && session !== '') {
                        setAdminSession(session);
                        return true;
                    }
                    return false;
                },
                signOut: () => {
                    setSession(null);
                },
                signOutAdmin: () => {
                    setSession(null);
                    setAdminSession(null);
                },
                session,
                adminSession,
                isLoading,
                isAdminLoading,
            }}>
            {children}
        </AuthContext.Provider>
    );
}
