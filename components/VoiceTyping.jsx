import { StyleSheet, View, TextInput, TouchableOpacity,Text, Pressable } from 'react-native'
import React, { useState, useRef } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import Animated, { FadeIn, FadeOut, runOnJS } from 'react-native-reanimated';
import { ID } from 'react-native-appwrite';

const converToObj = (txt) => {
  const txtArr = txt.split(' ')

  const item = []
  let words = []

  for (let i = 0; i < txtArr.length; i += 1) {

    const currentItem = txtArr[i]

    if (Number.isNaN(Number(currentItem))) {
      words.push(currentItem)
    } else {
      item.push({ id: ID.unique(), productName: words.toString().replaceAll(",", " "), price: Number(currentItem) })
      words = []
    }

  }

  return item
}

const VoiceTyping = ({ setItems, items }) => {
  const voiceTypingRef = useRef(null)
  const [transcribeTxt, setTranscribeTxt] = useState('')

  const transcribeItems = (text) => {
    const newItems = converToObj(text)
    setItems([...newItems, ...items])
    setTranscribeTxt('')
  }

  const focusOnInput = () => {
    voiceTypingRef.current?.focus()
  }

  return (
    <Animated.View
      key='VoiceTyping'
      style={styles.voiceTypingContainer}
      entering={FadeIn.duration(1000).withCallback((finished) => {
        finished && runOnJS(focusOnInput)()
      })}
      exiting={FadeOut}
    >

      <TextInput
        style={{
          borderWidth: 1.5,
          borderColor: '#5959B2',
          flex: 1,
          borderRadius: 20,
        }}
        ref={voiceTypingRef}
        onChangeText={setTranscribeTxt}
        autoFocus={false}
        value={transcribeTxt}
        multiline={true}
        cursorColor='gray'
        placeholder='Voice Typing here...'
        placeholderTextColor='gray'
      />

      <Pressable
        style={{ height: 40, width: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#5959B2', marginHorizontal: 5}}
        opacity={transcribeTxt.length === 0 ? 0.7 : 1}
        disabled={transcribeTxt.length === 0 ? true : false}
        onPress={() => { voiceTypingRef.current?.blur(); transcribeItems(transcribeTxt) }} >
        <Text style={{fontWeight: 500, color: 'white'}}>Add</Text>
      </Pressable>
    </Animated.View>
  )
}

export default VoiceTyping

const styles = StyleSheet.create({
  transcribeInput: {
    borderWidth: 1,
    flex: 1,
    borderRadius: 20,
  },
  voiceTypingContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
  },

})