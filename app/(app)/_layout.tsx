import { Tabs, useNavigation, useRouter } from 'expo-router';
import 'react-native-reanimated';
import Payment from '@/components/Payment';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { View, ActivityIndicator, TouchableOpacity, StatusBar } from 'react-native';
import { useAuth } from '@/utils/auth-context'
import { ClientProvider } from '@/utils/client-context';
import { ItemsProvider } from '@/utils/items-context';
import { FontAwesome, MaterialIcons, Feather, Entypo } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';

import { SafeAreaProvider } from 'react-native-safe-area-context';

function RouteGaurd({ children }: { children: React.ReactNode }) {
  const { user, isLoadingUser } = useAuth()

  useEffect(() => {
    if (!user && !isLoadingUser) {
      router.replace("/login");
    } else if (user && !isLoadingUser) {
      router.replace("/(settings)/changepass");
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
                  headerTitleAlign: 'center',
                  headerShown: true,
                  title: 'Transactions',
                  headerLeft: () => <BackIcon />,
                  headerRight: () =>
                    <View style={{ flexDirection: 'row', margin: 10, gap: 15 }}>
                      <Feather name="download" size={24} color="white" />
                      <Entypo name="dots-three-vertical" size={24} color="white" />
                    </View>,
                  headerStyle: { backgroundColor: '#5959B2' },
                  headerTintColor: 'white',
                  href: null,
                  tabBarStyle: { display: 'none' }
                }} />

              <Tabs.Screen
                name='add'
                options={{
                  title: 'Add',
                  headerTitle: 'Create new client',
                  tabBarIcon: ({ color }) => <Ionicons name="person-add" size={24} color={color} />,
                  headerShown: true,
                  headerTintColor: 'white',
                  headerStyle: { backgroundColor: '#5959B2' },
                  headerTitleAlign: 'center',
                }}

              />

              <Tabs.Screen
                name='(settings)'
                options={{
                  title: 'Settings',
                  tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
                  headerShown: false,
                  tabBarStyle: { display: 'none' },
                }} />

            </Tabs>
          </ItemsProvider>
        </ClientProvider>
      </RouteGaurd>
    </SafeAreaProvider>
  );
}
