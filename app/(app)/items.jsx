import { View, Text, StyleSheet, FlatList, SectionList } from 'react-native'
import { useEffect, useState } from 'react';
import { useData } from '@/utils/userdata-context';
import NoItems from '@/components/NoItems'
import { useClient } from '@/utils/client-context';


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

const PaymentView = ({ personData, clientData }) => {

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTxt}>{personData.name}</Text>
        <Total title="Balance" amount={clientData.balance} />
        <Total title="Payable" amount={clientData.balance + clientData.itemsTotal} />
      </View>

      {
        personData.length === 0
          ? <NoItems />
          : <>
            <FlatList
              data={personData}
              renderItem={({ item }) => <ProductOverview item={item} />}
            />
            <Text style={[styles.headerTxt, { alignSelf: 'center', marginTop: 10 }]} >{clientData.itemsTotal}</Text>
          </>
      }


    </>
  );
}

const items = () => {
  const { personData } = useData()
  const [clientData, setClientData] = useState(null)
  const { fetchClientById } = useClient()


  useEffect(() => {
    const fetchClientData = async () => {
      const clientRow = await fetchClientById()
      setClientData(clientRow)
    }

    // fetch the client data for the balance and items total
    console.log("Items component has been mounted")
    fetchClientData()

  }, [])

  return (
    <View style={styles.container}>

      <View >

        {personData !== null && clientData !== null
          && <PaymentView personData={personData} clientData={clientData} />
        }

      </View>

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