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
    const { session, adminSession, isAdminLoading, isLoading, signOut, signOutAdmin } =
        useSession();
    const { bottom } = useSafeAreaInsets();

    if (isLoading || isAdminLoading) {
        return <Spinner />;
    }

    if (session === null && adminSession === null) {
        return <Redirect href='/sign-in' />;
    }

    const showAdminTabs = adminSession !== null && session === null;

    return (
        <Tabs
            safeAreaInsets={{
                bottom: bottom + 8,
            }}
            screenOptions={{
                headerRight() {
                    if (showAdminTabs) {
                        return (
                            <Button
                                variant='ghost'
                                onPress={() => {
                                    fetch(getBaseUrl() + '/api/auth/admin-logout', {
                                        headers: {
                                            AdminAuthorization: 'Bearer ' + adminSession,
                                        },
                                        // eslint-disable-next-line no-console
                                    }).catch(console.error);
                                    signOutAdmin();
                                }}>
                                <Text>
                                    <AntDesign size={20} name='logout' />
                                </Text>
                            </Button>
                        );
                    }

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
                name='students'
                options={{
                    title: 'Students',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
                    ),
                    href: showAdminTabs ? '/students' : null,
                }}
                redirect={!showAdminTabs}
            />
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                    ),
                    href: !showAdminTabs ? '/' : null,
                }}
                redirect={showAdminTabs}
            />
            <Tabs.Screen
                name='fees'
                options={{
                    title: 'Fees',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'cash' : 'cash-outline'} color={color} />
                    ),
                    href: !showAdminTabs ? '/fees' : null,
                }}
                redirect={showAdminTabs}
            />
        </Tabs>
    );
}
