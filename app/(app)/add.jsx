import { Alert, Image, Keyboard, Linking, ScrollView, StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import React, { useState } from 'react'
import { Text, TextInput, Button } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/utils/auth-context';
import { useNavigation } from 'expo-router';
import { useClient } from '@/utils/client-context';
import { ID, Permission, Role } from 'react-native-appwrite';
import { storage } from '@/utils/appWrite';
import Ionicons from '@expo/vector-icons/Ionicons';
import KeyBoardDismisView from '@/components/KeyBoardDismis';

const add = () => {
  const [cameraPermission, setCameraPermission] = useCameraPermissions();
  const [mediaPermission, setMediaPermission] = MediaLibrary.usePermissions();


  const [image, setImage] = useState(null)
  const [daySelected, setDaySelected] = useState([])
  const { createClient, clients } = useClient()
  const navigation = useNavigation()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const [bottomSheet, showBottomSheet] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [limit, setLimit] = useState("7000")

  const nameAlreadyExist = (name) => {
    const nameAlreadyExist = clients.find((item) => item.name.toLowerCase() === name.trim().toLowerCase())
    return nameAlreadyExist ? true : false;
  }

  const saveClientImageToStorage = async (id) => {
    console.log("Saving the image: ", JSON.stringify(image, null, 2))
    console.log("ID: ", id)

    try {
      const result = await storage.createFile(
        process.env.EXPO_PUBLIC_BUCKET_ID,
        id,
        image,
        [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ]
      )

      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSavePress = async () => {
    // Validation code needed
    if (firstName.trim() === "") return Alert.alert("Firstname Field is empty")
    if (lastName.trim() === "") return Alert.alert("Lastname Field is empty")

    const name = firstName.trim().toLowerCase() + " " + lastName.trim().toLowerCase()
    const id = ID.unique()

    if (nameAlreadyExist(name)) return Alert.alert("Name already exist")

    setLoading(true)
    if (image) {
      await saveClientImageToStorage(id)
    }
    await createClient(name, id, parseInt(limit), daySelected)
    setLoading(false)

    navigation.navigate('index')
    setFirstName('')
    setLastName('')
    setImage(null)
  }

  const extractImageData = (fileInfo) => {
    const data = {
      name: fileInfo.fileName,
      type: fileInfo.mimeType,
      size: 4000000,
      uri: fileInfo.uri,
    }

    return data
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
        const data = extractImageData(result.assets[0])

        setImage(data)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const takeAPhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        cameraType: 'back',
        allowsEditing: true,
      })

      if (!result.canceled) {
        const data = extractImageData(result.assets[0])

        setImage(data)
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

          <View style={{ height: 5, backgroundColor: 'gray', width: 50, alignSelf: 'center', borderRadius: 2.5, marginTop: 10, marginBottom: 10 }} />
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
    <KeyBoardDismisView>
      <View style={{ position: 'relative', flex: 1 }}>

        {
          loading
          && <View style={{ backgroundColor: 'white', borderWidth: 1, position: 'absolute', bottom: 0, top: 0, left: 0, right: 0, zIndex: 4, alignItems: 'center', justifyContent: 'center', gap: 20 }}>
            <Text variant="titleLarge" style={{ color: '#5959B2' }}>Please wait</Text>
            <ActivityIndicator size='large' color='#5959B2' />
          </View>
        }


        <View style={{ paddingHorizontal: 10, backgroundColor: bottomSheet ? 'black' : '', opacity: bottomSheet ? .2 : 1 }}>
          <TouchableOpacity
            onPress={handleAvatarPress}
            style={{ alignItems: 'center', alignSelf: 'center', position: 'relative', height: 90, width: 90, borderRadius: 45, marginBottom: 20 }}>

            {image
              ? <Image source={{ uri: image.uri }} style={{ height: 90, width: 90, borderRadius: 45, }} />
              : <Ionicons name="person-circle-sharp" size={90} color='#5959B2' />
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
    </KeyBoardDismisView>
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