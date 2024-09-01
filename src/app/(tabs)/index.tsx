import { CustomAvatar } from '@/src/components/custom-avatar';
import { useSession } from '@/src/components/SessionProvider';
import { Text } from '@/src/components/ui/text';
import { useFocusNotifyOnChangeProps } from '@/src/hooks/useFocusNotifyOnChangeProps';
import { useQueryFocusAware } from '@/src/hooks/useQueryFocusAware';
import { useRefreshOnFocus } from '@/src/hooks/useRefreshOnFocus';
import { cn, getBaseUrl } from '@/src/lib/utils';
import { AntDesign } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { ScrollView, View } from 'react-native';

type Student = {
    StudentIDP: number;
    FullName: string | null;
    MobileNo: string | null;
    Email: string | null;
    GenderID: number | null;
    Address: string | null;
    FatherMobileNo: string | null;
    CuurentYearID: number | null;
    GRNNo: string | null;
    AadharNumber: number | null;
    PANNo: string | null;
    ScholarshipAmount: number | null;
    EnrollmenyYear: string | null;
    FeesTypeID: number | null;
    BatchID: number | null;
    Remark1: string | null;
    Remark2: string | null;
    Remark3: string | null;
    Password: string | null;
    OTP: string | null;
    TermFee: number | null;
    TotalFee: number | null;
    DepositRefundable: number | null;
    DepositReceived: number | null;
    ImportRefID: number | null;
    ProfileImage: string | null;
    PassYear1: number | null;
    PassYear2: number | null;
    PassYear3: number | null;
    PassYear4: number | null;
    IsActive: boolean;
    IsDelete: boolean | null;
    EntryBy: number;
    EntryDate: Date;
};

const passYearToText = {
    1: 'Studying',
    2: 'Passed',
} as Record<number, string>;

export default function Home() {
    const { session, signIn } = useSession();

    const notifyOnChangeProps = useFocusNotifyOnChangeProps();
    const queryFocusAware = useQueryFocusAware(notifyOnChangeProps);
    const {
        data: student,
        isLoading,
        refetch,
    } = useQuery<unknown, Error, Student>({
        queryKey: ['profile', session],
        queryFn: async () => {
            const response = await fetch(getBaseUrl() + '/api/manage/profile', {
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

    if (student === undefined) {
        return (
            <View className='flex-1 flex-col items-center justify-center'>
                <Text className='text-foreground'>No data</Text>
            </View>
        );
    }

    return (
        <ScrollView className='flex-1 bg-background text-foreground'>
            <View className='mx-4 mt-8 flex-1 gap-8'>
                <CustomAvatar
                    onSuccess={refetch}
                    name={student.FullName}
                    profileImage={student.ProfileImage}
                />

                <View className='gap-4'>
                    <Text className='text-center text-2xl text-foreground'>Personal Details</Text>
                    <View className='flex-row flex-wrap rounded-lg bg-muted p-4 shadow-sm'>
                        <Text className='w-1/2 py-2 text-foreground'>Name</Text>
                        <Text className='w-1/2 py-2 text-muted-foreground'>
                            {student.FullName ?? '-'}
                        </Text>

                        <Text className='w-1/2 py-2 text-foreground'>Mobile</Text>
                        <Text className='w-1/2 py-2 text-muted-foreground'>
                            {student.MobileNo ?? '-'}
                        </Text>

                        <Text className='w-1/2 py-2 text-foreground'>Email</Text>
                        <Text className='w-1/2 py-2 text-muted-foreground'>
                            {student.Email ?? '-'}
                        </Text>

                        <Text className='w-1/2 py-2 text-foreground'>Address</Text>
                        <Text className='w-1/2 py-2 text-muted-foreground'>
                            {student.Address ?? '-'}
                        </Text>

                        <Text className='w-1/2 py-2 text-foreground'>GRN Number</Text>
                        <Text className='w-1/2 py-2 text-muted-foreground'>
                            {student.GRNNo ?? '-'}
                        </Text>

                        <Text className='w-1/2 py-2 text-foreground'>Enrollment Year</Text>
                        <Text className='w-1/2 py-2 text-muted-foreground'>
                            {student.EnrollmenyYear ?? '-'}
                        </Text>
                    </View>
                </View>

                <View className='flex-1 gap-4'>
                    <Text className='text-center text-2xl text-foreground'>Passed / Studying</Text>
                    <Timeline
                        data={[
                            {
                                id: 1,
                                year: 'Year 1',
                                title:
                                    student.PassYear1 !== null && student.PassYear1 !== undefined
                                        ? (passYearToText[student.PassYear1] ?? 'Not Available')
                                        : 'Not Available',
                                passYear: student.PassYear1,
                            },
                            {
                                id: 2,
                                year: 'Year 2',
                                title:
                                    student.PassYear2 !== null && student.PassYear2 !== undefined
                                        ? (passYearToText[student.PassYear2] ?? 'Not Available')
                                        : 'Not Available',
                                passYear: student.PassYear2,
                            },
                            {
                                id: 3,
                                year: 'Year 3',
                                title:
                                    student.PassYear3 !== null && student.PassYear3 !== undefined
                                        ? (passYearToText[student.PassYear3] ?? 'Not Available')
                                        : 'Not Available',
                                passYear: student.PassYear3,
                            },
                            {
                                id: 4,
                                year: 'Year 4',
                                title:
                                    student.PassYear4 !== null && student.PassYear4 !== undefined
                                        ? (passYearToText[student.PassYear4] ?? 'Not Available')
                                        : 'Not Available',
                                passYear: student.PassYear4,
                            },
                        ]}
                    />
                </View>
            </View>
        </ScrollView>
    );
}

function TimelineItem({
    item,
    isLast,
}: {
    item: {
        id: number;
        year: string;
        title: string;
        passYear: number | null;
    };
    isLast: boolean;
}) {
    return (
        <View className='flex-row'>
            <View className='mr-4 items-center'>
                <View
                    className={cn('z-10 size-4 rounded-full', {
                        'bg-amber-500': item.passYear === 1,
                        'bg-green-500': item.passYear === 2,
                    })}
                />
                {!isLast && <View className='-mt-2 w-0.5 flex-1 bg-muted-foreground' />}
            </View>
            <View className='flex-1 pb-6'>
                <Text className='mb-2 text-muted-foreground'>{item.year}</Text>
                <View className='rounded-lg bg-muted p-4 shadow-sm'>
                    <Text className='text-lg font-semibold text-foreground'>{item.title}</Text>
                </View>
            </View>
        </View>
    );
}

const Timeline = ({
    data,
}: {
    data: {
        id: number;
        year: string;
        title: string;
        passYear: number | null;
    }[];
}) => {
    const items = data.filter(item => item.passYear !== null && item.passYear !== undefined);
    return (
        <View className='flex-1 p-4'>
            {items.map((item, index) => (
                <TimelineItem key={item.id} item={item} isLast={index === items.length - 1} />
            ))}
        </View>
    );
};
