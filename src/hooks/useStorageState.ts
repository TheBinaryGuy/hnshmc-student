import * as SecureStore from 'expo-secure-store';
import * as React from 'react';

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(initialValue: [boolean, T | null] = [true, null]): UseStateHook<T> {
    return React.useReducer(
        (_: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
        initialValue
    ) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: string | null) {
    if (value === null || value === '') {
        await SecureStore.deleteItemAsync(key);
    } else {
        await SecureStore.setItemAsync(key, value);
    }
}

export function useStorageState(key: string): UseStateHook<string> {
    const [state, setState] = useAsyncState<string>();

    React.useEffect(() => {
        SecureStore.getItemAsync(key).then(value => {
            setState(value);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    const setValue = React.useCallback(
        (value: string | null) => {
            setState(value);
            setStorageItemAsync(key, value);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [key]
    );

    return [state, setValue];
}
