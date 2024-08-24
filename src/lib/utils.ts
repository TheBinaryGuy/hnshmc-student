import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getCookies(cookieStr: string) {
    return cookieStr
        .split(';')
        .map(str => str.trim().split(/=(.+)/))
        .reduce(
            (acc, curr) => {
                acc[curr[0]] = curr[1];
                return acc;
            },
            {} as Record<string, string>
        );
}

export function getBaseUrl() {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'https://hnshmc-web.vercel.app';
    return apiUrl;
}
