import { StyleSheet, TouchableOpacity, View, useWindowDimensions, Image, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { router } from 'expo-router'
import { TextInput, Button, Text, useTheme } from 'react-native-paper'
import { useAuth } from '@/utils/auth-context'

const signup = () => {
    const { signUp } = useAuth()
    const [eyeIsOpen, setEyes] = useState(true);
    const { height, width, scale, fontScale } = useWindowDimensions()
    const styles = createStyles(height, width)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [error, setError] = useState(null)


    const theme = useTheme()


    const handleSignUp = async () => {
        console.log(`Creating account for name: ${username} email: ${email} pass: ${password}`)
        if (!username) return setError("User name is empty")
        if (!email) return setError("Email can't be empty.")
        if (!password) return setError("Password can't be empty.")

        setError(null)

        const error = await signUp(email, password, username)
        if (error) return setError(error)

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
                            value={username}
                            keyboardType='text'
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
                            value={email}
                            keyboardType='email-address'
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
                            value={password}
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