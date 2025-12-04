import { Alert, Image, Keyboard, Linking, ScrollView, StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback, ActivityIndicator, Pressable } from 'react-native'
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
import BottomSheet from '@/components/BottomSheet';
import { useSharedValue } from 'react-native-reanimated';
import NoInternet from '@/components/NoInternet';

const add = () => {
  const [cameraPermission, setCameraPermission] = useCameraPermissions();
  const [mediaPermission, setMediaPermission] = MediaLibrary.usePermissions();


  const [image, setImage] = useState(null)
  const { createClient, clients } = useClient()
  const navigation = useNavigation()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const isOpen = useSharedValue(false);

  const bottomSheetVisible = (value) => {
    isOpen.value = value
  };

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

  // fetch the client avatar url from appwrite
  const fetchClientAvatar = async (id) => {
    try {
      const response = storage.getFileViewURL(
        process.env.EXPO_PUBLIC_BUCKET_ID,
        id,
      ).href

      return response
    } catch (error) {
      console.log(error)
      setAvatar('')
    }
  }

  const handleSavePress = async () => {
    let name
    if (firstName.trim() === "") return Alert.alert("Firstname Field is empty")

    if (lastName.trim() === "") {
      name = firstName.trim().toLowerCase()
    } else {
      name = firstName.trim().toLowerCase() + " " + lastName.trim().toLowerCase()
    }

    const id = ID.unique()

    if (nameAlreadyExist(name)) return Alert.alert("Name already exist")

    let avatar = null
    setLoading(true)
    if (image) {
      await saveClientImageToStorage(id)
      // fetch the newly created image uri
      avatar = await fetchClientAvatar(id)
    }

    await createClient(name, id, avatar)
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


  const handleUploadPress = () => {
    askMediaPermission()
    pickImage()
    bottomSheetVisible(false)
    showTabBar()
  }

  const handleTakeAPhotoPress = () => {
    askCameraPermission()
    takeAPhoto()
    bottomSheetVisible(false)
    showTabBar()
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

        <NoInternet />
        
        <View style={{ paddingHorizontal: 10 }}>
          <TouchableOpacity
            onPress={() => {
              hideTabBar()
              bottomSheetVisible(true)
            }}
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
            label='Last Name (Optional)'
            value={lastName}
            onChangeText={setLastName}
          />

          <Button mode='contained' onPress={handleSavePress} style={{ backgroundColor: '#5959B2', marginTop: 10 }}>Save</Button>
        </View>

        <BottomSheet isOpen={isOpen} bottomSheetVisible={bottomSheetVisible}>
          <Button mode='outlined' onPress={handleTakeAPhotoPress} style={{ marginBottom: 20 }}>Take a photo</Button>
          <Button mode='outlined' onPress={handleUploadPress} style={{ marginBottom: 30 }} >Upload</Button>
        </BottomSheet>

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
  buttonContainer: {
    marginTop: 16,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  bottomSheetButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 2,
  },
  bottomSheetButtonText: {
    fontWeight: 600,
    textDecorationLine: 'underline',
  },
})