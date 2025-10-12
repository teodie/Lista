import { StyleSheet, Text, TextInput } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const record = () => {
  const [text, setText] = useState('')
  const inputRef = useRef(null)

  useEffect(()=>{
    inputRef.current.focus()
  }, [])

  return (
    <SafeAreaView style={{alignItems: 'center'}}>
      <Text>record</Text>
      <TextInput 
        ref={inputRef}
        keyboardType='default'
        value={text}
        onChangeText={setText}
        style={{display: 'flex', borderWidth: 1}}
      />
    </SafeAreaView>
  )
}

export default record

const styles = StyleSheet.create({})