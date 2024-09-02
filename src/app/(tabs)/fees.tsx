import { useSession } from '@/src/components/session-provider';
import { Spinner } from '@/src/components/spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Separator } from '@/src/components/ui/separator';
import { Text } from '@/src/components/ui/text';
import { useFocusNotifyOnChangeProps } from '@/src/hooks/useFocusNotifyOnChangeProps';
import { useQueryFocusAware } from '@/src/hooks/useQueryFocusAware';
import { useRefreshOnFocus } from '@/src/hooks/useRefreshOnFocus';
import type { StudentFees } from '@/src/lib/types';
import { formatDate, formatINR, getBaseUrl } from '@/src/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { ScrollView, View } from 'react-native';

export default function Fees() {
    const { session, signIn } = useSession();

    const notifyOnChangeProps = useFocusNotifyOnChangeProps();
    const queryFocusAware = useQueryFocusAware(notifyOnChangeProps);
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
        return <Spinner />;
    }

    if (data === undefined) {
        return (
            <View className='flex-1 flex-col items-center justify-center'>
                <Text>No data</Text>
            </View>
        );
    }

    const totalPaid = data.Fees.reduce((acc, fee) => acc + Number(fee.ReceiptAmount ?? 0), 0);

    return (
        <ScrollView className='flex-1'>
            <View className='mx-4 my-8 flex-1 gap-8'>
                <View className='gap-4'>
                    <Text className='text-center text-2xl'>Summary</Text>
                    <View className='gap-6'>
                        <View className='flex-row justify-between'>
                            <Text>Term Fee</Text>
                            <Text className='font-semibold'>{formatINR(data.TermFee)}</Text>
                        </View>
                        <View className='gap-1'>
                            <View className='flex-row justify-between'>
                                <Text>Total Fees</Text>
                                <Text className='font-semibold'>{formatINR(data.TotalFee)}</Text>
                            </View>
                            <View className='flex-row justify-between'>
                                <Text className='text-green-500'>Total Paid</Text>
                                <Text className='font-semibold text-green-500'>
                                    {formatINR(totalPaid)}
                                </Text>
                            </View>
                            <Separator className='mt-1' />
                            <View className='flex-row justify-between'>
                                <Text className='text-red-500'>Total Remaining</Text>
                                <Text className='font-semibold text-red-500'>
                                    {formatINR(Number(data.TotalFee ?? 0) - Number(totalPaid))}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View className='gap-4'>
                    <Text className='text-center text-2xl'>Receipt Details</Text>
                    <View className='gap-4'>
                        {data.Fees.sort((a, b) => b.FeesIDP - a.FeesIDP).map(fee => (
                            <Card key={fee.FeesIDP}>
                                <CardHeader className='pb-2'>
                                    <CardTitle>Term {fee.TermID}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Text className='text-primary'>
                                        Amount: {formatINR(fee.ReceiptAmount)}
                                    </Text>
                                    <Text>Date: {formatDate(fee.ReceiptDate)}</Text>
                                    <Text>Remarks: {fee.Remarks ?? 'N/A'}</Text>
                                </CardContent>
                            </Card>
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
