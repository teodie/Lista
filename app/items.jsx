import { View, Text, StyleSheet, FlatList, SectionList, Button } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { archieveData } from '@/constants/utangList';
import { useContext, useEffect, useState } from 'react';
import { PersonDataContext } from '@/context';


const fetchData = async () => {
  // Fetching the data
  console.log('Fetching Data....')
  try {
    const getJsonValue = await AsyncStorage.getItem('Archieve')
    const archieveStorage = getJsonValue != null ? JSON.parse(getJsonValue) : null;
    return archieveStorage ? archieveStorage : archieveData;
  } catch (e) {
    console.log(e)
  }
}

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

const ArchieveView = ({ sectionData }) => {
  return (
    <>
      <SectionList
        sections={sectionData}
        renderItem={({ item }) => (
          <ProductOverview item={item} />
        )}
        renderSectionHeader={({ section: { date } }) => (
          <Text>{date}</Text>
        )}
      />
    </>
  );
}

const PaymentView = ({ personData }) => {
  return (
    <>
      <FlatList
        data={personData.items}
        renderItem={({ item }) => <ProductOverview item={item} />}
      />
    </>
  );
}



const items = () => {
  const { personData, archieveVisible } = useContext(PersonDataContext)

  const itemTotal = personData.items.reduce((acc, element) => acc + element.price, 0)
  const grandTotal = personData.balance + itemTotal
  const [sectionData, setSectionData] = useState([])

  useEffect( () => {
    const getArchieveData = async () => {
      // Retrieve the data from the memory
      const archieveData = await fetchData()
      // filter the data for the specifict user
      const filterData = archieveData.filter((element) => element.id === personData.id)
  
      // create a new array with just the needed data for section list
      const secData = filterData.map((element) => { return { data: [...element.items], date: element.paidDate } })
      setSectionData(secData)
    }

    getArchieveData();
  } , [])


  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTxt}>{personData.name}</Text>
        <Total title="Balance" amount={personData.balance} />
        <Total title="Total" amount={grandTotal} />
      </View>


      <View>
        {archieveVisible
          ? <ArchieveView sectionData={sectionData} />
          : <PaymentView personData={personData} />
        }
      </View>


      <Text style={[styles.headerTxt, { alignSelf: 'center', marginTop: 10 }]} >{itemTotal}</Text>
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
  },
});