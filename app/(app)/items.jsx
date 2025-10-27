import { View, StyleSheet, FlatList, Alert, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react';
import { useData } from '@/utils/userdata-context';
import { useClient } from '@/utils/client-context';
import { useItems } from '@/utils/items-context';
import { Ionicons, FontAwesome6, FontAwesome } from '@expo/vector-icons'
import { ScrollView } from 'react-native-gesture-handler';

import { Modal, Portal, Text, Button, PaperProvider, Divider, SegmentedButtons, TextInput } from 'react-native-paper';
import { CustomModal } from '@/components/ModalContainer';
import { useRouter } from 'expo-router';

function formatAppwriteDate(createdAt) {
  const date = new Date(createdAt);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });
}

const Paid = () => (
  <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', gap: 5 }} >
    <View style={{ borderRadius: 10, backgroundColor: '#43A55A', padding: 2, alignItems: 'center', justifyContent: 'center', height: 20, width: 20 }}>
      <FontAwesome name="check" size={12} color="white" />
    </View>
    <Text style={{ fontWeight: 500, color: '#43A55A' }}>Paid</Text>
  </View>
)

const Unpaid = () => (
  <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', gap: 5 }} >
    <View style={{
      borderRadius: 10, padding: 2, height: 15, width: 15,
      borderWidth: 3, borderColor: '#C44250',
    }}
    />
    <Text style={{ fontWeight: 500, color: '#C44250' }}>Unpaid</Text>
  </View>
)

const items = () => {
  const { personData, setPersonData } = useData()
  const [clientData, setClientData] = useState([])
  const { updateItem } = useItems()
  const { fetchClientById, clientId, updateClient } = useClient()
  const [value, setValue] = useState('unpaid');
  const [filteredItems, setFilteredItems] = useState([])
  const [visible, setVisible] = useState(false)
  const [total, setTotal] = useState(0)

  const router = useRouter()

  const [payment, setPayment] = useState(0)



  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const clientRow = await fetchClientById()
        const balance = Number(clientRow.balance) || 0
        setClientData(clientRow)

        // Calculate unpaid total safely
        const unpaidTotal = personData.reduce((acc, item) => {
          const price = Number(item.price) || 0
          return !item.paid ? acc + price : acc
        }, 0)

        setTotal(unpaidTotal + balance)
      } catch (error) {
        console.log("Error fetching client data:", error)
      }
    }

    console.log("Items component has been mounted")
    fetchClientData()
  }, [personData])


  useEffect(() => {
    if (value === 'paid') {
      setFilteredItems(personData.filter((item) => item.paid === true))
    } else if (value === 'unpaid') {
      setFilteredItems(personData.filter((item) => item.paid === false))
    } else {
      setFilteredItems(personData)
    }

  }, [value, personData])

  const setItemsToPaid = () => {
    const response = personData.filter((item) => item.paid === false)

    if (response.length !== 0) {
      response.forEach(async (element) => {
        await updateItem(element.$id, { paid: true })
      });
    }
  }


  const handlePaymentPress = async () => {
    // Calculate change
    const change = total - Number(payment)

    if (change > 0) {
      updateClient(clientId, { balance: change, itemsTotal: 0 })
      Alert.alert(`Balance of ${change}`)
    }
    if (change <= 0) {
      updateClient(clientId, { balance: 0, itemsTotal: 0 })
      change < 0 && Alert.alert(`Change of: ${-change}`)
    }


    // set the current unpaid items to paid = true
    setItemsToPaid()

    setPayment(0)
    setVisible(false)
    router.replace('/')
  }

  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        <View
          style={{
            height: 90,
            // borderWidth: 1,
            marginVertical: 10,
            paddingHorizontal: 10,
            borderRadius: 10,
            justifyContent: 'space-between',
            flexDirection: 'row',
            backgroundColor: '#A9DDEA',

          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {
              clientData?.avatar
                ? <Image source={{ uri: clientData.avatar }} style={{ height: 50, width: 50, borderRadius: 25 }} />
                : <Ionicons name="person-circle-sharp" size={55} color='#5959B2' />
            }
            <View>
              <Text style={{ fontSize: 25, fontWeight: 500 }}>{clientData.name}</Text>
              <Text>Balance: {clientData.balance}</Text>
            </View>
          </View>

          <View style={{ justifyContent: 'center', }}>
            <Text>Balance Due</Text>
            <Text style={{ fontSize: 30, fontWeight: 700 }}>{total}.00</Text>
          </View>
        </View>

        <SegmentedButtons
          style={{ marginVertical: 10 }}
          value={value}
          onValueChange={setValue}
          buttons={[
            {
              value: 'unpaid',
              label: 'Unpaid',
            },
            {
              value: 'paid',
              label: 'Paid',
            },
            {
              value: 'all',
              label: 'All',
            },
          ]}
        />

        <View style={{ flex: 1 }}>

          <View style={{
            flexDirection: 'row', marginVertical: 8,
          }}>
            <Text style={{ fontWeight: 700, flex: 3, textAlign: 'center' }} >Item</Text>
            <Text style={{ fontWeight: 700, flex: 1, textAlign: 'center' }} >Amount</Text>
            <Text style={{ fontWeight: 700, flex: 1, textAlign: 'center' }} >Date</Text>
            <Text style={{ fontWeight: 700, flex: 1, textAlign: 'center' }} >Status</Text>
          </View>

          <Divider />

          {
            filteredItems.map((item, index) =>
              <View key={index} >
                <View  style={{
                  flexDirection: 'row', marginVertical: 8,
                }}>
                  <Text style={{ flex: 3 }} >{item.productName}</Text>
                  <Text style={{ flex: 1, textAlign: 'center' }} >{item.price}.00</Text>
                  <Text style={{ flex: 1, textAlign: 'center' }} >{formatAppwriteDate(item.$createdAt)}</Text>
                  {
                    item.paid
                      ? <Paid />
                      : <Unpaid />
                  }
                </View>
                <Divider />
              </View>

            )
          }

        </View>

        {
          value === 'unpaid' &&
          <Button
            mode='contained'
            style={{ marginVertical: 20 }}
            disabled={filteredItems.length === 0 ? true : false}
            onPress={() => setVisible(prev => !prev)}
          >Record Payment</Button>
        }

        <CustomModal
          children={
            <View style={{ width: '80%', gap: 20, alignSelf: 'center' }}>
              <View style={{ alignSelf: 'center', alignItems: 'center' }}>
                <Text>Total Amount:</Text>
                <Text style={{ fontSize: 30, fontWeight: 700 }}>{total}</Text>
              </View>
              <TextInput
                label="Tendered Amount"
                keyboardType='numeric'
                value={payment}
                onChangeText={setPayment}
              />
              <Button mode='contained'
                onPress={handlePaymentPress}
              >Submit</Button>
            </View>
          }
          visible={visible} setVisible={setVisible} />

      </ScrollView>
    </PaperProvider>
  )
}


export default items

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: 'white',
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
  },
  bottomShadow: {
    position: 'absolute',
    bottom: 25, // distance from bottom of parent
    left: 30,
    right: 30,
    height: 6,
    borderRadius: 10,
    backgroundColor: '#000',
    opacity: 0.2,
    elevation: 6,
  },

});