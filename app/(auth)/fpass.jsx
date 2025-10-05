import { StyleSheet, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Text, Button, TextInput } from 'react-native-paper'
import { account } from '@/utils/appWrite'
import * as Linking from "expo-linking";
import { router } from 'expo-router';
import toast from '@/utils/toast';

const fpass = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState('')
  const [resetClicked, setResetClicked] = useState(false)
  const [userId, setUserId] = useState(null)
  const [secret, setSecret] = useState(null)
  const [buttonDisable, setButtonDisable] = useState(false)

  useEffect(() => {
    
    const handleUrl = (event) => {
      const url = event.url;
      console.log("Incoming link:", url);

      // Parse query params
      const { queryParams } = Linking.parse(url);
      const userId = queryParams?.userId;
      const secret = queryParams?.secret;

      if (userId && secret) {
        setSecret(secret)
        setUserId(userId)
        setResetClicked(prev => !prev)
        setButtonDisable(false)
      }

      // TODO: Ask user for new password and call updateRecovery
    };

    const sub = Linking.addEventListener("url", handleUrl);

    // Handle cold start
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl({ url });
    });

    return () => sub.remove();
  }, []);

  const handleSend = async () => {
    setButtonDisable(true)
    const redirectUri = process.env.EXPO_PUBLIC_FORGOT_PASSWORD_REDIRECT_FUNCTION

    await account.createRecovery(email, redirectUri)
    toast("Email has been sent")
  }

  const handleSave = async () => {
    const data = { userId, secret, password }
    try {
      await account.updateRecovery(data);
      toast("Password has been Updated")
      router.replace('/login')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerTxt}>
        <Text variant='headlineSmall' style={{ fontWeight: '500' }}>{resetClicked ? "Enter new Password" : "Retrieve your account"}</Text>
        <Text variant='bodyMedium' >{resetClicked ? email : "Enter your email address"}</Text>
      </View>
      <TextInput
        label={resetClicked ? "New Password" : "Email"}
        mode='outlined'
        value={resetClicked ? password : email}
        onChangeText={resetClicked ? setPassword : setEmail}
        style={styles.input}
      />

      <Button mode='contained' buttonColor="#5959B2" style={styles.continueBtn}
        onPress={resetClicked ? handleSave : handleSend}
        disabled={buttonDisable}
      >{resetClicked ? "Save Password" : "Send Link"}</Button>
    </View>
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