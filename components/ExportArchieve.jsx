import { StyleSheet, Text, View, Pressable, Alert } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { exportToCSV } from '@/utils/jsonToCsv'
import { fetchArchieveData } from '@/utils/fetchArchieveData'

const ExportArchieve = () => {

    const handlePress = async () => {
        // fetch all the archieve Data in the storage
        const allArcieveData = await fetchArchieveData()
        exportToCSV(allArcieveData, "Mga bayad na")
    }

    return (
        <Pressable onPress={handlePress}>
            <MaterialIcons name='save' size={30} color='#ffffff' />
        </Pressable>
    )
}

export default ExportArchieve
