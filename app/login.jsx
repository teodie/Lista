import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions, Image, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { router } from 'expo-router'

const login = () => {
    const { height, width, scale, fontScale } = useWindowDimensions()
    const styles = createStyles(height, width)

    return (
        <View style={styles.container}>
            <View style={styles.upper}>
                <Animated.Image entering={FadeInUp.duration(100).springify()} style={styles.logo} source={require('@/assets/images/splash-icon-light.png')} />
            </View>
            <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={-90} >


                <View style={styles.lower}>
                    <Animated.View entering={FadeInUp.duration(1000).springify()} >
                        <TextInput style={styles.textInput} placeholder='Email' placeholderTextColor="gray" />
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(200).duration(1000).springify()} >
                        <TextInput style={styles.textInput} placeholder='Password' placeholderTextColor="gray" secureTextEntry />
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(400).duration(1000).springify()}  >
                        <TouchableOpacity>
                            <Text style={styles.forgotTxt}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(600).duration(1000).springify()} >
                        <TouchableOpacity >
                            <View style={styles.loginBtn}>
                                <Text style={styles.loginText} >Log in</Text>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View entering={FadeInUp.delay(800).duration(1000).springify()} style={styles.signupWrapper}>
                        <Text>Dont have an account? </Text>
                        <TouchableOpacity onPress={() => router.navigate({ pathname: 'signup' })}>
                            <Text style={styles.signupTxt} > Sign Up</Text>
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