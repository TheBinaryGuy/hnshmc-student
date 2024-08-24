import { useSession } from '@/src/components/SessionProvider';
import { cn, getBaseUrl } from '@/src/lib/utils';
import { AntDesign } from '@expo/vector-icons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, TextInput, ToastAndroid, View } from 'react-native';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const styles = StyleSheet.create({
    root: { flex: 1, padding: 20 },
    title: { textAlign: 'center', fontSize: 30 },
    codeFieldRoot: { marginTop: 20 },
    cell: {
        width: 40,
        height: 40,
        lineHeight: 38,
        fontSize: 24,
        borderWidth: 2,
        borderColor: '#00000030',
        textAlign: 'center',
    },
    focusCell: {
        borderColor: '#000',
    },
});

const CELL_COUNT = 8;

export default function Verify() {
    const { signIn } = useSession();
    const { email } = useLocalSearchParams<{ email: string }>();
    const [loading, setLoading] = useState<boolean>(false);

    const [code, setCode] = useState('');
    const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: code,
        setValue: setCode,
    });

    const verifyCode = useCallback(async () => {
        if (!code) {
            ToastAndroid.show('Email is required', ToastAndroid.SHORT);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(getBaseUrl() + '/api/auth/verify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    confirmationCode: code,
                }),
            });

            const session = response.headers.get('auth_session');
            if (!response.ok || !session) {
                ToastAndroid.show('Failed to sign in', ToastAndroid.SHORT);
                return;
            }

            signIn(session);
            if (router.canDismiss()) {
                router.dismissAll();
            }
            return router.replace('/');
        } catch {
            ToastAndroid.show('Failed to send code', ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    }, [code, email, signIn]);

    if (!email || email === '[email]') {
        return <Redirect href='/sign-in' />;
    }

    return (
        <View className='flex flex-col bg-background'>
            <View className='mx-4 mt-8 flex flex-col gap-2'>
                <Text className='text-center text-primary'>
                    <AntDesign name='Safety' size={48} />
                </Text>
                <Text className='my-4 text-center text-3xl font-semibold text-foreground'>
                    Verification
                </Text>
                <Text className='text-center text-foreground'>
                    Please enter the code that was just sent to your email:
                </Text>
                <Text className='text-center text-foreground'>{email}</Text>
                <View className='gap-4'>
                    <CodeField
                        ref={ref}
                        {...props}
                        onSubmitEditing={verifyCode}
                        InputComponent={TextInput}
                        value={code}
                        onChangeText={setCode}
                        cellCount={CELL_COUNT}
                        rootStyle={styles.codeFieldRoot}
                        keyboardType='number-pad'
                        textContentType='oneTimeCode'
                        autoComplete='sms-otp'
                        testID='verify-code'
                        renderCell={({ index, symbol, isFocused }) => (
                            <Text
                                key={index}
                                className={cn(
                                    'h-10 w-10 rounded border-2 border-foreground/30 bg-background text-center text-2xl leading-10 text-foreground',
                                    {
                                        'border-foreground': isFocused,
                                    }
                                )}
                                onLayout={getCellOnLayoutHandler(index)}>
                                {symbol || (isFocused ? <Cursor /> : null)}
                            </Text>
                        )}
                    />
                    <Text
                        className='rounded bg-primary p-2 text-center font-semibold text-primary-foreground shadow disabled:bg-primary/50 disabled:text-primary-foreground/50'
                        disabled={loading}
                        onPress={verifyCode}>
                        {loading ? 'Please Wait' : 'Sign In'}
                    </Text>
                </View>
            </View>
        </View>
    );
}
