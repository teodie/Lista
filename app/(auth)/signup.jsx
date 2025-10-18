import { StyleSheet, TouchableOpacity, View, useWindowDimensions, Image, KeyboardAvoidingView, Keyboard } from 'react-native'
import React, { useReducer, useState } from 'react'
import { router } from 'expo-router'
import { TextInput, Button, Text, useTheme, ActivityIndicator } from 'react-native-paper'
import { useAuth } from '@/utils/auth-context'
import Animated, { useSharedValue, withTiming, withSequence, useAnimatedStyle, FadeInDown, FadeInUp, withRepeat } from 'react-native-reanimated'
import KeyBoardDismisView from '@/components/KeyBoardDismis'
import ErrorMessage from '@/components/ErrorMessage'
import * as Haptics from 'expo-haptics'
import toast, { toastCenter } from '@/utils/toast'

const initialValue = {
    name: '',
    nameError: '',
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
    eyeIsOpen: false,
    signUpError: '',
}

const reducer = (state, action) => {
    switch (action.type) {
        case "SET-VALUE":
            return { ...state, [action.field]: action.value }
        case "SET-ERROR":
            return { ...state, [action.field]: action.errorMessage }
        case "CLEAR-ERROR":
            return { ...state, nameError: '', emailError: '', passwordError: '', signUpError: '', }
        case "TOGGLE-EYE":
            return { ...state, eyeIsOpen: !state.eyeIsOpen }
    }
}

