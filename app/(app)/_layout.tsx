import { Tabs, useNavigation, useRouter } from 'expo-router';
import 'react-native-reanimated';
import Payment from '@/components/Payment';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator, TouchableOpacity, StatusBar } from 'react-native';
import { useAuth } from '@/utils/auth-context'
import { ClientProvider } from '@/utils/client-context';
import { ItemsProvider } from '@/utils/items-context';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';

import { SafeAreaProvider } from 'react-native-safe-area-context';

function RouteGaurd({ children }: { children: React.ReactNode }) {
  const { user, isLoadingUser } = useAuth()

  useEffect(() => {
    if (!user && !isLoadingUser) {
      router.replace("/login");
    } else if (user && !isLoadingUser) {
      router.replace("/");
    }
  }, [user, isLoadingUser]);

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

// Back icon in the header
const BackIcon = () => (
  <MaterialIcons
    name="arrow-back"
    size={30} color="white"
    style={{ paddingHorizontal: 10 }}
    onPress={() => router.back()}
  />
)

export default function ScreenLayout() {
  const router = useRouter()

  return (
    <SafeAreaProvider>
      <RouteGaurd>
        <ClientProvider>
          <ItemsProvider>
            <Tabs screenOptions={{ tabBarActiveTintColor: '#5959B2' }}>
              <Tabs.Screen
                name='index'
                options={{
                  title: "Home",
                  tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                  headerShown: false,
                }}
              />

              <Tabs.Screen
                name='items'
                options={{
                  headerBackButtonDisplayMode: 'default',
                  headerShown: true,
                  title: 'Details',
                  headerLeft: () => <BackIcon />,
                  headerRight: () => <Payment />,
                  headerStyle: { backgroundColor: '#5959B2' },
                  headerTintColor: 'white',
                  href: null,
                }} />

              <Tabs.Screen
                name='analytics'
                options={{
                  title: 'Analytics',
                  tabBarIcon: ({ color }) => <MaterialIcons name="analytics" size={24} color={color} />,
                  headerShown: false
                }} />

              <Tabs.Screen
                name='record'
                options={{
                  title: 'Record',
                  tabBarIcon: ({ color, focused }) =>
                    <TouchableOpacity
                      onPress={() => { router.navigate('/(app)/voicetype') }}
                      style={{ height: 70, width: 70, alignItems: 'center', justifyContent: 'center', borderRadius: 35, position: 'absolute', bottom: 0, backgroundColor: '#5959B2', overflow: 'hidden' }}
                    >
                      <MaterialIcons name="mic" size={40} color="white" />
                    </TouchableOpacity>,
                  headerShown: false,
                }}
              />

              <Tabs.Screen
                name='add'
                options={{
                  headerTitle: 'Create new client',
                  tabBarIcon: ({ color }) => <Ionicons name="person-add" size={24} color={color} />,
                  headerShown: true,
                  headerTintColor: 'white',
                  headerStyle: { backgroundColor: '#5959B2' },
                  headerTitleAlign: 'center'
                }}

              />

              <Tabs.Screen
                name='settings'
                options={{
                  title: 'Settings',
                  tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
                  headerShown: false,
                }} />


              <Tabs.Screen
                name='voicetype'
                options={{
                  headerTitleAlign: 'center',
                  title: 'Add Items',
                  headerShown: true,
                  headerTintColor: 'white',
                  headerLeft: () => <BackIcon />,
                  headerStyle: {backgroundColor: '#5959B2'},
                  href: null,
                  tabBarStyle: {display: 'none'}
                }}
              />
            </Tabs>
          </ItemsProvider>
        </ClientProvider>
      </RouteGaurd>
    </SafeAreaProvider>
  );
}
