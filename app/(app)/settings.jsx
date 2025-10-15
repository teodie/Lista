import { View, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ActivityIndicator, Text } from 'react-native-paper'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useAuth } from '@/utils/auth-context'
import { account } from '@/utils/appWrite'


export default function Settings() {
  const { signOut, user } = useAuth()
  const firstName = user.prefs?.given_name.charAt(0).toUpperCase() + user.prefs?.given_name.slice(1)
  const lastName = user.prefs?.family_name.charAt(0).toUpperCase() + user.prefs?.family_name.slice(1)

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.avatarContainer} >
        {
          user.prefs.picture
            ? <>
              <Image style={{ height: 90, width: 90, borderRadius: 65 }} src={user.prefs?.picture} />
              <Text variant='headlineLarge'>{`${firstName} ${lastName}`}</Text>
            </>
            : <>
              <Ionicons name="person-circle-sharp" size={90} color='#5959B2' />
              <Text variant='headlineLarge'>{`${user.name}`}</Text>
            </>
        }


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