import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";


export default function DepracatedSwipe({data, }) {

  const renderLeftActions = () => (
    <View style={[styles.action, { backgroundColor: "#ddd" }]}>
      <TouchableOpacity onPress={() => console.log("Edit tapped")}>
        <Text style={styles.actionText}>✏️ Edit</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRightActions = () => (
    <View style={[styles.action, { backgroundColor: "#aaf" }]}>
      <TouchableOpacity onPress={() => console.log("Delete tapped")}>
        <Text style={styles.actionText}>🗑️ Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Swipeable
        containerStyle={{ overflow: "visible" }}
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
      >
        <View style={styles.card}>
          <Text style={styles.cardText}>Swipe me left or right</Text>
        </View>
      </Swipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    elevation: 4,
  },
  cardText: {
    fontSize: 18,
  },
  action: {
    justifyContent: "center",
    alignItems: "center",
    width: 200,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
