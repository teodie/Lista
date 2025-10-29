import { View, Image, StyleSheet, TouchableOpacity, Alert, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ActivityIndicator, Button, Divider, Text } from 'react-native-paper'
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons'
import { useAuth } from '@/utils/auth-context'
import { account } from '@/utils/appWrite'
import { useRouter } from 'expo-router'
import SettingList from '@/components/settingList'

const sampleData = [
  { icon: 'person-outline', title: 'Name', navigate: 'name' },
  { icon: 'lock-outline', title: 'Change Password', navigate: 'changepass' },
]

export default function Settings() {
  const { signOut, user } = useAuth()


  const firstName = user.prefs.given_name?.charAt(0).toUpperCase() + user.prefs.given_name?.slice(1)
  const lastName = user.prefs.family_name?.charAt(0).toUpperCase() + user.prefs?.family_name?.slice(1)

  const router = useRouter()

  return (
    <SafeAreaView style={{
      paddingHorizontal: 10,
      borderWidth: 1,
      flex: 1,
    }}>
      <View >
        <Pressable onPress={() => { router.back() }} >
          <Entypo name="chevron-left" size={40} color="black" />
        </Pressable>
        <View style={styles.avatarContainer} >
          {
            user.prefs.picture
              ? <>
                <Image style={{ height: 90, width: 90, borderRadius: 65 }} src={user.prefs?.picture} />
                <Text variant='titleLarge'
                  style={{ fontWeight: 700 }}
                >{`${firstName} ${lastName}`}</Text>
                <Text variant='bodyLarge'
                // style={{fontWeight: 700}}
                >{user.email}</Text>
              </>
              : <>
                <Ionicons name="person-circle-sharp" size={90} color='#5959B2' />
                <Text variant='headlineLarge'>{`${user.name}`}</Text>
              </>
          }
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <View style={{
          backgroundColor: 'white',
          borderRadius: 20
        }}>
          {
            sampleData.map((item, index) => {

              return <View  key={index} >
                <SettingList icon={item.icon} title={item.title} navigate={item.navigate}/>
                {
                  index !== sampleData.length - 1 && <Divider />
                }
              </View>

            }
            )
          }
        </View>

      </View>

      <Button
        mode='contained'
        icon='logout'
        textColor='#DB5C72'
        buttonColor='#F7E4EA'
        onPress={signOut}
      >Log out</Button>
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

})