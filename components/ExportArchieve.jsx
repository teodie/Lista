import { StyleSheet, Text, View, Pressable, Alert } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { exportToCSV } from '@/utils/jsonToCsv'
import { fetchArchieveData } from '@/utils/fetchArchieveData'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAuth } from '@/utils/auth-context'
import { router } from 'expo-router'

const ExportArchieve = () => {
    const {signOut} = useAuth()
    const handlePress = async () => {
        // fetch all the archieve Data in the storage
        const allArcieveData = await fetchArchieveData()
        exportToCSV(allArcieveData, "Mga bayad na")
    }

    const handleLogOut = async () => {
        console.log("Signing Out!")
        signOut()
        router.replace('/login')
    }

    return (
        <View style={{flexDirection: 'row', gap: 20, alignSelf: 'center'}}>
            <Pressable onPress={handlePress}>
                <MaterialIcons name='save' size={30} color='#ffffff' />
            </Pressable>
            <Pressable onPress={handleLogOut}>
                <MaterialCommunityIcons name="logout" size={30} color="#ffffff" />
            </Pressable>
        </View>
    )
}

export default ExportArchieve

