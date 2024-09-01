import { useSession } from '@/src/components/session-provider';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Text } from '@/src/components/ui/text';
import { useNavThemeColors } from '@/src/lib/constants';
import { getBaseUrl } from '@/src/lib/utils';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ToastAndroid, View } from 'react-native';

export default function SignIn() {
    const { signIn } = useSession();
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);

    const sendCode = useCallback(async () => {
        if (!email) {
            ToastAndroid.show('Email is required', ToastAndroid.SHORT);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(getBaseUrl() + '/api/auth/send-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                }),
            });

            if (response.ok) {
                const session = response.headers.get('sessionid');
                if (!session) {
                    ToastAndroid.show('Failed to sign in', ToastAndroid.SHORT);
                    return;
                }

                signIn(session);
                if (router.canDismiss()) {
                    router.dismissAll();
                }
                return router.replace('/');
            }

            if (response.status === 404) {
                ToastAndroid.show('Email not found', ToastAndroid.SHORT);
                return;
            } else {
                ToastAndroid.show('Failed to sign in', ToastAndroid.SHORT);
            }
        } catch {
            ToastAndroid.show('Failed to sign in', ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    }, [email, signIn]);

    const colors = useNavThemeColors();

    return (
        <View className='flex flex-col bg-background'>
            <View className='mx-4 mt-8 flex flex-col gap-2'>
                <View className='mx-auto size-24 items-center justify-center'>
                    <AntDesign name='user' size={48} color={colors.primary} />
                </View>
                <Text className='my-4 text-center text-3xl font-semibold text-foreground'>
                    Let's get started!
                </Text>
                <View className='gap-4'>
                    <Input
                        autoComplete='email'
                        keyboardType='email-address'
                        textContentType='emailAddress'
                        placeholder='Your Email'
                        value={email}
                        onChangeText={e => {
                            if (loading) return;
                            setEmail(e);
                        }}
                        aria-labelledby='email'
                    />
                    <Button size='sm' disabled={loading} onPress={sendCode}>
                        <Text>{loading ? 'Please Wait' : 'Next'}</Text>
                    </Button>
                </View>
            </View>
        </View>
    );
}
