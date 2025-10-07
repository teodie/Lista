import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import { useAuth } from '@/utils/auth-context'

export default function Settings() {
  const  { signOut, userProfile } = useAuth()
  const lastName = userProfile?.family_name.charAt(0).toUpperCase() + userProfile?.family_name.slice(1)
  const firstName = userProfile?.given_name.charAt(0).toUpperCase() + userProfile?.given_name.slice(1)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.avatarContainer} >
        <Image style={{height: 90, width: 90, borderRadius: 65}} src={userProfile?.picture}/>
        <Text variant='headlineLarge'>{`${firstName} ${lastName}`}</Text>
      </View>
      <TouchableOpacity style={styles.logout} onPress={signOut}>
        <MaterialIcons name="logout" size={35} color='red' />
        <Text variant='titleLarge' style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logoutText: {
    color: 'red'
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    borderTopWidth: 1,
    borderTopColor: 'gray',
    paddingVertical: 5,
  }
})