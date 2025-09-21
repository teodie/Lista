import { Stack } from 'expo-router';
import 'react-native-reanimated';


export default function TestLayout() {

  return (
    <Stack>
      <Stack.Screen name='online' options={{ headerShown: false }} />
      <Stack.Screen name='camera' options={{ headerShown: false }} />
      <Stack.Screen name='print' options={{ headerShown: false }} />
      <Stack.Screen name='notif' options={{ headerShown: false }} />
      <Stack.Screen name='location' options={{ headerShown: false }} />
      <Stack.Screen name='docpic' options={{ headerShown: false }} />
      <Stack.Screen name='medialib' options={{ headerShown: false }} />
      <Stack.Screen name='datepick' options={{ headerShown: false }} />
      <Stack.Screen name='biometrics' options={{ headerShown: false }} />
    </Stack>
  );
}
