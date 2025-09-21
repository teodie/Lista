import React, { useState } from "react";
import { View, Button, Platform, Text, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function App() {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date"); // "date" or "time"
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(Platform.OS === "ios"); // keep open on iOS, auto-close on Android
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Selected: {date.toLocaleString()}</Text>

      <Button title="📅 Pick Date" onPress={() => showMode("date")} />
      <Button title="⏰ Pick Time" onPress={() => showMode("time")} />

      {show && (
        <DateTimePicker
          value={date}
          mode={mode}
          display="default"
          is24Hour={true}
          onChange={onChange}
        />
      )}
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
  },
});
