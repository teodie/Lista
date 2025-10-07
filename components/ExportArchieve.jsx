import { StyleSheet, Text, View, Pressable, Alert } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { exportToCSV } from '@/utils/jsonToCsv'
import { fetchArchieveData } from '@/utils/fetchArchieveData'
import NetInfo from "@react-native-community/netinfo";

const ExportArchieve = () => {
    const { isConnected } = NetInfo.useNetInfo();
    const handlePress = async () => {
        // fetch all the archieve Data in the storage
        const allArcieveData = await fetchArchieveData()
        exportToCSV(allArcieveData, "Mga bayad na")
    }

    return (
        <View style={{ flexDirection: 'row', gap: 20, alignSelf: 'center', position: 'relative' }}>
            <Pressable onPress={handlePress}>
                <MaterialIcons name='save' size={30} color='#ffffff' />
            </Pressable>
            <MaterialIcons name="cloud" size={30} color="white" />
            <View style={{height: 10, width: 10, backgroundColor: isConnected ? '#00FF01' : 'gray', borderRadius: 5, position: 'absolute', right: 0, top: 5,}}/>
        </View>
    )
}

export default ExportArchieve

