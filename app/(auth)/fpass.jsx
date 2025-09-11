import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Text, Button, TextInput } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const fpass = () => {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.headerTxt}>
          <Text variant='headlineSmall' style={{ fontWeight: '500' }}>Retrieve your account</Text>
          <Text variant='bodyMedium' >Enter your email address</Text>
        </View>
        <TextInput
          label="Email"
          mode='outlined'
          style={styles.input}
        />
        <Button mode='contained' buttonColor="#5959B2" style={styles.continueBtn}>Continue</Button>
      </View>
    </SafeAreaProvider>
  )
}

export default fpass

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  headerTxt: {
    marginVertical: 15,
    gap: 5,
  },
  input: {
    marginBottom: 20,
  }
})