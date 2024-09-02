import { TabBarIcon } from '@/src/components/navigation/tab-bar-icon';
import { useSession } from '@/src/components/session-provider';
import { Spinner } from '@/src/components/spinner';
import { Button } from '@/src/components/ui/button';
import { Text } from '@/src/components/ui/text';
import { getBaseUrl } from '@/src/lib/utils';
import { AntDesign } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
    const { session, isLoading, signOut } = useSession();
    const { bottom } = useSafeAreaInsets();

    if (isLoading) {
        return <Spinner />;
    }

    if (session === null) {
        return <Redirect href='/sign-in' />;
    }

    return (
        <Tabs
            safeAreaInsets={{
                bottom: bottom + 8,
            }}
            screenOptions={{
                headerRight() {
                    return (
                        <Button
                            variant='ghost'
                            onPress={() => {
                                fetch(getBaseUrl() + '/api/auth/logout', {
                                    headers: {
                                        Authorization: 'Bearer ' + session,
                                    },
                                    // eslint-disable-next-line no-console
                                }).catch(console.error);
                                signOut();
                            }}>
                            <Text>
                                <AntDesign size={20} name='logout' />
                            </Text>
                        </Button>
                    );
                },
            }}>
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='fees'
                options={{
                    title: 'Fees',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'cash' : 'cash-outline'} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
