import { useSession } from '@/src/components/SessionProvider';
import { TabBarIcon } from '@/src/components/navigation/TabBarIcon';
import { Text } from '@/src/components/ui/text';
import { getBaseUrl } from '@/src/lib/utils';
import { AntDesign } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
    const { session, isLoading, signOut } = useSession();
    const { bottom } = useSafeAreaInsets();

    if (isLoading) {
        return (
            <View className='flex h-full flex-col items-center justify-center'>
                <View className='animate-spin'>
                    <Text className='text-primary'>
                        <AntDesign name='loading1' size={24} />
                    </Text>
                </View>
            </View>
        );
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
                        <Text
                            onPress={() => {
                                fetch(getBaseUrl() + '/api/auth/logout', {
                                    headers: {
                                        Authorization: 'Bearer ' + session,
                                    },
                                    // eslint-disable-next-line no-console
                                }).catch(console.error);
                                signOut();
                            }}
                            className='mr-4 mt-2 rounded bg-transparent p-2 active:bg-background/50 active:text-foreground/50'>
                            <AntDesign size={20} name='logout' />
                        </Text>
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
