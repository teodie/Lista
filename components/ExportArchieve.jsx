import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { IconButton } from 'react-native-paper'
import * as Webrowser from 'expo-web-browser'

const ExportArchieve = () => {
    const HELPPAGE = 'https://690adc7100104c047198.syd.appwrite.run/help'

    const handleHelpPress = async () => {
        // open a browser with the linked for the instruction
        let result = await Webrowser.openBrowserAsync(HELPPAGE)
    }

    return (
        <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center' }}>
            <IconButton icon="file-download-outline" iconColor='white' size={30} />
            <IconButton icon="help-circle-outline" iconColor='white' size={30} onPress={handleHelpPress} />
        </View>
    )
}

export default ExportArchieve

