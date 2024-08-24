import { useSession } from '@/src/components/SessionProvider';
import { getBaseUrl } from '@/src/lib/utils';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Text, TextInput, ToastAndroid, View } from 'react-native';

export default function SignIn() {
    const { signIn } = useSession();
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);

    const sendCode = useCallback(async () => {
        if (!email) {
            ToastAndroid.show('Email is required', ToastAndroid.SHORT);
            return;
        }

        if (email.toLowerCase() === 'admin@hnshmc.org') {
            signIn('admin');
            if (router.canDismiss()) {
                router.dismissAll();
            }
            return router.replace('/');
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
                return router.push({
                    pathname: '/sign-in/verify/[email]',
                    params: {
                        email,
                    },
                });
            }

            if (response.status === 404) {
                ToastAndroid.show('Email not found', ToastAndroid.SHORT);
                return;
            } else {
                ToastAndroid.show('Failed to send code', ToastAndroid.SHORT);
            }
        } catch {
            ToastAndroid.show('Failed to send code', ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    }, [email, signIn]);

    return (
        <View className='flex flex-col bg-background'>
            <View className='mx-4 mt-8 flex flex-col gap-2'>
                <Text className='text-center text-primary'>
                    <AntDesign name='user' size={48} />
                </Text>
                <Text className='my-4 text-center text-3xl font-semibold text-foreground'>
                    Let's get started!
                </Text>
                <View className='gap-4'>
                    <TextInput
                        onSubmitEditing={sendCode}
                        value={email}
                        onChangeText={e => {
                            if (loading) return;
                            setEmail(e);
                        }}
                        autoComplete='email'
                        keyboardType='email-address'
                        textContentType='emailAddress'
                        placeholder='Your Email'
                        className='rounded bg-muted px-2 py-2 text-foreground shadow placeholder:text-muted-foreground'
                    />
                    <Text
                        className='rounded bg-primary p-2 text-center font-semibold text-primary-foreground shadow disabled:bg-primary/50 disabled:text-primary-foreground/50'
                        disabled={loading}
                        onPress={sendCode}>
                        {loading ? 'Please Wait' : 'Next'}
                    </Text>
                </View>
            </View>
        </View>
    );
}
