import { View, ActivityIndicator } from "react-native";


const waiting = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#5959B2" />
        </View>
    )
}

export default waiting

