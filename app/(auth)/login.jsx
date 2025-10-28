import { StyleSheet, TouchableOpacity, View, useWindowDimensions, Alert, KeyboardAvoidingView, Keyboard } from 'react-native'
import React, { useState, useReducer } from 'react'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { useRouter } from 'expo-router'
import { TextInput, Button, Text, useTheme } from 'react-native-paper'
import { useAuth } from '@/utils/auth-context'
import KeyBoardDismisView from '@/components/KeyBoardDismis'
import * as Haptics from 'expo-haptics';
import ErrorMessage from '@/components/ErrorMessage'
import { withTiming, Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence } from 'react-native-reanimated';
import { toastCenter } from '@/utils/toast'

const googleIcon = require('@/assets/images/google-icon.png')

const initialValue = {
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
    eyeIsOpen: false,
    error: '',


}

const reducer = (state, action) => {

    switch (action.type) {
        case "SET-FILLED":
            return { ...state, [action.fieldName]: action.fieldValue }
        case "TOGGLE-EYE":
            return { ...state, eyeIsOpen: !state.eyeIsOpen }
        case "ERROR":
            return { ...state, error: action.errorMsg }
        case "SET-ERROR":
            return { ...state, [action.errorField]: action.errorMessage }
        case "CLEAR-ERROR":
            return { ...state, emailError: '', passwordError: '', error: '' }
        default:
            console.warn(`Invalid action: ${action.type}`)
            return state
    }
}

