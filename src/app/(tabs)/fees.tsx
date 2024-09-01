import { useSession } from '@/src/components/SessionProvider';
import { Text } from '@/src/components/ui/text';
import { useFocusNotifyOnChangeProps } from '@/src/hooks/useFocusNotifyOnChangeProps';
import { useQueryFocusAware } from '@/src/hooks/useQueryFocusAware';
import { useRefreshOnFocus } from '@/src/hooks/useRefreshOnFocus';
import { getBaseUrl } from '@/src/lib/utils';
import { AntDesign } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ScrollView, View } from 'react-native';

type StudentFees = {
    TermFee: number | null;
    TotalFee: number | null;
    Fees: {
        FeesIDP: number;
        StudentIDF: number;
        TermID: number;
        TermEntryID: number | null;
        ReceiptDate: Date | null;
        ReceiptAmount: number | null;
        Remarks: string | null;
    }[];
};

export default function Fees() {
    const notifyOnChangeProps = useFocusNotifyOnChangeProps();
    const queryFocusAware = useQueryFocusAware(notifyOnChangeProps);
    const { session, signIn } = useSession();
    const { data, isLoading, refetch } = useQuery<unknown, Error, StudentFees>({
        queryKey: ['fees', session],
        queryFn: async () => {
            const response = await fetch(getBaseUrl() + '/api/manage/fees', {
                headers: {
                    Authorization: 'Bearer ' + session,
                },
            });

            if (!response.ok) {
                throw new Error('Error fetching data');
            }

            const newSession = response.headers.get('sessionid');
            if (newSession !== null && newSession !== undefined && newSession !== '') {
                signIn(newSession);
            }

            return response.json();
        },
        notifyOnChangeProps,
        enabled: queryFocusAware,
    });

    useRefreshOnFocus(refetch);

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

    if (data === undefined) {
        return (
            <View className='flex-1 flex-col items-center justify-center'>
                <Text className='text-foreground'>No data</Text>
            </View>
        );
    }

    return (
        <ScrollView className='flex-1'>
            <View className='flex-1 bg-background px-4 py-8'>
                <StudentFeesCard data={data} />
            </View>
        </ScrollView>
    );
}

function formatINR(amount: number | null) {
    if (amount === null) return 'N/A';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}

function formatDate(date: Date | null) {
    if (date !== null) {
        return format(date, 'dd MMM yyyy');
    }
    return 'N/A';
}

function StudentFeesCard({ data }: { data: StudentFees }) {
    return (
        <View>
            <Text className='text-lg font-bold text-foreground'>Work in Progress 🚧</Text>
            <View className='py-4'>
                <View className='gap-2'>
                    <View className='flex-row justify-between rounded bg-background p-2 shadow'>
                        <Text className='font-semibold text-foreground'>Term Fee:</Text>
                        <Text className='font-bold text-primary'>{formatINR(data.TermFee)}</Text>
                    </View>
                    <View className='flex-row justify-between rounded bg-background p-2 shadow'>
                        <Text className='font-semibold text-foreground'>Total Fee:</Text>
                        <Text className='font-bold text-primary'>{formatINR(data.TotalFee)}</Text>
                    </View>
                    <View className='gap-4 py-4'>
                        <Text className='font-semibold text-foreground'>Receipt Details:</Text>
                        <View className='rounded-md bg-background'>
                            {data.Fees.sort((a, b) => b.FeesIDP - a.FeesIDP).map(fee => {
                                return (
                                    <View key={fee.FeesIDP} className='border-b border-border p-4'>
                                        <View className='mb-2 flex-row items-center justify-between'>
                                            <Text className='font-medium text-foreground'>
                                                Term: {fee.TermID}
                                            </Text>
                                            <View
                                                className={`rounded px-2 py-1 ${fee.ReceiptDate ? 'bg-green-500' : 'bg-red-500'}`}>
                                                <Text className='text-xs text-foreground'>
                                                    {fee.ReceiptDate ? 'Paid' : 'Pending'}
                                                </Text>
                                            </View>
                                        </View>
                                        <View className='gap-1'>
                                            <Text className='text-sm text-muted-foreground'>
                                                <Text className='font-medium text-foreground'>
                                                    Date:
                                                </Text>{' '}
                                                {formatDate(fee.ReceiptDate)}
                                            </Text>
                                            <Text className='text-sm text-muted-foreground'>
                                                <Text className='font-medium text-foreground'>
                                                    Amount:
                                                </Text>{' '}
                                                <Text
                                                    className={
                                                        fee.ReceiptDate
                                                            ? 'font-bold text-green-500'
                                                            : 'text-red-500'
                                                    }>
                                                    {formatINR(fee.ReceiptAmount)}
                                                </Text>
                                            </Text>
                                            <Text className='text-sm text-muted-foreground'>
                                                <Text className='font-medium text-foreground'>
                                                    Remarks:
                                                </Text>{' '}
                                                <Text className='italic'>
                                                    {fee.Remarks ?? 'N/A'}
                                                </Text>
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}
