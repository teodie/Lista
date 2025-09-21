import { StyleSheet, TouchableOpacity, View, useWindowDimensions, Image, KeyboardAvoidingView } from 'react-native'
import React, { useState, useReducer } from 'react'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { router } from 'expo-router'
import { TextInput, Button, Text, useTheme } from 'react-native-paper'
import { useAuth } from '@/utils/auth-context'
import {Redirect} from 'expo-router'

const googleIcon = require('@/assets/images/google-icon.png')


const login = () => {
    // return <Redirect href="/notif" />

    const { logIn, googleSignUp, setIsLoadingUser } = useAuth()
    const [eyeIsOpen, setEyes] = useState(true);
    const { height, width, scale, fontScale } = useWindowDimensions()
    const styles = createStyles(height, width)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const theme = useTheme()

    const handleLogin = async () => {
        if (!email.includes('@gmail.com')) return setError("Invalid email address.")
        if (!email.trim()) return setError("Email can't be empty.")
        if (!password.trim()) return setError("Password can't be empty.")
        if (password.trim().length <= 8) return setError("Password must be atleast 8 characters long.")

        setError(null)

        const error = await logIn(email, password)
        console.log(typeof (error))
        if (error) return setError(error)

        router.replace('/')
    }


    return (
        <View style={styles.container}>
            <View style={styles.upper}>
                <Animated.Image entering={FadeInUp.duration(100).springify()} style={styles.logo} source={require('@/assets/images/splash-icon-light.png')} />
            </View>
            <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={-90} >

                <View style={styles.lower}>
                    <Animated.View entering={FadeInUp.duration(1000).springify()} >
                        <TextInput
                            label='email'
                            autoCapitalize='none'
                            keyboardType='email-address'
                            placeholder='youremail@gmail.com'
                            outlineColor='white'
                            mode="outlined"
                            value={email}
                            onChangeText={setEmail}
                            left={<TextInput.Icon icon="email-outline" />}
                        />
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(200).duration(1000).springify()} >
                        <TextInput
                            label='password'
                            autoCapitalize='none'
                            secureTextEntry={eyeIsOpen}
                            mode="outlined"
                            value={password}
                            placeholder='Type your password'
                            outlineColor='white'
                            onChangeText={setPassword}
                            left={<TextInput.Icon icon="lock-outline" />}
                            right={<TextInput.Icon icon={eyeIsOpen ? 'eye' : 'eye-off'} onPress={() => setEyes(prev => !prev)} />}
                        />
                    </Animated.View>

                    {error
                        ? <Text style={{ color: theme.colors.error }}>{error}</Text>
                        : null
                    }

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
                            setError(null);
                            const error = await googleSignUp();
                            if (error) setError(error);
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
                height: height * .5,
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