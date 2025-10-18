import { ToastAndroid } from 'react-native'

export default toast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT, ToastAndroid.BOTTOM)
}

export const toastCenter = (message) => {
    ToastAndroid.show(message, ToastAndroid.LONG, ToastAndroid.CENTER)
}
