import { Stack } from 'expo-router';
import 'react-native-reanimated';
import Payment from '@/components/Payment';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '@/utils/auth-context'

function RouteGaurd({ children }: { children: React.ReactNode }) {
  const { user, isLoadingUser } = useAuth()


  useEffect(() => {
    console.log('User:', user, 'Loading:', isLoadingUser)

    if (!user && !isLoadingUser) {
      router.replace('/login')
    }
  }, [user, isLoadingUser])
  
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