const signup = () => {
    const { signUp } = useAuth()
    const { height, width, scale, fontScale } = useWindowDimensions()
    const styles = createStyles(height, width)

    const [state, dispatch] = useReducer(reducer, initialValue)

    const theme = useTheme()

    const offset = useSharedValue(0)
    const jiggleAnimation = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }))

    const handleChange = (field) => (value) => {
        return dispatch({ type: 'SET-VALUE', field, value })
    }

    const emailAlreadyRegitered = async (userEmail) => {
        const url = process.env.EXPO_PUBLIC_APPWRITE_EMAIL_EXISTENCE_CHECKER_END_POINT
        const data = { email: userEmail }
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            const result = await response.json()
            return result.exist
        } catch (error) {
            console.log("Error in checking if email is already registered: ", error)
            return false
        }
    }

    const usernameIsValid = (name) => {
        const specialChars = /[!@#$%^&*(),.?":{}|<>]/

        if (name.trim() === '') {
            dispatch({ type: 'SET-ERROR', field: 'nameError', errorMessage: 'Username is empty.' })
            return false
        } else if (specialChars.test(name)) {
            dispatch({ type: 'SET-ERROR', field: 'nameError', errorMessage: 'Username can\'t have wierd characthers .' })
            return false
        }

        return true
    }

    const emailIsValid = (userEmail) => {
        if (userEmail.trim() === '') {
            dispatch({ type: 'SET-ERROR', field: 'emailError', errorMessage: 'Email is empty.' })
            return false
        } else if (!userEmail.trim().includes('@gmail.com')) {
            dispatch({ type: 'SET-ERROR', field: 'emailError', errorMessage: 'Invalid email address.' })
            return false
        }

        return true
    }

    const passwordIsValid = (userPassword) => {
        if (userPassword.trim() === '') {
            dispatch({ type: 'SET-ERROR', field: 'passwordError', errorMessage: 'Password is empty.' })
            return false
        } else if (userPassword.trim().length <= 8) {
            dispatch({ type: 'SET-ERROR', field: 'passwordError', errorMessage: 'Password is too short.' })
            return false
        }

        return true
    }

    const vibrate = () => {
        return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    }

    const handleSignUp = async () => {
        Keyboard.dismiss()

        const duration = 50
        offset.value = withSequence(
            withTiming(-5, { duration: duration / 2 }),
            withRepeat(withTiming(5, { duration: duration }), 5, true),
            withTiming(0, { duration: duration / 2 })
        )

        dispatch({ type: 'CLEAR-ERROR' })



        // Check username 
        if (!usernameIsValid(state.name)) return vibrate()
        // Check email 
        if (!emailIsValid(state.email)) return vibrate()
        // Check password 
        if (!passwordIsValid(state.password)) return vibrate()

        // Check if email is already registred
        if (await emailAlreadyRegitered(state.email)) {
            vibrate()
            toastCenter("Email already Exist. Please go back to login screen.")
            return dispatch({
                type: 'SET-ERROR',
                field: 'emailError',
                errorMessage: 'Email already exist. Please go back to login screen.'
            })
        }

        // Initiate sign up
        const response = await signUp(state.email, state.password, state.name)

        if (response.status === 'SUCCESS') return router.replace('/login')
    }

    return (
        <KeyBoardDismisView>
            <View style={styles.container}>
                <View style={styles.upper}>
                    <Animated.Image entering={FadeInUp.duration(100).springify()} style={styles.logo} source={require('@/assets/images/splash-icon-light.png')} />
                </View>
                <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={-90} >

                    <View style={styles.lower}>

                        <Animated.View
                            entering={FadeInUp.duration(1000).springify()}
                            style={state.nameError !== '' && jiggleAnimation}
                        >

                            <TextInput
                                label='Username'
                                autoCapitalize='none'
                                keyboardType='text'
                                outlineColor={state.nameError !== '' ? theme.colors.error : 'white'}
                                mode="outlined"
                                left={<TextInput.Icon icon="account-outline" />}
                                value={state.name}
                                onChangeText={handleChange('name')}
                            />
                        </Animated.View>

                        {state.nameError !== '' && <ErrorMessage errorMessage={state.nameError} />}

                        <Animated.View
                            entering={FadeInUp.delay(200).duration(1000).springify()}
                            style={state.emailError !== '' && jiggleAnimation}
                        >
                            <TextInput
                                label='email'
                                autoCapitalize='none'
                                keyboardType='email-address'
                                outlineColor={state.emailError !== '' ? theme.colors.error : 'white'}
                                mode="outlined"
                                left={<TextInput.Icon icon="email-outline" />}
                                value={state.email}
                                onChangeText={handleChange('email')}
                            />
                        </Animated.View>

                        {state.emailError !== '' && <ErrorMessage errorMessage={state.emailError} />}

                        <Animated.View
                            entering={FadeInUp.delay(400).duration(1000).springify()}
                            style={state.passwordError !== '' && jiggleAnimation}
                        >
                            <TextInput
                                label='password'
                                autoCapitalize='none'
                                secureTextEntry={state.eyeIsOpen}
                                mode="outlined"
                                outlineColor={state.passwordError !== '' ? theme.colors.error : 'white'}
                                value={state.password}
                                onChangeText={handleChange('password')}
                                left={<TextInput.Icon icon="lock-outline" />}
                                right={<TextInput.Icon icon={state.eyeIsOpen ? 'eye' : 'eye-off'} onPress={() => dispatch({ type: 'TOGGLE-EYE' })} />}
                            />
                        </Animated.View>

                        {state.passwordError !== '' && <ErrorMessage errorMessage={state.passwordError} />}
                        {state.error !== '' && <ErrorMessage errorMessage={state.error} />}

                        <Animated.View entering={FadeInUp.delay(600).duration(1000).springify()}>
                            <Button mode='contained' buttonColor='#5959B2' onPress={handleSignUp} >
                                Sign up
                            </Button>
                        </Animated.View>

                        <Animated.View entering={FadeInUp.delay(800).duration(1000).springify()} style={styles.signupWrapper}>
                            <Text>Already have an account? </Text>
                            <TouchableOpacity onPress={() => router.navigate({ pathname: '/login' })}>
                                <Text style={styles.signupTxt} >Log in</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </KeyBoardDismisView>
    )
}

export default signup

function createStyles(height, width,) {
    return StyleSheet.create(
        {
            container: {
                flex: 1,
                backgroundColor: '#5959B2',
            },
            upper: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }, lower: {
                paddingHorizontal: width * .05,
                height: height * .50 + 100,
                backgroundColor: '#EBEFEE',
                borderTopLeftRadius: width / 15,
                borderTopRightRadius: width / 15,
                paddingTop: width * .10,
                gap: width * .05,
            },
            textInput: {
                backgroundColor: '#FAFCFB',
                borderRadius: width * .02,
                fontSize: width / 20,
                paddingLeft: 20
            },
            loginText: {
                fontSize: width / 13,
                fontWeight: 'bold',
                color: 'white'
            },
            forgotTxt: {
                alignSelf: 'flex-end',
                fontSize: width / 30,
                color: '#5959B2',
                fontWeight: 'bold',
            },
            loginBtn: {
                height: width * .13,
                borderRadius: width * .03,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#5959B2',
            },
            signupWrapper: {
                alignSelf: 'flex-end',
                textAlignVertical: 'center',
                flexDirection: 'row',

            },
            signupTxt: {
                color: '#5959B2',
                fontWeight: 'bold'
            },
            logo: {
                width: 300,
                height: 300,
                borderColor: "white",
            }
        })
}