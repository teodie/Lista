import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PersonDataContext } from '@/context';
import { useState, useEffect } from 'react';
import { MODE } from '@/constants/mode'
import AuthProvider from '@/utils/auth-context'


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
            <Stack>
              <Stack.Screen name='(auth)' options={{ headerShown: false }} />
              <Stack.Screen name='(app)' options={{ headerShown: false }} />
            </Stack>
        </AuthProvider>
      </PersonDataContext.Provider>
    </GestureHandlerRootView >
  );
}
