import { View, Text, StyleSheet, FlatList, SectionList, Button } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  useEffect, useState } from 'react';
import { fetchArchieveData, IndividualArchieveData } from '@/utils/fetchArchieveData';
import { exportToCSV } from '@/utils/jsonToCsv';
import { useData } from '@/utils/userdata-context';
import { useClient } from '@/utils/client-context'

const ProductOverview = ({ item }) => {

  function formatAppwriteDate(createdAt) {
    const date = new Date(createdAt);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric"
    });
  }

  return (
    <View style={styles.overView}>
      <Text style={styles.itemsTxt} >{item.productName}</Text>
      <Text style={styles.itemsTxt} >{item.price}</Text>
      <Text style={styles.itemsTxt} >{formatAppwriteDate(item.$createdAt)}</Text>
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

const ArchieveView = ({ sectionData, id, name }) => {

  const handleDownloadPress = async () => {
    console.log("Fetching Individual data")
    const personData = await IndividualArchieveData(id)
    // save the individual data
    exportToCSV(personData, `${name}_Bayad_na` )
  }

  return (
    <>
      <Text style={[styles.headerTxt, { alignSelf: 'center' }]}>Paid Items</Text>
      <SectionList
        sections={sectionData}
        renderItem={({ item }) => (<ProductOverview item={item} />)}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text>{section.header.date}</Text>
            <Total title="P_Balance" amount={section.header.balance} />
            <Total title="I_Total" amount={section.header.total} />
            <Total title="Paid" amount={section.header.paidAmount} />
            <Total title="Balance" amount={section.header.remainingBalance} />
          </View>
        )} />

      <Button title='Download' onPress={handleDownloadPress} />
    </>
  );
}


const PaymentView = ({ personData, itemTotal, grandTotal }) => {
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTxt}>{personData.name}</Text>
        <Total title="Balance" amount={personData.balance} />
        <Total title="Total" amount={grandTotal} />
      </View>
      <FlatList
        data={personData}
        renderItem={({ item }) => <ProductOverview item={item} />}
      />
      <Text style={[styles.headerTxt, { alignSelf: 'center', marginTop: 10 }]} >{itemTotal}</Text>
    </>
  );
}



const items = () => {
  const { personData, archieveVisible } = useData()
  const { fetchClientById, setClientId } = useClient()
  const [balance, setBalance] = useState(null)

  const fetchBalance = async () => {
    try {
      const response = await fetchClientById()
      console.log("Response: ", response)

      return setBalance(response.balance)
    } catch (error) {
      console.log(error)
      return setBalance(null)
    }
    
  }

  const itemTotal = personData.reduce((acc, element) => acc + element.price, 0)
  const grandTotal = balance + itemTotal
  const [sectionData, setSectionData] = useState([])

  useEffect(() => {
    const getArchieveData = async () => {
      // Retrieve the data from the memory
      const archieveData = await fetchArchieveData()
      // filter the data for the specifict user
      const filterData = archieveData.filter((element) => element.id === personData.id)
      // create a new array with just the needed data for section list
      const secData = filterData.map((element) => { return { data: [...element.items], header: { date: element.paidDate, paidAmount: element.paidAmount, remainingBalance: element.remainingBalance, total: element.total, balance: element.balance } } })
      setSectionData(secData)
    }

    // getArchieveData();
  }, [archieveVisible])


  const handleWipe = async () => {
    try {
      console.log("Wipping the data")
      await AsyncStorage.removeItem('Archieve')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <View style={styles.container}>

      <View >
        {archieveVisible
          ? <ArchieveView sectionData={sectionData} id={personData.id} name={personData.name} />
          : <PaymentView personData={personData} grandTotal={grandTotal} itemTotal={itemTotal} />
        }
      </View>

      {/* <Button
        disabled={true}
        title='Wipe Data'
        onPress={() => handleWipe()}
      /> */}

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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  archieveContainer: {
    borderWidth: 1,
  }

});