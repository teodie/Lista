import { StyleSheet, View, TextInput, TouchableOpacity, Pressable } from 'react-native'
import React, { useState, useRef } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import uuid from 'react-native-uuid';
import Animated, { FadeIn, FadeOut, runOnJS } from 'react-native-reanimated';

const converToObj = (txt) => {
  const txtArr = txt.split(' ')

  const item = []
  let words = []

  for (let i = 0; i < txtArr.length; i += 1) {

    const currentItem = txtArr[i]

    if (Number.isNaN(Number(currentItem))) {
      words.push(currentItem)
    } else {
      item.push({ id: uuid.v4(), product: words.toString().replaceAll(",", " "), price: Number(currentItem) })
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
        style={styles.transcribeInput}
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
        opacity={transcribeTxt.length === 0 ? 0.7 : 1}
        disabled={transcribeTxt.length === 0 ? true : false}
        onPress={() => { voiceTypingRef.current?.blur(); transcribeItems(transcribeTxt) }} >
        <MaterialIcons name='add-circle' size={40} color='#5959B2' />
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
    paddingLeft: 10,
    paddingRight: 10,
  },

})