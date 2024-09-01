import type { NotifyOnChangeProps } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';

export function useQueryFocusAware(_notifyOnChangeProps?: NotifyOnChangeProps) {
    const focusedRef = useRef(true);

    useFocusEffect(
        useCallback(() => {
            focusedRef.current = true;

            return () => {
                focusedRef.current = false;
            };
        }, [])
    );

    return () => focusedRef.current;
}
