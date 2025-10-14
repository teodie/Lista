import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from 'react-native-paper'

const record = () => {


  return (
    <SafeAreaView style={{ alignItems: 'center', justifyContent: 'center', flex: 1, borderWidth: 1, gap: 20, flexDirection: 'row' }}>
      <Button
        mode='contained'
        onPress={() => {}}
      >Save</Button>
    </SafeAreaView>
  )
}

export default record
