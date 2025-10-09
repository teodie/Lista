import { Alert, Image, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import React, { useState, useEffect, useRef } from 'react'
import { Text, TextInput, SegmentedButtons, Button } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'

const add = () => {
  const [facing, setFacing] = useState('back');
  const [cameraPermission, setCameraPermission] = useCameraPermissions();
  const [mediaPermission, setMediaPermission] = MediaLibrary.usePermissions();

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [limit, setLimit] = useState("7000")

  const handleAvatarPress = async () => {

    console.log("Camera Permission: ", cameraPermission)
    console.log("Camera Permission: ", mediaPermission)

    if (!cameraPermission.granted || !mediaPermission.granted) {
      Alert.alert(
        'Persmission needed',
        'Please enable the permission in the app settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'ok',
            style: 'default',
            onPress: () => { Linking.openSettings() }
          },
        ]
      )
    }
    await setCameraPermission()
    await setMediaPermission()
  }

  const Calindar = () => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const [daySelected, setDaySelected] = useState([30])

    return (
      <View style={{ alignItems: 'center', alignSelf: 'center', borderWidth: 1, marginVertical: 20, borderRadius: 10 }}>
        <View style={{ alignSelf: 'stretch', alignItems: 'center', paddingVertical: 10, backgroundColor: '#5959B2', borderTopLeftRadius: 9, borderTopRightRadius: 9 }}>
          <Text variant='titleSmall' style={{ color: 'white' }}>Payment schedule</Text>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 300 }}>

          {days.map((day) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (daySelected.includes(day)) {
                    const filtered = daySelected.filter((number) => number !== day)
                    console.log("filtered: ", filtered)
                    return setDaySelected(filtered)
                  }

                  setDaySelected([...daySelected, day])
                }}
                key={day.toString()}
                style={{ width: 30, height: 50, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {daySelected.includes(day) &&
                  <View style={{ height: 20, width: 20, borderRadius: 10, position: 'absolute', backgroundColor: '#5959B2' }}></View>
                }
                <Text style={{ color: daySelected.includes(day) ? 'white' : 'black' }}>{day}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <TouchableOpacity
        onPress={handleAvatarPress}
        style={{ alignItems: 'center', alignSelf: 'center', position: 'relative', height: 90, width: 90, borderRadius: 45, marginBottom: 20 }}>
        <Image source={require('@/assets/images/avatar.png')} />
        <View style={{ backgroundColor: 'white', borderRadius: '50%', position: 'absolute', right: -7, bottom: 10 }}>
          <MaterialIcons name='camera-alt' size={20} color='gray' style={{ padding: 5 }} />
        </View>
      </TouchableOpacity >
      <TextInput
        mode='outlined'
        label='First Name'
        value={firstName}
        onChangeText={setFirstName}
        style={styles.nameInput}
      />

      <TextInput
        mode='outlined'
        label='Last Name'
        keyboardType='numeric'
        value={lastName}
        onChangeText={setLastName}
        style={styles.nameInput}
      />
      <Text
        style={{
          alignSelf: 'center',
          marginTop: 20,
          color: '#5959B2',
          fontWeight: '800'
        }}
        variant='titleLarge'
      >
        Credit Limit
      </Text>

      <TextInput
        style={{ width: 100, alignSelf: 'center' }}
        mode='outlined'
        label='Limit'
        value={limit}
        keyboardType='numeric'
        onChangeText={setLimit}
      />

      {true && <Calindar />}
      <Button mode='contained' style={{ marginBottom: 90, backgroundColor: '#5959B2' }}>Save</Button>
    </ScrollView>
  )
}

export default add

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  nameInput: {
    flex: 1
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 15,
  },
})