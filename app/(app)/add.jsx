import { Alert, Image, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import React, { useState } from 'react'
import { Text, TextInput, Button } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/utils/auth-context';
import { useNavigation } from 'expo-router';
import { useClient } from '@/utils/client-context';
import { ID } from 'react-native-appwrite';

const add = () => {
  const [cameraPermission, setCameraPermission] = useCameraPermissions();
  const [mediaPermission, setMediaPermission] = MediaLibrary.usePermissions();
  const [image, setImage] = useState(null)
  const { createClient } = useClient()
  const { user } = useAuth()
  const navigation = useNavigation()

  const [bottomSheet, showBottomSheet] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [limit, setLimit] = useState("7000")

  const handleSavePress = () => {
    const name = firstName.trim().toLowerCase() + " " + lastName.trim().toLowerCase()
    createClient(name, ID.unique())
    navigation.navigate('index')
    setFirstName('')
    setLastName('')
    setImage(null)
  }

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
        defaultTab: 'photos'
      })

      if (!result.canceled) {
        setImage(`${result.assets[0].uri}`)
      }

    } catch (error) {
      console.error(error)
    }
  }

  const takeAPhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        cameraType: 'back',
        allowsEditing: true,
      })

      console.log(JSON.stringify(result, null, 2))

      if (!result.canceled) {
        setImage(`${result.assets[0].uri}`)
      }
    } catch (error) {
      console.log(error)
    }

  }

  const askCameraPermission = async () => {
    try {
      if (cameraPermission.granted) return console.log("Camera permission granted")
      // Ask for camera permission
      await setCameraPermission()
    } catch (error) {
      console.log(error)
    }
  }

  const askMediaPermission = async () => {
    try {
      if (mediaPermission.granted) return console.log("Media permission granted")
      // Ask for Media permission
      await setMediaPermission()
    } catch (error) {
      console.log(error)
    }
  }

  const checkIfCanAskAgain = () => {
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
  }

  const handleAvatarPress = () => {
    // console.log("camera: ", JSON.stringify(cameraPermission, null, 2))
    // console.log("media: ", JSON.stringify(mediaPermission, null, 2))
    hideTabBar()
    showBottomSheet(true)
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

  const BottomSheet = () => {

    const handleUploadPress = () => {
      askMediaPermission()
      pickImage()
      showBottomSheet(false)
      showTabBar()
    }

    const handleTakeAPhotoPress = () => {
      askCameraPermission()
      takeAPhoto()
      showBottomSheet(false)
      showTabBar()
    }

    return (
      <View style={{ backgroundColor: 'rgba(61, 55, 55, 0.23)', zIndex: 1 }}>
        <View style={{ width: '100%', backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 10, zIndex: 2 }}>

          <View style={{ height: 5, backgroundColor: 'gray', width: 50, alignSelf: 'center', borderRadius: 2.5, marginTop: 10, marginBottom: 20 }} />
          <Button mode='outlined' onPress={handleTakeAPhotoPress} style={{ marginBottom: 20 }}>Take a photo</Button>
          <Button mode='outlined' onPress={handleUploadPress} style={{ marginBottom: 30 }} >Upload</Button>
        </View>

      </View>
    )
  }

  const hideTabBar = () => {
    navigation.setOptions({ tabBarStyle: { display: 'none' } });
  }

  const showTabBar = () => {
    navigation.setOptions({ tabBarStyle: { display: 'flex' } })
  }

  return (
    <View>

      <View style={{ paddingHorizontal: 10, backgroundColor: bottomSheet ? 'black' : '', opacity: bottomSheet ? .2 : 1 }}>
        <TouchableOpacity
          onPress={handleAvatarPress}
          style={{ alignItems: 'center', alignSelf: 'center', position: 'relative', height: 90, width: 90, borderRadius: 45, marginBottom: 20 }}>
          {image
            ? <Image source={{ uri: image }} style={{ height: 90, width: 90, borderRadius: 45, }} />
            : <Image source={require('@/assets/images/avatar.png')} />
          }

          <View style={{ backgroundColor: 'white', borderRadius: '50%', position: 'absolute', right: -7, bottom: 10 }}>
            <MaterialIcons name='camera-alt' size={20} color='gray' style={{ padding: 5 }} />
          </View>
        </TouchableOpacity >
        <TextInput
          mode='outlined'
          label='First Name'
          value={firstName}
          onChangeText={setFirstName}
        />

        <TextInput
          mode='outlined'
          label='Last Name'
          value={lastName}
          onChangeText={setLastName}
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

        <Calindar />

        <Button mode='contained' onPress={handleSavePress} style={{ backgroundColor: '#5959B2' }}>Save</Button>
      </View>

      {bottomSheet && <BottomSheet />}
    </View>
  )
}

export default add

const styles = StyleSheet.create({
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 15,
  },
})