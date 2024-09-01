import { Text } from '@/src/components/ui/text';
import { AntDesign } from '@expo/vector-icons';
import { View } from 'react-native';

export function Spinner() {
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
