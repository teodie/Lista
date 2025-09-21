import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";

export default function App() {
  const [file, setFile] = useState(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // you can limit to "application/pdf", "image/*", etc.
        copyToCacheDirectory: true,
      });

      console.log(result.canceled)
      console.log(JSON.stringify(file, null, 2))
      if (!result.canceled) {
        setFile(result);
      } else {
        console.log("Document picking canceled");
      }
    } catch (error) {
      console.error("Error picking document: ", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Pick a document" onPress={pickDocument} />

      {file && !file.canceled && (
        <View style={{ marginTop: 20 }}>
          <Text>📄 Name: {file.assets[0].name}</Text>
          <Text>📂 Size: {file.assets[0].size} bytes</Text>
          <Text>📍 URI: {file.assets[0].uri}</Text>
        </View>
      )}
    </View>
  );
}
