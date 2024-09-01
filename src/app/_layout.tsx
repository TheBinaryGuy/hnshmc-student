import { SessionProvider } from '@/src/components/session-provider';
import { setAndroidNavigationBar } from '@/src/lib/android-navigation-bar';
import { NAV_THEME } from '@/src/lib/constants';
import { useColorScheme } from '@/src/lib/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient, focusManager, onlineManager } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import type { AppStateStatus } from 'react-native';
import { AppState } from 'react-native';

import '@/src/global.css';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

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
    const { colorScheme, isDarkColorScheme } = useColorScheme();

    useEffect(() => {
        setAndroidNavigationBar(colorScheme).finally(() => SplashScreen.hideAsync());
        (async () => {
            await SystemUI.setBackgroundColorAsync(
                colorScheme === 'dark'
                    ? NAV_THEME.dark.colors.background
                    : NAV_THEME.light.colors.background
            );
            await setAndroidNavigationBar(colorScheme);
        })().finally(() => SplashScreen.hideAsync());
    }, [colorScheme]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', onAppStateChange);
        return () => subscription.remove();
    }, []);

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: asyncStoragePersister }}>
            <ThemeProvider value={isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light}>
                <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
                <SessionProvider>
                    <Stack>
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
                    <PortalHost />
                </SessionProvider>
            </ThemeProvider>
        </PersistQueryClientProvider>
    );
}
