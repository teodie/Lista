import { Stack, useSegments } from 'expo-router';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthProvider from '@/utils/auth-context'
import DataProvider from '@/utils/userdata-context'
import { KeyboardProvider } from 'react-native-keyboard-controller'

export default function RootLayout() {
  const segment = useSegments()
  return (
    <GestureHandlerRootView>
      <DataProvider>
        <AuthProvider>
          <KeyboardProvider>
            <Stack>
              <Stack.Screen name='(app)' options={{
                headerShown: false,
                statusBarStyle: segment.includes("add") || segment.length === 1 ? 'light' : 'dark'
              }} />
              <Stack.Screen name='(auth)' options={{ headerShown: false }} />
            </Stack>
          </KeyboardProvider>
        </AuthProvider>
      </DataProvider>
    </GestureHandlerRootView >
  );
}
