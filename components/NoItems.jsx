import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'

const NoItems = () => {
    return (
        <View style={styles.container}>
            <MaterialIcons name="content-paste-search" size={50} color="#E8E8E8" />
            <Text style={styles.txt}>No Items Listed</Text>
        </View>
    )
}

export default NoItems

const styles = StyleSheet.create({
    container: {
        margin: 10,
        alignItems: 'center',
    },
    txt: {
        fontSize: 20,
        color: "#E8E8E8",
    }
})