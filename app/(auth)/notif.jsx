import React, { useEffect, useRef, useState } from 'react';
import { Button, Platform, View, Text, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';

// Configure how notifications behave in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Ask notification permission on mount
    registerForLocalNotificationsAsync();

    // Listener when a notification is received in foreground
    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });

    // Listener when a user interacts with a notification (tap)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        console.log("User tapped notification:", response);
      });

    return () => {
      Notifications.subscription.remove(notificationListener.current);
      Notifications.subscription.remove(responseListener.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expo Local Notifications Demo</Text>

      <Button
        title="Send Local Notification"
        onPress={async () => {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Hello 👋",
              body: "This is a local notification!",
              sound: true,
            },
            trigger: { seconds: 2 }, // show after 2 seconds
          });
        }}
      />

      {notification && (
        <View style={styles.notificationBox}>
          <Text style={styles.notifText}>
            Last notification: {notification.request.content.body}
          </Text>
        </View>
      )}
    </View>
  );
}

// ✅ Only asks permission, no Firebase / push token
async function registerForLocalNotificationsAsync() {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Permission for notifications not granted');
    }

    // Android notification channel (required for sound/vibration)
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  } catch (err) {
    console.error("Error setting up local notifications:", err);
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  notificationBox: { marginTop: 20, padding: 10, backgroundColor: '#eee', borderRadius: 8 },
  notifText: { fontSize: 16 }
});
