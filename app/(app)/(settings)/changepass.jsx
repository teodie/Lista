import { View, Text, Image } from 'react-native'
import React, { useState } from 'react'
import { Button, TextInput } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardProvider, KeyboardStickyView, useKeyboardState } from 'react-native-keyboard-controller'
import KeyBoardDismisView from '@/components/KeyBoardDismis'

const changepass = () => {
  const [oldPass, setOldPass] = useState('')
  const keyboardIsVisible = useKeyboardState((state) => state.isVisible)

  return (
    <KeyboardProvider>
      <KeyBoardDismisView>
        <SafeAreaView style={{ borderWidth: 1, flex: 1, paddingHorizontal: 10 }}>

          <View style={{
            alignItems: 'center',
            opacity: keyboardIsVisible ? .1 : 1,
          }}>
            <Image
              source={require('@/assets/images/my-password.png')}
              style={{ height: 350, width: 350 }}
            />

            <Text style={{
              fontSize: 30,
              fontWeight: 700,
            }}>Change Password</Text>
            <Text style={{
              textAlign: 'center',
              fontSize: 12,
            }}>Please ensure that the new password is defferent from the previous passwords that you have been used.</Text>
          </View>
          <KeyboardStickyView style={{
            marginTop: 20,
            gap: 15,
            flex: 1,
          }}
            offset={{ closed: 0, opened: 0 }}
          >

            <TextInput
              mode='outlined'
              label='Old Password'
              value={oldPass}
              onChangeText={setOldPass}
            />
            <TextInput
              mode='outlined'
              label='New Password'
              value={oldPass}
              onChangeText={setOldPass}
            />
            <TextInput
              mode='outlined'
              label='Confirm Password'
              value={oldPass}
              onChangeText={setOldPass}
            />
            <Button mode='contained'>Confirm</Button>
          </KeyboardStickyView>

        </SafeAreaView>
      </KeyBoardDismisView>
    </KeyboardProvider>
  )
}

export default changepass