import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PersonDataContext } from '@/context';
import { useState, useEffect } from 'react';
import { MODE } from '@/constants/mode'
import { router } from 'expo-router';
import AuthProvider from '@/utils/auth-context'


function RouteGaurd({ children }: { children: React.ReactNode }) {
  const isAuth = false

  useEffect(() => {
    if (!isAuth) {
      // router.replace('/login')
      const timer = setTimeout(() => {
        router.navigate('/login')
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isAuth])

  return <>{children}</>
}


export default function RootLayout() {
  const [personData, setPersonData] = useState({})
  const [utang, setUtang] = useState([])
  const [mode, setMode] = useState(MODE.IDLE)
  const [archieveVisible, setArchieveVisible] = useState(false)

  return (
    <GestureHandlerRootView>
      <PersonDataContext.Provider value={{ personData, setPersonData, mode, setMode, utang, setUtang, archieveVisible, setArchieveVisible }} >
        <AuthProvider>
          <StatusBar style='light' />
          <RouteGaurd>
            <Stack>
              <Stack.Screen name='(app)' options={{ headerShown: false }} />
              <Stack.Screen name='login' options={{ headerShown: false }} />
              <Stack.Screen name='signup' options={{ headerShown: false }} />
            </Stack>
          </RouteGaurd>
        </AuthProvider>
      </PersonDataContext.Provider>
    </GestureHandlerRootView >
  );
}
