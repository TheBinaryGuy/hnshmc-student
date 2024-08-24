import { SessionProvider } from '@/src/components/SessionProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient, focusManager, onlineManager } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import type { AppStateStatus } from 'react-native';
import { AppState, useColorScheme } from 'react-native';

import '@/src/global.css';

onlineManager.setEventListener(setOnline => {
    return NetInfo.addEventListener(state => {
        setOnline(!!state.isConnected);
    });
});

function onAppStateChange(status: AppStateStatus) {
    focusManager.setFocused(status === 'active');
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60 * 24,
            refetchInterval: 30 * 1000,
            networkMode: 'offlineFirst',
        },
    },
});

const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
});

export default function RootLayout() {
    const colorScheme = useColorScheme();

    useEffect(() => {
        const subscription = AppState.addEventListener('change', onAppStateChange);
        return () => subscription.remove();
    }, []);

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: asyncStoragePersister }}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <SessionProvider>
                    <Stack
                        screenOptions={{
                            headerStyle: {
                                backgroundColor:
                                    colorScheme === 'dark'
                                        ? 'hsl(220 43% 4%)'
                                        : 'hsl(220 44% 100%)',
                            },
                            headerTitleStyle: {
                                color:
                                    colorScheme === 'dark' ? 'hsl(220 16% 99%)' : 'hsl(220 67% 0%)',
                            },
                        }}>
                        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />

                        <Stack.Screen name='+not-found' />

                        <Stack.Screen
                            name='sign-in/index'
                            options={{
                                headerTitle: 'Sign In',
                            }}
                        />

                        <Stack.Screen
                            name='sign-in/verify/[email]'
                            options={{
                                headerTitle: 'Verify',
                            }}
                        />
                    </Stack>
                </SessionProvider>
            </ThemeProvider>
        </PersistQueryClientProvider>
    );
}
