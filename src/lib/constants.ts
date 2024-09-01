import { useColorScheme } from '@/src/lib/useColorScheme';
import type { Theme } from '@react-navigation/native';

export const NAV_THEME: Record<'dark' | 'light', Theme> = {
    light: {
        dark: false,
        colors: {
            background: 'hsl(220, 44%, 100%)', // hsl background
            border: 'hsl(220, 2%, 93%)', // hsl border
            card: 'hsl(0, 0%, 99%)', // hsl card
            notification: 'hsl(0, 86%, 45%)', // hsl destructive
            primary: 'hsl(220, 66%, 58%)', // hsl primary
            text: 'hsl(220, 67%, 0%)', // hsl foreground
        },
    },
    dark: {
        dark: true,
        colors: {
            background: 'hsl(220, 43%, 4%)', // hsl background
            border: 'hsl(220, 2%, 13%)', // hsl border
            card: 'hsl(220, 43%, 5%)', // hsl card
            notification: 'hsl(0, 86%, 49%)', // hsl destructive
            primary: 'hsl(220, 66%, 58%)', // hsl primary
            text: 'hsl(220, 16%, 99%)', // hsl foreground
        },
    },
};

export function useNavThemeColors() {
    const { colorScheme } = useColorScheme();
    return NAV_THEME[colorScheme].colors;
}
