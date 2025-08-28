import { View, Text, StyleSheet, FlatList } from 'react-native'
import { useLocalSearchParams } from 'expo-router';


const ProductOverview = ({ item }) => {
  return (
    <View style={styles.overView}>
      <Text style={styles.itemsTxt} >{item.product}</Text>
      <Text style={styles.itemsTxt} >{item.price}</Text>
      <Text style={styles.itemsTxt} >{item.date}</Text>
    </View>
  );
}

const Total = ({ title, amount }) => {
  return (
    <View style={styles.totalContainer}>
      <Text style={styles.totalTxt}>{title}</Text>
      <Text style={styles.headerTxt}>{amount}</Text>
    </View>
  );
}


const items = () => {
  const { data, total } = useLocalSearchParams();
  const person = JSON.parse(data)
  const grandTotal = Number(total) + Number(person.balance)
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTxt}>{person.name}</Text>
        <Total title="Balance" amount={person.balance} />
        <Total title="Total" amount={grandTotal} />
      </View>

      <View>
        <FlatList
          data={person.items}
          renderItem={({ item }) => <ProductOverview item={item} />}
        />
      </View>
      <Text style={[ styles.headerTxt, {alignSelf: 'center', marginTop: 10}]} >{total}</Text>
    </View>
  )
}


export default items

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20
  },
  nameText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  overView: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTxt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5959B2',
  },
  itemsTxt: {
    flex: 1,
    textAlign: 'center'
  },
  totalTxt: {
    fontSize: 15,
    fontWeight: '500',
    color: '#5959B2',
  },
  totalContainer: {
    alignItems: 'center'
  }
});