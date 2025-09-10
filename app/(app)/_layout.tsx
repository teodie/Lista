import { Stack } from 'expo-router';
import 'react-native-reanimated';
import Payment from '@/components/Payment';

export default function ScreenLayout() {

  return (
      <Stack>
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen name='items' options={{ headerShown: true, title: 'Details', headerRight: () => <Payment />, headerStyle: { backgroundColor: '#5959B2' } }} />
      </Stack>

  );
}
