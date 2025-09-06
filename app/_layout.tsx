import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme } from '@/hooks/useColorScheme';
import Payment from '@/components/Payment';
import { PersonDataContext } from '@/context';
import { useState } from 'react';
import {MODE} from '../constants/mode'

export default function RootLayout() {
  const [personData, setPersonData] = useState({})
  const [utang, setUtang] = useState([])
  const [mode, setMode] = useState(MODE.IDLE)
  const [archieveVisible, setArchieveVisible] = useState(false)
  

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GestureHandlerRootView>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <PersonDataContext.Provider value={ {personData , setPersonData, mode, setMode, utang, setUtang, archieveVisible, setArchieveVisible }} >
          <Stack>
            {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
            <Stack.Screen name='index' options={{ headerShown: false }} />
            <Stack.Screen name='items' options={{ headerShown: true, title: 'Details', headerRight: () => <Payment />, headerStyle: { backgroundColor: '#5959B2' } }} />
          </Stack>
        </PersonDataContext.Provider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
