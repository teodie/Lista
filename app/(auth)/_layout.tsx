import { Stack } from 'expo-router';
import 'react-native-reanimated';


export default function AuthLayout() {

  return (
    <Stack>
      <Stack.Screen name='login' options={{ headerShown: false }} />
      <Stack.Screen name='signup' options={{ headerShown: false }} />
      <Stack.Screen name='fpass' options={{ headerShown: true, title: "Recover" , statusBarStyle: 'dark'}} />
      <Stack.Screen name='waiting' options={{ headerShown: false }} />
    </Stack>
  );
}
