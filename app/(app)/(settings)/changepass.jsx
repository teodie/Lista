import { View, Text, Image, Alert } from 'react-native'
import React, { useReducer } from 'react'
import { Button, TextInput, useTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardProvider, KeyboardStickyView, useKeyboardState } from 'react-native-keyboard-controller'
import KeyBoardDismisView from '@/components/KeyBoardDismis'
import { useAuth } from '@/utils/auth-context'
import { useRouter } from 'expo-router'

const initialValue = {
  newPassword: '',
  newPasswordError: '',
  newPasswordEyeOpen: true,
  confirmPassword: '',
  confirmPasswordError: '',
  confirmPasswordEyeOpen: true,
}

const reducer = (state, action) => {
  switch (action.type) {
    case "SET-VALUE":
      return { ...state, [action.field]: action.value }
    case "TOGGLE-EYE":
      return { ...state, [action.eye]: !state[action.eye] }
    case "SET-ERROR":
      return { ...state, [action.field]: action.errorMsg }
    case "CLEAR-ERROR":
      return { ...state, oldPasswordError: '', newPasswordError: '', confirmPasswordError: '' }
    default:
      console.log("Invalid action")
      return state
  }
}

const changepass = () => {
  const keyboardIsVisible = useKeyboardState((state) => state.isVisible)
  const [state, dispatch] = useReducer(reducer, initialValue)
  const theme = useTheme()
  const { user } = useAuth()
  const router = useRouter()


  const newPasswordIsValid = () => {
    if (state.newPassword.trim() === '') {
      dispatch({ type: 'SET-ERROR', field: 'newPasswordError', errorMsg: 'New password is empty.' })
      return false
    } else if (state.newPassword.trim().length <= 8) {
      dispatch({ type: 'SET-ERROR', field: 'newPasswordError', errorMsg: 'New password is too short.' })
      return false
    }

    return true
  }

  const confirmPasswordIsValid = () => {
    if (state.confirmPassword.trim() === '') {
      dispatch({ type: 'SET-ERROR', field: 'confirmPasswordError', errorMsg: 'Empty Confirm password.' })
      return false
    } else if (state.confirmPassword.toLowerCase().trim() !== state.newPassword.toLowerCase().trim()) {
      dispatch({ type: 'SET-ERROR', field: 'confirmPasswordError', errorMsg: 'Not matched new password and confirm password.' })
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    dispatch({ type: 'CLEAR-ERROR' })

    if (!newPasswordIsValid()) return
    if (!confirmPasswordIsValid()) return
    console.log("passed the test")


    Alert.alert(
      "You will be log out",
      "You will be log out after successfull password change.",
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Ok',
          style: 'default',
          onPress: async () => { await updatePassword() }
        },
      ]
    )


  }

  const updatePassword = async () => {
    const url = process.env.EXPO_PUBLIC_APPWRITE_EMAIL_EXISTENCE_CHECKER_END_POINT
    router.replace('/waiting')
    
    console.log("Starting Change password")
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.$id,
          password: state.newPassword,
          action: 'UPDATE-PASSWORD'
        })
      })

      const result = await response.json()

      if (result.status !== 'successful' && result.message.includes('incorrect')) return dispatch({ type: 'SET-ERROR', field: 'oldPasswordError', errorMsg: result.message })

      Alert.alert("Password has been updated")
      router.dismissTo('/(auth)/login')

    } catch (error) {
      console.log(error)
      return dispatch({ type: 'SET-ERROR', field: 'confirmPasswordError', errorMsg: error.message })
    }

  }

  const handleChange = (field) => (value) => {
    return dispatch({ type: 'SET-VALUE', field, value })
  }

  return (
      <KeyBoardDismisView>
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 10 }}>

          <View style={{
            alignItems: 'center',
            opacity: keyboardIsVisible ? .1 : 1,
          }}>
            <Image
              source={require('@/assets/images/my-password.png')}
              style={{ height: 350, width: 350 }}
            />
          </View>
          <KeyboardStickyView style={{
            marginTop: 20,
            flex: 1,
          }}
            offset={{ closed: 0, opened: 0 }}
          >
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 30,
                fontWeight: 700,
              }}>Change Password</Text>
              <Text style={{
                textAlign: 'center',
                fontSize: 12,
              }}>Please ensure that the new password is defferent from the previous passwords that you have been used.</Text>
            </View>

            <TextInput
              style={{ marginTop: 10 }}
              outlineColor={state.newPasswordError !== '' ? theme.colors.error : null}
              mode='outlined'
              label='New Password'
              secureTextEntry={state.newPasswordEyeOpen}
              value={state.newPassword}
              right={<TextInput.Icon icon={state.newPasswordEyeOpen ? 'eye-off' : 'eye'} onPress={() => {
                dispatch({ type: 'TOGGLE-EYE', eye: 'newPasswordEyeOpen' })
              }} />}
              onChangeText={handleChange('newPassword')}
            />
            {
              state.newPasswordError !== '' && <Text style={{ color: theme.colors.error }}>{state.newPasswordError}</Text>
            }
            <TextInput
              style={{ marginTop: 10 }}
              outlineColor={state.confirmPasswordError !== '' ? theme.colors.error : null}
              mode='outlined'
              label='Confirm Password'
              secureTextEntry={state.confirmPasswordEyeOpen}
              right={<TextInput.Icon icon={state.confirmPasswordEyeOpen ? 'eye-off' : 'eye'} onPress={() => {
                dispatch({ type: 'TOGGLE-EYE', eye: 'confirmPasswordEyeOpen' })
              }} />}
              value={state.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
            />
            {
              state.confirmPasswordError !== '' && <Text style={{ color: theme.colors.error }}>{state.confirmPasswordError}</Text>
            }
            <Button
              onPress={handleSubmit}
              style={{ marginTop: 15 }}
              mode='contained'>Confirm</Button>
          </KeyboardStickyView>

        </SafeAreaView>
      </KeyBoardDismisView>
  )
}

export default changepass