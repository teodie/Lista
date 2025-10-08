import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import React, { useState } from 'react'
import { Text, TextInput, SegmentedButtons, Button } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { MaterialIcons } from '@expo/vector-icons'

const add = () => {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [permissionResponse, mediaRequestPermission] = MediaLibrary.usePermissions();

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [value, setValue] = useState('')


  const handleAvatarPress = async () => {
    if (permissionResponse.status !== 'granted') {
      await mediaRequestPermission();
    }

    if (!permission.granted) {
      requestPermission();
    }

  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='dark' />
      <Text variant='headlineMedium'>Add new client</Text>
      <TouchableOpacity
        onPress={handleAvatarPress}
        style={{ borderWidth: 1, alignItems: 'center', alignSelf: 'center', position: 'relative', height: 90, width: 90, borderRadius: 45 }}>
        <Image source={require('@/assets/images/avatar.png')} />
        <View style={{ borderWidth: 1, backgroundColor: 'white', borderRadius: '50%', position: 'absolute', right: -7, bottom: 10 }}>
          <MaterialIcons name='camera-alt' size={20} color='gray' style={{ padding: 5 }} />
        </View>
      </TouchableOpacity >
      <View style={styles.nameContainer}>
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
          value={lastName}
          onChangeText={setLastName}
          style={styles.nameInput}
        />

      </View>
      <Text variant='headlineMedium'>Due Date</Text>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          { value: 'weekly', label: 'Weekly', },
          { value: 'biweekly', label: 'Biweekly', },
          { value: 'montly', label: 'Monthly' },
        ]}
      />
      <Text variant='headlineMedium'>Select Day</Text>
      <Button mode='outlined'>Pick Day</Button>
    </SafeAreaView>
  )
}

export default add

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
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