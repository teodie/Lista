import { View, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ActivityIndicator, Text } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import { useAuth } from '@/utils/auth-context'
import { account } from '@/utils/appWrite'

export default function Settings() {
  const { signOut, user } = useAuth()

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.avatarContainer} >
        <Image style={{ height: 90, width: 90, borderRadius: 65 }} src={user.prefs?.picture} />
        <Text variant='headlineLarge'>{`${user.prefs?.given_name} ${user.prefs?.family_name}`}</Text>
      </View>

      <TouchableOpacity style={styles.logout} onPress={signOut}>
        <MaterialIcons name="logout" size={35} color='white' />
        <Text variant='titleLarge' style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    flex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logoutText: {
    color: 'white'
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 5,
    borderRadius: 5,
    paddingLeft: 15,
    backgroundColor: '#5959B2',
    marginBottom: 20,
  }
})