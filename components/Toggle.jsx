import { StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import React, { useEffect } from 'react'
import { MaterialIcons } from '@expo/vector-icons'

const Toggle = ({ enableVoiceType, setEnableVoiceType }) => {
    const circleDiameter = 25
    const containerTotalWidth = 45

    const translateX = useSharedValue(0)

    useEffect(() => {
        translateX.value = withTiming(enableVoiceType ? 20 : 0, { duration: 500 })
    }, [enableVoiceType])

    const startAnimation = useAnimatedStyle(() => {
        return {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#5959B2',
            borderWidth: 1,
            borderColor: 'white',
            height: circleDiameter,
            width: circleDiameter,
            borderRadius: circleDiameter / 2,
            transform: [{ translateX: translateX.value }],

        }
    })


    const handleTogglePress = () => {
        setEnableVoiceType(prev => !prev)
    }

    return (
        <TouchableOpacity onPress={handleTogglePress}>
            <View style={{ backgroundColor: enableVoiceType ? 'white' : '#D9D9E0', justifyContent: 'center', height: circleDiameter/2, width: containerTotalWidth, borderRadius: circleDiameter / 2 }}>
                <Animated.View style={startAnimation}>
                    <MaterialIcons name={enableVoiceType ? 'mic' : 'mic-off'} size={20} color='white' />
                </Animated.View>
            </View>
        </TouchableOpacity>
    )
}

export const SwitchVoiceTyping = ({ enableVoiceType, setEnableVoiceType }) => {
    return (
        <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={enableVoiceType ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={ () => setEnableVoiceType(!enableVoiceType)}
            value={enableVoiceType}
        />
    )
}

export default Toggle

const styles = StyleSheet.create({
    toggleContainer: {
        backgroundColor: 'white',
    },
    circle: {
        boxShadow: [{ offsetX: 4, offsetY: 0, blurRadius: 5, spreadDistance: 1, color: '#D9D9E0' }]
    },

})