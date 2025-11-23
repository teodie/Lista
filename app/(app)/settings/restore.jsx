import { View, Text, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ActivityIndicator, Button, IconButton } from 'react-native-paper'
import { useRouter } from 'expo-router'
import { Restore } from '@/utils/backupAndRestore'
import * as DocumentPicker from 'expo-document-picker';
import { readAsStringAsync, EncodingType } from 'expo-file-system';
import { useAuth } from '@/utils/auth-context'
import { useClient } from '@/utils/client-context'
import { useData } from '@/utils/userdata-context'

const restore = () => {
  const router = useRouter()
  const { user } = useAuth()
  const {clients} = useClient()
  const {personData} = useData()
  const [backupFile, setBackupFile] = useState()
  const [restoring, setRestoring] = useState(false)
  const fileUri = useRef()

  const handleUploadPress = async () => {
    // show file
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' })

    if (result.canceled) return

    const file = result.assets[0]

    if (!file.name.toLowerCase().endsWith(".lst")) return Alert.alert("Invalid backup file", "File should end with \".lst\" extention")

    setBackupFile(file.name)
    fileUri.current = file.uri


  }

  const readBackupFile = async () => {
    try {
      const fileContent = await readAsStringAsync(fileUri.current, { encoding: EncodingType.UTF8 })
      return fileContent
    } catch (error) {
      console.log(error)
      return null
    }
  }


  const handleRestorePress = async () => {
    setRestoring(true)
    
    try {
      const textContent = await readBackupFile()
      if(!textContent) return console.log("Error reading backup file")
      await Restore(textContent, clients, user)
      Alert.alert("Your data has been restored")
      router.replace('/(app)/')
    } catch (error) {
      console.log(error)
    } finally {
      setRestoring(false)
    }
  }




  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ minWidth: 100, maxWidth: 400, width: 300, gap: 10 }}>
        <View style={{ borderWidth: 2, borderColor: 'gray', borderStyle: 'dashed', height: 200, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
          {
            restoring
              ? <>
                <ActivityIndicator />
                <Text>Restoring...</Text>
              </>
              : <>
                <Text style={{ fontSize: 30 }}>📁</Text>
                <Text style={{ textAlign: 'center' }}>{backupFile ? backupFile : 'Upload your backup \nfile that ends with .lst'}</Text>
              </>
          }

        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
          <Button mode='outlined' disabled={restoring} onPress={() => {
            router.back()
          }} >Cancel</Button>

          {
            backupFile
              ? <Button mode='contained' disabled={restoring} onPress={handleRestorePress}>Start Restore</Button>
              : <Button mode='contained' onPress={handleUploadPress} >Upload</Button>
          }

        </View>


      </View>
    </SafeAreaView>
  )
}

export default restore