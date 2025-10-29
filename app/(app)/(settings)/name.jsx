import { View, Text, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { Button, TextInput, useTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardProvider, KeyboardStickyView, useKeyboardState } from 'react-native-keyboard-controller'
import KeyBoardDismisView from '@/components/KeyBoardDismis'
import { useAuth } from '@/utils/auth-context'
import { useRouter } from 'expo-router'
import { account } from '@/utils/appWrite'

const name = () => {
  const { user, getUser } = useAuth()
  const [name, setName] = useState(user.name)
  const [nameError, setNameError] = useState('')
  const theme = useTheme()
  const keyboardIsVisible = useKeyboardState((state) => state.isVisible)
  const router = useRouter()
  
  const newNameIsValid = () => {
    if(name.trim() === ''){
      setNameError("New name is empty")
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if(!newNameIsValid) return
    
    try {
      const result = await account.updateName(name)
      Alert.alert("Name has been successfully updated")
      router.back()

    } catch (error) {
      console.log
    } finally {
      await getUser()
    }
  }

  return (
    <KeyboardProvider>
      <KeyBoardDismisView>
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 10}}>

          <View style={{
            alignItems: 'center',
            opacity: keyboardIsVisible ? 0.1 : 1,
          }}>
            <Image
              source={require('@/assets/images/change-name.png')}
              style={{ height: 350, width: 350 }}
            />
          </View>
          <KeyboardStickyView style={{
            marginTop: 20,
            flex: 1,
          }}
            offset={{ closed: 0, opened: 200 }}
          >
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 30,
                fontWeight: 700,
              }}>Change Username</Text>
              <Text style={{
                textAlign: 'center',
                fontSize: 12,
              }}>Your user name will be updated.</Text>
            </View>

            <TextInput
              style={{ marginTop: 10 }}
              outlineColor={nameError !== '' ? theme.colors.error : null}
              mode='outlined'
              label='New name'
              value={name}
              onChangeText={setName}
            />
            {
              nameError !== '' && <Text style={{ color: theme.colors.error }}>{nameError}</Text>
            }

            <Button
              onPress={handleSubmit}
              style={{ marginTop: 15 }}
              mode='contained'>Confirm</Button>
          </KeyboardStickyView>

        </SafeAreaView>
      </KeyBoardDismisView>
    </KeyboardProvider>
  )
}

export default name