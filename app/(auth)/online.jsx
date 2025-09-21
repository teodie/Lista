import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import NetInfo from '@react-native-community/netinfo';

const online = () => {
    const [isOnline, setIsOnline] = useState(false)
    const styles = StyleSheet.create(Style(isOnline))

    useEffect(() => {
        checkNet();
    }, [])

    const checkNet = async () => {
        try {
            const netResponse = await NetInfo.fetch()
            setIsOnline(netResponse.isConnected)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.onlineTxt}>{isOnline ? "Online" : "Offline"}</Text>
        </View>
    )
}

export default online

const Style = (online) => {
    return {
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        onlineTxt: {
            elevation: 4,
            padding: 10,
            borderRadius: 5,
            color: 'white',
            backgroundColor: online ? '#63C163' : '#F73F3F'
        }
    }

}