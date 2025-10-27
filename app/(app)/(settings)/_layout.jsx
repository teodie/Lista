import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context'

export default function AuthLayout() {

  return (
    <Stack >
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='name' options={{ headerShown: false }} />
      <Stack.Screen name='changepass' options={{
        title: 'Change Password',
      }} />
    </Stack>
  );
}
