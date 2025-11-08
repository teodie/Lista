import * as Haptics from 'expo-haptics'

const vibrate = () => {
  return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
}

export default vibrate