const login = () => {
    // return <Redirect href="/notif" />
    const router = useRouter()
    const { logIn, googleSignUp, setIsLoadingUser } = useAuth()
    const { height, width, scale, fontScale } = useWindowDimensions()
    const styles = createStyles(height, width)
    const theme = useTheme()

    const [state, dispatch] = useReducer(reducer, initialValue)

    const offset = useSharedValue(0)

    const startAnimation = useAnimatedStyle(() => ({
        transform: [{ translateX: offset.value }],
    }))


    const onChange = (field) => (value) => {
        dispatch({ type: 'SET-FILLED', fieldName: field, fieldValue: value })
    }

    const isValidEmail = (email) => {
        if (!email.trim()) {
            dispatch({ type: 'SET-ERROR', errorField: 'emailError', errorMessage: "Email can't be empty." })
            return false
        } else if (!email.includes('@gmail.com')) {
            dispatch({ type: 'SET-ERROR', errorField: 'emailError', errorMessage: "Invalid Email address." })
            return false
        }

        return true
    }

    const isValidPassword = (password) => {

        if (!password.trim()) {
            dispatch({ type: 'SET-ERROR', errorField: 'passwordError', errorMessage: "Password can't be empty." })
            return false
        } else if (password.trim().length <= 8) {
            dispatch({ type: 'SET-ERROR', errorField: 'passwordError', errorMessage: "Password must be atleast 8 characters long." })
            return false
        }  

        return true
    }

    const emailIsListed = async (userEmail) => {
        const url = process.env.EXPO_PUBLIC_APPWRITE_EMAIL_EXISTENCE_CHECKER_END_POINT
        const data = { email: userEmail, action: 'CHECK-EMAIL' }
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)

            }
            )

            const result = await response.json()
            return result.exist
        } catch (error) {
            console.log("Erro when checking if the email exist: ", error)
            return false
        }

    }


    const handleLogin = async () => {

        const duration = 50
        offset.value = withSequence(
            withTiming(-5, { duration: duration / 2 }),
            withRepeat(withTiming(5, { duration: duration }), 5, true),
            withTiming(0, { duration: duration / 2 })
        )

        Keyboard.dismiss()
        dispatch({ type: 'CLEAR-ERROR' })

        // Check if the email and password are valid
        if (!isValidEmail(state.email) || !isValidPassword(state.password)) return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

        const emailExist = await emailIsListed(state.email)

        const error = await logIn(state.email, state.password)

        if (!emailExist) {
            Alert.alert(
                "Unregistered Emial",
                `Can't find your email ${state.email} in the database. Want to login instead?`,
                [
                    {text: "Cancel", style: 'cancel'},
                    {
                        text: 'Ok', 
                        style: 'default',
                        onPress: () => { router.replace('/(auth)/signup') }
                    },
                ]
            )


            return dispatch({ type: 'SET-ERROR', errorField: 'emailError', errorMessage: `Can't find your email ${state.email} in the database. Want to login instead?` }) }


        if (error?.includes("Invalid credentials") && emailExist) {
            toastCenter("Invalid credentials please check your email and password.")
            return dispatch({ type: 'ERROR', errorMsg: "Wrong Password" })
        }

        if (error) return dispatch({ type: 'ERROR', errorMsg: error })
        
        router.replace('/')

    }

    return (
        <KeyBoardDismisView >
            <View style={styles.container}>
                <View style={styles.upper}>
                    <Animated.Image entering={FadeInUp.duration(100).springify()} style={styles.logo} source={require('@/assets/images/splash-icon-light.png')} />
                </View>
                <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={-90} >

                    <View style={styles.lower}>
                        <Animated.View entering={FadeInUp.duration(1000).springify()} style={state.emailError !== '' && startAnimation}>
                            <TextInput
                                label='email'
                                autoCapitalize='none'
                                keyboardType='email-address'
                                placeholder='youremail@gmail.com'
                                outlineColor={state.emailError !== '' ? theme.colors.error : 'white'}
                                mode="outlined"
                                value={state.email}
                                onChangeText={onChange('email')}
                                left={<TextInput.Icon icon="email-outline" />}
                            />
                        </Animated.View>

                        {state.emailError !== '' && <ErrorMessage errorMessage={state.emailError} />
                        }

                        <Animated.View entering={FadeInUp.delay(200).duration(1000).springify()} style={state.passwordError !== '' && startAnimation} >
                            <TextInput
                                label='password'
                                autoCapitalize='none'
                                secureTextEntry={state.eyeIsOpen}
                                mode="outlined"
                                value={state.password}
                                placeholder='Type your password'
                                outlineColor={state.passwordError !== '' ? theme.colors.error : 'white'}
                                onChangeText={onChange('password')}
                                left={<TextInput.Icon icon="lock-outline" />}
                                right={
                                    <TextInput.Icon icon={state.eyeIsOpen ? 'eye' : 'eye-off'}
                                        onPress={() => dispatch({ type: 'TOGGLE-EYE' })} />
                                }
                            />
                        </Animated.View>

                        {state.passwordError !== '' && <ErrorMessage errorMessage={state.passwordError} />
                        }

                        {state.error !== '' && <ErrorMessage errorMessage={state.error} />}

                        <Animated.View style={styles.forgotWrapper} entering={FadeInUp.delay(400).duration(1000).springify()}  >
                            <TouchableOpacity onPress={() => router.navigate('fpass')}>
                                <Text style={styles.forgotTxt}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </Animated.View>

                        <Animated.View entering={FadeInUp.delay(600).duration(1000).springify()}>
                            <Button mode='contained' buttonColor='#5959B2' onPress={handleLogin} >
                                Log in
                            </Button>
                        </Animated.View>

                        <Animated.View entering={FadeInUp.delay(800).duration(1000).springify()}>
                            <Button mode='outlined' icon={googleIcon} labelStyle={{ color: '' }} onPress={async () => {

                                const error = await googleSignUp();
                                if (error) return dispatch({ type: 'ERROR', errorMsg: error });

                                router.replace('/')

                            }} >
                                Sign in with Google
                            </Button>
                        </Animated.View>

                        <Animated.View entering={FadeInUp.delay(1000).duration(1000).springify()} style={styles.signupWrapper}>
                            <Text>Dont have an account? </Text>
                            <TouchableOpacity onPress={() => router.replace('signup')}>
                                <Text style={styles.signupTxt} >Sign Up</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </KeyBoardDismisView>
    )
}

export default login

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
                height: height * .6,
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
                fontSize: width / 30,
                color: '#5959B2',
                fontWeight: 'bold',
            },
            forgotWrapper: {
                alignSelf: 'flex-end'
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