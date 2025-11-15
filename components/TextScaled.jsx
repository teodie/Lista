import { Text } from 'react-native'
import React from 'react'
import { useWindowDimensions, PixelRatio } from 'react-native'

const TextScaled = ({ style = {}, fontSize = 14, children }) => {
  const { width } = useWindowDimensions()
  const BASE_WIDTH = 411

  const scale = width / BASE_WIDTH
  const newSize = fontSize * scale
  
  const roundedValue = Math.round(PixelRatio.roundToNearestPixel(newSize))
  return (
      <Text style={[style, {fontSize: roundedValue}]}>{children}</Text>
  )
}

export default TextScaled