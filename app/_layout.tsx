import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthProvider from '@/utils/auth-context'
import DataProvider from '@/utils/userdata-context'

export default function RootLayout() {

  return (
    <GestureHandlerRootView>
      <DataProvider> 
        <AuthProvider>
          <StatusBar style='light' />
          <Stack>
            <Stack.Screen name='(auth)' options={{ headerShown: false }} />
            {/* <Stack.Screen name='(app)' options={{ headerShown: false }} /> */}
          </Stack>
        </AuthProvider>
      </DataProvider>
    </GestureHandlerRootView >
  );
}
