import { View, StyleSheet, FlatList, Alert, TouchableOpacity, Image, } from 'react-native'
import React, { useEffect, useState } from 'react';
import { useData } from '@/utils/userdata-context';
import { useClient } from '@/utils/client-context';
import { useItems } from '@/utils/items-context';
import { Ionicons } from '@expo/vector-icons'
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Text, PaperProvider, Divider, SegmentedButtons, TextInput, IconButton } from 'react-native-paper';
import { CustomModal } from '@/components/ModalContainer';
import { useRouter } from 'expo-router';
import ItemList from '@/components/itemList';
import vibrate from '@/utils/vibrate';
import EditItemRow from '@/components/editItemRow';
import { KeyboardAvoidingView, KeyboardStickyView } from 'react-native-keyboard-controller';
import { formatDate_MM_DD_YYYY } from '@/utils/formatDate';
import toast from '@/utils/toast';
import Overlay from '@/components/Overlay';
import TextScaled from '@/components/TextScaled';


const items = () => {
  const { personData, setPersonData } = useData()
  const [clientData, setClientData] = useState([])
  const { updateItem, deleteItem } = useItems()
  const { fetchClientById, clientId, updateClient } = useClient()
  const [value, setValue] = useState('unpaid');
  const [filteredItems, setFilteredItems] = useState([])
  const [visible, setVisible] = useState(false)
  const [total, setTotal] = useState(0)

  const [editItemModalShow, setEditItemModalShow] = useState(false)
  const [selectedItem, setSelectedItem] = useState()

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

  const hanldeLongPress = (item) => {
    vibrate()
    setSelectedItem(item)
    setEditItemModalShow(true)
  }

  const confirmAlert = (title, message) => {
    return new Promise((resolve) => {
      Alert.alert(
        title,
        message,
        [
          { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
          { text: 'Delete', style: 'default', onPress: () => resolve(true) },
        ],
        { cancelable: false }
      )
    }
    )
  }

  const deleteItemToTheDatabase = async (id, item) => {

    const confirmed = await confirmAlert(
      `Delete Item`,
      `This action is ireversable. Deleting item ${item.productName} with a cost of ${item.price} will be permanently deleted.`
    )

    if (!confirmed) return 'failed'

    await deleteItem(id)
    toast("Item deleted")
    return 'success'
  }

  const deleteItemToLocalState = (id) => {
    setPersonData(
      personData.filter(
        (item) =>
          item.$id !== id
      )
    )
  }

  const updateClientBalance = async (newItemsTotal) => {

    await updateClient(clientId, { itemsTotal: newItemsTotal })
  }

  const handleDeleteItem = async (id, item) => {

    if (await deleteItemToTheDatabase(id, item) === 'failed') return console.log("Failed to delete")

    deleteItemToLocalState(id)

    updateClientBalance(total - item.price)

    setEditItemModalShow(false)
  }

  const handleOnchageText = (field, value) => {
    setSelectedItem({ ...selectedItem, [field]: field === 'price' ? Number(value) : value })
  }

  const calculateTheItemsTotal = (items) => {
    const itemsTotal = items.reduce((acc, item) => {

      if (item.$id !== selectedItem.$id) {
        return acc + item.price
      }
      return acc + 0
    }, 0)

    return itemsTotal
  }

  const handleSubmit = () => {

    // update the item to the database
    updateItem(selectedItem.$id, selectedItem)
    // update the local state
    setPersonData(personData.map((item) => item.$id === selectedItem.$id ? selectedItem : item))

    const itemsTotal = calculateTheItemsTotal(personData)

    updateClientBalance(itemsTotal + selectedItem.price)

    setEditItemModalShow(false)
  }

  return (
    <PaperProvider style={{
      position: 'relative'
    }}>
      <ScrollView style={styles.container}>
        <View
          style={{
            height: 90,
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
              <TextScaled 
              style={{ color: 'black', fontWeight: 500, color: 'black' }} 
              fontSize={25}
              >{clientData.name}</TextScaled>
              <TextScaled style={{ color: 'black' }} >Balance: {clientData.balance}</TextScaled>
            </View>
          </View>

          <View style={{ justifyContent: 'center', }}>
            <TextScaled style={{ color: 'black' }}>Balance Due</TextScaled>
            <TextScaled style={{ color: 'back', fontWeight: 700 }}
              fontSize={30}
            >{total}.00</TextScaled>
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
            <TextScaled style={{ color: 'black', fontWeight: 700, flex: 3, textAlign: 'center' }} >Item</TextScaled>
            <TextScaled style={{ color: 'black', fontWeight: 700, flex: 1, textAlign: 'center' }} >Amount</TextScaled>
            <TextScaled style={{ color: 'black', fontWeight: 700, flex: 1, textAlign: 'center' }} >Date</TextScaled>
          </View>

          <Divider />

          {
            filteredItems.map((item, index) => <ItemList
              key={index}
              item={item}
              onLongPress={() => hanldeLongPress(item)}
            />)
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
                <TextScaled>Total Amount:</TextScaled>
                <TextScaled style={{ fontWeight: 700 }} fontSize={30}>{total}</TextScaled>
              </View>
              <TextInput
                label="Binayad"
                keyboardType='numeric'
                value={payment}
                onChangeText={setPayment}
              />
              <Button mode='contained'
                onPress={handlePaymentPress}
              >Pay</Button>
            </View>
          }
          visible={visible} setVisible={setVisible} />

      </ScrollView>

      {
        editItemModalShow &&
        <Overlay>
          <KeyboardAvoidingView
            behavior={"padding"}
            keyboardVerticalOffset={100}
          >
            <View
              style={{
                backgroundColor: 'white',
                padding: 10,
                width: '90%',
                maxWidth: 350,
                alignSelf: 'center',
                borderRadius: 10,
                elevation: 4,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }} >

                <Text variant='titleLarge' style={{ color: 'black', fontWeight: 'bold', }} >Item Details</Text>
                <IconButton icon="trash-can" mode='contained' size={20} onPress={() => handleDeleteItem(selectedItem.$id, selectedItem)} />

              </View>

              <EditItemRow label='Name:' value={selectedItem.productName} field="productName"
                handleOnchageText={handleOnchageText}
              />
              <EditItemRow label='Price:' value={String(selectedItem.price)} field="price" handleOnchageText={handleOnchageText} />
              <EditItemRow label='Purchase Date:' value={formatDate_MM_DD_YYYY(selectedItem.date)} field='date' handleOnchageText={handleOnchageText} />

              <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                gap: 10,
                marginTop: 15,
              }}>

                <Button
                  mode='outlined'
                  textColor='black'
                  onPress={() => setEditItemModalShow(false)}
                >Cancel</Button>

                <Button
                  mode='contained'
                  onPress={handleSubmit}
                >Edit Item</Button>
              </View>

            </View>
          </KeyboardAvoidingView>
        </Overlay>

      }


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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});