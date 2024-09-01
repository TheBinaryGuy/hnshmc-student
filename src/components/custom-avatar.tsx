import { useSession } from '@/src/components/SessionProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Button } from '@/src/components/ui/button';
import { Text } from '@/src/components/ui/text';
import { getBaseUrl } from '@/src/lib/utils';
import { AntDesign } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { Pressable, ToastAndroid, View } from 'react-native';

async function fetchImageFromUri(uri: string) {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
}

export function CustomAvatar({
    profileImage,
    name,
    onSuccess,
}: {
    profileImage: string | null;
    name: string | null;
    onSuccess: () => void;
}) {
    const { session } = useSession();
    const { mutate: setProfileImage, isPending } = useMutation({
        mutationKey: ['profile', session],
        mutationFn: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (result.canceled || result.assets.length <= 0) {
                throw new Error('Canceled');
            }

            const image = result.assets.at(0)!;
            const response = await fetch(getBaseUrl() + '/api/manage/profile/start-upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session}`,
                },
                body: JSON.stringify({
                    contentType: image.mimeType,
                }),
            });

            if (!response.ok) {
                throw new Error('Error starting upload');
            }

            const { url } = (await response.json()) as { url: string };
            const blob = await fetchImageFromUri(image.uri);
            const headers: HeadersInit = {};
            if (image.mimeType) {
                headers['Content-Type'] = image.mimeType;
            }
            const uploadResponse = await fetch(url, {
                method: 'PUT',
                headers,
                body: blob,
            });

            if (!uploadResponse.ok) {
                throw new Error('Error uploading image');
            }
        },
        onSuccess: async () => {
            await fetch(getBaseUrl() + '/api/manage/profile/complete-upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session}`,
                },
                body: JSON.stringify({
                    status: 'COMPLETED',
                }),
            });

            onSuccess();
        },
        onError: async error => {
            if (error.message === 'Canceled') {
                ToastAndroid.show('Upload canceled', ToastAndroid.SHORT);
                return;
            }

            await fetch(getBaseUrl() + '/api/manage/profile/complete-upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session}`,
                },
                body: JSON.stringify({
                    status: 'FAILED',
                }),
            });

            ToastAndroid.show('Error uploading image', ToastAndroid.SHORT);
        },
    });

    if (isPending) {
        return (
            <View className='flex-1 items-center gap-4'>
                <View className='size-24 items-center justify-center rounded-full bg-primary'>
                    <View className='animate-spin'>
                        <AntDesign color='white' name='loading1' size={48} />
                    </View>
                </View>

                <Button disabled={isPending} size='sm' variant='link'>
                    <Text>Change Image</Text>
                </Button>
            </View>
        );
    }

    const isDefaultAvatar = profileImage === null;
    const defaultAvatar = (
        <View className='size-24 rounded-full bg-primary p-2'>
            <AntDesign
                color='white'
                name='user'
                size={72}
                style={{
                    borderRadius: 100,
                }}
            />
        </View>
    );

    return (
        <View className='flex-1 items-center gap-4'>
            <Pressable
                onPress={() => setProfileImage()}
                disabled={isPending}
                className='flex-1 items-center'>
                {isDefaultAvatar ? (
                    defaultAvatar
                ) : (
                    <Avatar alt={`${name}'s Avatar`} className='size-24'>
                        <AvatarImage
                            source={{
                                uri: `${profileImage}?${Date.now()}`,
                                height: 96,
                                width: 96,
                            }}
                            className='size-full rounded-full object-cover'
                        />
                        <AvatarFallback>{defaultAvatar}</AvatarFallback>
                    </Avatar>
                )}
            </Pressable>
            <Button onPress={() => setProfileImage()} disabled={isPending} size='sm' variant='link'>
                <Text>Change Image</Text>
            </Button>
        </View>
    );
}
