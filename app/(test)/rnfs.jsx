import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from 'react-native-paper'
import * as RNFS from 'react-native-fs'

const record = () => {

  const saveFile = async (filename) => {
    const path = RNFS.DownloadDirectoryPath + `${filename}`
    try {
      const result = await RNFS.writeFile(path, "This is the file", 'utf8')
      console.log("file successfully saved!", result)
    } catch (error) {
      console.log(error)
    }

  }

  const readFile = async (filename) => {
    const path = RNFS.DownloadDirectoryPath + `${filename}`

    try {
      const content = await RNFS.readFile(path, 'utf8')

      console.log("Content: ", content)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <SafeAreaView style={{ alignItems: 'center', justifyContent: 'center', flex: 1, borderWidth: 1, gap: 20, flexDirection: 'row' }}>
      <Button
        mode='contained'
        onPress={() => saveFile('/myFile.txt')}
      >Save</Button>
      <Button
        mode='contained'
        onPress={() => readFile('/myFile.txt')}
      >read</Button>
    </SafeAreaView>
  )
}

export default record
