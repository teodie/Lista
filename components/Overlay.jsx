import { View } from 'react-native'
import React from 'react'
import KeyBoardDismisView from './KeyBoardDismis'

const Overlay = ({ children }) => {
  return (
    <KeyBoardDismisView>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'center'
        }}
      >{children}</View>
    </KeyBoardDismisView>
  )
}

export default Overlay