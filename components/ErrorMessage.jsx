import { View } from 'react-native'
import React from 'react'
import { Text, useTheme } from 'react-native-paper'

export default function ErrorMessage({ errorMessage }) {
  const theme = useTheme()

  return (
    <>
      <Text style={{ color: theme.colors.error }}>{errorMessage}</Text>
    </>
  )
}