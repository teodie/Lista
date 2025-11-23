import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { IconButton } from 'react-native-paper'
import * as Webrowser from 'expo-web-browser'
import backup from '@/utils/backupAndRestore'
import { useAuth } from '@/utils/auth-context'
import { useClient } from '@/utils/client-context'

const ExportArchieve = () => {
    const {clients} = useClient()
    const {user} = useAuth()

    const openHelpWebPage = async () => {
        const HELPPAGE = 'https://690adc7100104c047198.syd.appwrite.run/help'
        await Webrowser.openBrowserAsync(HELPPAGE)
    }


    const hanldeDownloadPress = () => {
        if(clients.length === 0) return Alert.alert("No Data to backup.")
        const backupSuccess = backup(user.$id)

        if(backupSuccess) return Alert.alert("Backup Completed", "Data has been saved in your phones Download folder with the name starts with List_Backup.")
        
        return Alert.alert("Backup Failed")
        
    }

    return (
        <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center' }}>
            <IconButton icon="file-download-outline" iconColor='white' size={30} onPress={hanldeDownloadPress} />
            <IconButton icon="help-circle-outline" iconColor='white' size={30} onPress={openHelpWebPage} />
        </View>
    )
}

export default ExportArchieve

