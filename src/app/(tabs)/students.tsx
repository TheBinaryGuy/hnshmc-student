import { useSession } from '@/src/components/session-provider';
import { Spinner } from '@/src/components/spinner';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Text } from '@/src/components/ui/text';
import { useDebounce } from '@/src/hooks/useDebounce';
import { useFocusNotifyOnChangeProps } from '@/src/hooks/useFocusNotifyOnChangeProps';
import { useQueryFocusAware } from '@/src/hooks/useQueryFocusAware';
import { useRefreshOnFocus } from '@/src/hooks/useRefreshOnFocus';
import type { PaginatedStudents } from '@/src/lib/types';
import { getBaseUrl } from '@/src/lib/utils';
import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ToastAndroid, View } from 'react-native';

export default function Students() {
    const { adminSession, signInOrRefreshAdmin, signInOrRefresh } = useSession();

    const [search, setSearch] = useState<string>('');
    const debouncedSearch = useDebounce<string>(search);

    const notifyOnChangeProps = useFocusNotifyOnChangeProps();
    const queryFocusAware = useQueryFocusAware(notifyOnChangeProps);
    const { data, refetch, isLoading, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['students', adminSession, debouncedSearch],
        queryFn: async ({ pageParam, signal }) => {
            const url = new URL(getBaseUrl() + '/api/admin/users');
            pageParam && url.searchParams.append('cursor', pageParam);
            debouncedSearch && url.searchParams.append('search', debouncedSearch);

            const response = await fetch(url, {
                headers: {
                    AdminAuthorization: `Bearer ${adminSession}`,
                },
                signal,
            });

            if (!response.ok) {
                throw new Error('Error fetching data');
            }

            signInOrRefreshAdmin(response.headers);
            return response.json() as Promise<PaginatedStudents>;
        },
        notifyOnChangeProps,
        enabled: queryFocusAware,
        initialPageParam: '',
        getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    });
    useRefreshOnFocus(refetch);

    const [loading, setLoading] = useState<boolean>(false);
    const login = useCallback(
        async (email: string) => {
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

                if (response.status === 404) {
                    ToastAndroid.show('Email not found', ToastAndroid.SHORT);
                    return;
                }

                if (!response.ok) {
                    ToastAndroid.show('Failed to sign in', ToastAndroid.SHORT);
                    return;
                }

                signInOrRefresh(response.headers);
                return;
            } catch {
                ToastAndroid.show('Failed to sign in', ToastAndroid.SHORT);
            } finally {
                setLoading(false);
            }
        },
        [signInOrRefresh]
    );

    const flatData = useMemo(() => data?.pages.flatMap(page => page.students) ?? [], [data?.pages]);

    if (isLoading) {
        return <Spinner />;
    }

    if (data === undefined) {
        return (
            <View className='flex-1 flex-col items-center justify-center'>
                <Text>No students found</Text>
            </View>
        );
    }

    return (
        <View className='mx-4 flex-1 gap-8'>
            <View className='flex-1 gap-4'>
                <Input
                    value={search}
                    onChangeText={setSearch}
                    placeholder='Search (Name or Email)'
                    aria-labelledby='Search (Name or Email)'
                    accessibilityLabel='Search (Name or Email)'
                />
                <FlashList
                    data={flatData}
                    renderItem={({ item: student }) => (
                        <StudentCard loading={loading} login={login} student={student} />
                    )}
                    keyExtractor={student => student.StudentIDP.toString()}
                    estimatedItemSize={159}
                    refreshing={isFetching}
                    onEndReached={() => {
                        if (!isFetching && hasNextPage && !search) {
                            fetchNextPage();
                        }
                    }}
                    onEndReachedThreshold={0.5}
                    ListFooterComponentStyle={{
                        marginVertical: 16,
                    }}
                    ListFooterComponent={
                        isFetching ? <ActivityIndicator className='text-primary' size={24} /> : null
                    }
                />
            </View>
        </View>
    );
}

function StudentCard({
    student,
    loading,
    login,
}: {
    student: PaginatedStudents['students'][0];
    loading: boolean;
    login: (email: string) => Promise<void>;
}) {
    return (
        <Card className='my-2'>
            <CardHeader className='pb-2'>
                <CardTitle>{student.FullName}</CardTitle>
            </CardHeader>
            <CardContent>
                <Text>{student.Email}</Text>
            </CardContent>
            <CardFooter>
                <Button
                    size='sm'
                    className='w-full'
                    disabled={loading || !student.Email}
                    onPress={() => student.Email && login(student.Email)}>
                    <Text>{loading ? 'Please Wait' : 'Impersonate'}</Text>
                </Button>
            </CardFooter>
        </Card>
    );
}
