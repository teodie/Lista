import { Stack } from 'expo-router';
import 'react-native-reanimated';

export default function AuthLayout() {

  return (
    <Stack >
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='name' options={{ headerShown: false }} />
      <Stack.Screen name='restore' options={{ headerShown: false }} />
      <Stack.Screen name='changepass' options={{
        title: 'Change Password',
      }} />
    </Stack>
  );
}
