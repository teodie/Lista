import { Redirect, Slot, Stack } from 'expo-router';
import 'react-native-reanimated';
import Payment from '@/components/Payment';
import { router, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/utils/auth-context'
import { ClientProvider } from '@/utils/client-context';
import { ItemsProvider } from '@/utils/items-context';

function RouteGaurd({ children }: { children: React.ReactNode }) {
  const { user, isLoadingUser } = useAuth()
  const segments = useSegments()
  console.log(segments)

  useEffect(() => {
    const inAuthGroup = segments[0] === "login";

    if (!user && !inAuthGroup && !isLoadingUser) {
      router.replace("/login");
    } else if (user && inAuthGroup && !isLoadingUser) {
      router.replace("/");
    }
  }, [user, segments]);

  // Avoid rendering app screens until auth state is resolved to prevent flash
  if (isLoadingUser) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#5959B2" />
      </View>
    )
  }


  if (!user) {
    // Redirect will run via useEffect; render nothing to avoid index flash
    return null
  }

  return <>{children}</>
}


export default function ScreenLayout() {

  return (
    <RouteGaurd>
      <ClientProvider>
        <ItemsProvider>
          <Stack>
            <Stack.Screen name='index' options={{ headerShown: false }} />
            <Stack.Screen name='items' options={{ headerShown: true, title: 'Details', headerRight: () => <Payment />, headerStyle: { backgroundColor: '#5959B2' }, headerTintColor: 'white' }} />
          </Stack>
        </ItemsProvider>
      </ClientProvider>
    </RouteGaurd>
  );
}
