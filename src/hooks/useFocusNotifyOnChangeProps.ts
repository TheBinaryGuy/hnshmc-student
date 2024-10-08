import type { NotifyOnChangeProps } from '@tanstack/query-core';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';

export function useFocusNotifyOnChangeProps(notifyOnChangeProps?: NotifyOnChangeProps) {
    const focusedRef = useRef(true);

    useFocusEffect(
        useCallback(() => {
            focusedRef.current = true;

            return () => {
                focusedRef.current = false;
            };
        }, [])
    );

    return () => {
        if (!focusedRef.current) {
            return [];
        }

        if (typeof notifyOnChangeProps === 'function') {
            return notifyOnChangeProps();
        }

        return notifyOnChangeProps;
    };
}
