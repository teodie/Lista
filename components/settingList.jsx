import { View, Text, Pressable, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const SettingList = ({ icon, title, navigate }) => {
  const router = useRouter()

  const handlePress = () => {
    router.push(`/(app)/(settings)/${navigate}`)
  }
  return (

    <TouchableOpacity
    onPress={handlePress}
    >
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
      }}>
        <View style={{
          paddingLeft: 10,
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 20
        }}>
          <MaterialIcons name={icon} size={30} color="black" />
          <Text style={{
            fontSize: 20
          }}>{title}</Text>
        </View>
        <Entypo name="chevron-right" size={30} color="gray" />
      </View>
    </TouchableOpacity>

  )
}

export default SettingList