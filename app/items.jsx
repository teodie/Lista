import { View, Text, StyleSheet } from 'react-native'
import { useLocalSearchParams } from 'expo-router';


const items = () => {
const { data, total } = useLocalSearchParams(); 
  const person = JSON.parse(data)
  const items = person.items

  return (
    <View style={styles.container}>

      <Text style={styles.nameText}>
        {person.name}
      </Text>

      <Text>
        {total}
      </Text>

        {items.map((item, index) => (
          <Text key={index}> {item.product} - {item.price}</Text>
        ))}



    </View>
  )
}

export default items

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  nameText: {
    fontSize: 40,
    fontWeight: "bold",
  }
});