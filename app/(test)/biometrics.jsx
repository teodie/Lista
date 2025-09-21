import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

export default function App() {
  const [result, setResult] = useState("Not authenticated yet");

  const checkAuth = async () => {
    try {
      // Check if hardware supports biometrics
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        setResult("❌ No biometric hardware available on this device");
        return;
      }

      // Check if any biometrics are enrolled
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        setResult("⚠️ No biometrics set up on this device");
        return;
      }

      // Prompt user for authentication
      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate with fingerprint",
        fallbackLabel: "Use PIN",
        cancelLabel: "Cancel",
      });

      if (authResult.success) {
        setResult("✅ Authentication successful!");
      } else {
        setResult(`❌ Authentication failed: ${authResult.error || "Canceled"}`);
      }
    } catch (error) {
      setResult(`⚠️ Error: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{result}</Text>
      <Button title="Authenticate" onPress={checkAuth} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
});
