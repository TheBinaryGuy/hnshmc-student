import { ActivityIndicator, View } from 'react-native';

export function Spinner() {
    return (
        <View className='h-full items-center justify-center'>
            <ActivityIndicator className='text-primary' size={24} />
        </View>
    );
}
