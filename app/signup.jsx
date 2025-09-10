import { StyleSheet, TouchableOpacity, View, useWindowDimensions, Image, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { router } from 'expo-router'
import { TextInput, Button, Text, useTheme } from 'react-native-paper'
import { useAuth } from '@/utils/auth-context'
import { account } from '@/utils/appWrite'
import { ID, Models } from "react-native-appwrite";

const signup = () => {
    const { signUp, logIn } = useAuth()
    const [eyeIsOpen, setEyes] = useState(true);
    const { height, width, scale, fontScale } = useWindowDimensions()
    const styles = createStyles(height, width)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [error, setError] = useState(null)


    const theme = useTheme()

    const testSignUp = async () => {
        console.log("trying to create account")
        try {
            const result = await account.create( ID.unique(), 'email@example.com', 'this_is_password', 'teodi' );
            console.log(result)
        } catch (error) {
            console.error("Full error object:", error);
            console.error("Error message:", error.message);
            console.error("Error type:", error.type);
            console.error("Error code:", error.code);
            
            if(error instanceof Error) return error.message

            return "Error occured while creating account."
        }



    }

    const handleSignUp = async () => {
        // if(!username) return setError("User name is empty")
        if (!email) return setError("Email can't be empty.")
        if (!password) return setError("Password can't be empty.")
        
        setError(null)

        const error = await signUp(email, password)
        if(error) return setError(error)

        router.replace('/login')
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
                            label='Username'
                            autoCapitalize='none'
                            keyboardType='text'
                            placeholder='your name'
                            outlineColor='white'
                            mode="outlined"
                            left={<TextInput.Icon icon="account-outline" />}
                            onChangeText={setUsername}
                        />
                    </Animated.View>



                    <Animated.View entering={FadeInUp.delay(200).duration(1000).springify()} >
                        <TextInput
                            label='email'
                            autoCapitalize='none'
                            keyboardType='email-address'
                            placeholder='youremail@gmail.com'
                            outlineColor='white'
                            mode="outlined"
                            left={<TextInput.Icon icon="email-outline" />}
                            onChangeText={setEmail}
                        />
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(400).duration(1000).springify()} >
                        <TextInput
                            label='password'
                            autoCapitalize='none'
                            secureTextEntry={eyeIsOpen}
                            mode="outlined"
                            placeholder='Type your password'
                            outlineColor='white'
                            onChange={setPassword}
                            left={<TextInput.Icon icon="lock-outline" />}
                            right={<TextInput.Icon icon={eyeIsOpen ? 'eye' : 'eye-off'} onPress={() => setEyes(prev => !prev)} />}
                        />
                    </Animated.View>

                    {error
                        ? <Text style={{ color: theme.colors.error }}>{error}</Text>
                        : null
                    }

                    <Animated.View entering={FadeInUp.delay(600).duration(1000).springify()} >
                        <TouchableOpacity onPress={() => testSignUp()}>
                            <View style={styles.loginBtn}>
                                <Text style={styles.loginText} >Sign Up</Text>
                            </View>
                        </TouchableOpacity>
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