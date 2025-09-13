import { Stack } from 'expo-router';
import 'react-native-reanimated';
import Payment from '@/components/Payment';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/utils/auth-context'

function RouteGaurd({ children }: { children: React.ReactNode }) {
  const { user, isLoadingUser } = useAuth()

  useEffect(() => {

    if (!user && !isLoadingUser) {
      router.replace('/login')
    }
  }, [user, isLoadingUser])

  // Avoid rendering app screens until auth state is resolved to prevent flash
  if (isLoadingUser) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large"  color="#5959B2"/>
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
      <Stack>
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen name='items' options={{ headerShown: true, title: 'Details', headerRight: () => <Payment />, headerStyle: { backgroundColor: '#5959B2' } }} />
      </Stack>
    </RouteGaurd>
  );
}
