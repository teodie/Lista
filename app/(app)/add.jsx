import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import React, { useState } from 'react'
import { Text, TextInput, SegmentedButtons, Button } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialIcons } from '@expo/vector-icons'

const add = () => {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [permissionResponse, mediaRequestPermission] = MediaLibrary.usePermissions();

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [value, setValue] = useState('')
  const [showCalindar, setShowCalindar] = useState(false)


  const handleAvatarPress = async () => {
    if (permissionResponse.status !== 'granted') {
      await mediaRequestPermission();
    }

    if (!permission.granted) {
      requestPermission();
    }

  }

  const Calindar = () => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const [daySelected, setDaySelected] = useState([30])

    return (
      <View style={{ alignItems: 'center', alignSelf: 'center', borderWidth: 1, marginVertical: 20, borderRadius: 10 }}>
        <View style={{ alignSelf: 'stretch', alignItems: 'center', paddingVertical: 10, backgroundColor: 'gray', borderTopLeftRadius: 9, borderTopRightRadius: 9 }}>
          <Text variant='titleSmall' style={{ color: 'white' }}>Pick a day</Text>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 300 }}>
          {days.map((day) => {
            return (
              <TouchableOpacity 
              onPress={() => {
                if(daySelected.includes(day)){
                  const filtered = daySelected.filter((number) => number !== day)
                  console.log("filtered: ", filtered)
                  return setDaySelected(filtered)
                }
              
                setDaySelected([...daySelected, day])
              }}
              key={day.toString()} 
              style={{ width: 30, height: 50, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                { daySelected.includes(day) &&
                <View style={{borderWidth: 1, height: 20, width: 20, borderRadius: 10, position: 'absolute', backgroundColor: 'rgba(50, 252, 252, 1)'}}></View>
                }

                <Text>{day}</Text>
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
            value={lastName}
            onChangeText={setLastName}
            style={styles.nameInput}
          />

<Text variant='headlineMedium'>Limit</Text>
             <TextInput
            mode='outlined'
            label='limit'
            value={firstName}
            onChangeText={setFirstName}
            style={styles.nameInput}
          />

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
        <Button mode='outlined' onPress={() => setShowCalindar(prev => !prev)}>Pick Day</Button>
        {true && <Calindar />}
        <Button mode='contained' style={{marginBottom: 90}}>Save</Button>
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