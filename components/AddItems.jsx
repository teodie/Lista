import { MaterialIcons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native'
import NewItemsView from './NewItemsView';
import NoItems from './NoItems';
import { MODE } from '../constants/mode';
import VoiceTyping from './VoiceTyping';
import ManualInput from './ManualInput';
import { Divider } from 'react-native-paper'
import Toggle from './Toggle';
import { useData } from '@/utils/userdata-context';
import { useItems } from '@/utils/items-context';
import { useClient } from '@/utils/client-context';

const AddItems = () => {
  const { createItem, fetchClientItems } = useItems()
  const { updateClient, clientId, fetchClientById } = useClient()
  const { setMode } = useData()
  const [items, setItems] = useState([]);
  const [enableVoiceType, setEnableVoiceType] = useState(true);
  // text input Variables
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [clientName, setClientName] = useState()
  const [avatar, setAvatar] = useState()
  const [subTotal, setSubTotal] = useState(0)

  const editItem = (id) => {
    setEnableVoiceType(false)
    const item = items.find((item) => item.id === id)
    setProductName(item.productName)
    setPrice(String(item.price))
    deleteItem(id)
  }

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const saveItems = async (id) => {
    try {
      // Create item in appwrite data base
      const clientItemsOnDatabase = await fetchClientItems(clientId, false)
      // Calculate the total for the items to be added and the current items on the database
      const totalOfCurrentItems = items.reduce((acc, item) => item.price + acc, 0)
      const totalOfItemsOnDatabase = clientItemsOnDatabase ? clientItemsOnDatabase.reduce((acc, item) => item.price + acc, 0) : 0

      console.log("total of items on database: ", totalOfItemsOnDatabase)
      // udpate the itemtotal of the person on the database
      items.forEach(async (element) => {
        await createItem({ productName: element.productName, price: element.price }, element.id)
      });

      const grandTotal = totalOfCurrentItems + totalOfItemsOnDatabase
      // Update the itemsTotal column of the client with the same id
      updateClient(id, { itemsTotal: grandTotal })
      setItems([])
      setMode(MODE.IDLE)
    } catch (error) {
      console.log(error)
    }

  }

  const handleExitPress = () => {
    setItems([]);
    setMode(MODE.IDLE)
  }

  useEffect(() => {
    const client = async () => {
      const response = await fetchClientById(clientId)
      setClientName(response.name)
      setAvatar(response.avatar)
    }

    client()
  }, [])

  useEffect(() => {
    setSubTotal(items.reduce((acc, item) => {
      return acc + Number(item.price)
    }, 0))
  }, [items])

  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#EBEFF0',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <View style={{
        height: '50%',
        width: '80%',
        elevation: 10,
        borderRadius: 10,
        backgroundColor: 'white',
      }}>

        <View style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 70,
          backgroundColor: '#5959B2',
          borderColor: 'red',
          borderTopLeftRadius: 9,
          borderTopRightRadius: 9,
        }} >

          <TouchableOpacity onPress={handleExitPress} >
            < MaterialIcons name="chevron-left" size={40} color="white" />
          </TouchableOpacity>

          {
            avatar && <Image source={{ uri: avatar }} style={{ height: 45, width: 45, borderRadius: 23 }} />
          }

          
          <Text style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 600
          }}
          >
            {clientName}
          </Text>

          <Toggle enableVoiceType={enableVoiceType} setEnableVoiceType={setEnableVoiceType} />

        </View>

        <View style={{
          paddingHorizontal: 20,
          flex: 1,
        }}>

          {enableVoiceType
            ? <VoiceTyping setItems={setItems} items={items} />
            : <ManualInput
              productName={productName} setProductName={setProductName}
              price={price} setPrice={setPrice}
              setItems={setItems} items={items}
            />
          }

          <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
              {
                items.map((item) => <NewItemsView key={item.id} item={item} deleteItem={deleteItem} editItem={editItem} />)
              }
            </ScrollView>
          </View>


          <Divider style={{ height: 1.5, marginBottom: 10 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, color: '#281344' }}>Subtotal:</Text>
            <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#281344' }}>{subTotal}.00</Text>
          </View>
          <View style={{
            alignSelf: 'center',
            height: 40,
            elevation: 3,
            paddingHorizontal: 25,
            borderRadius: 20,
            marginVertical: 20,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#5959B2',
          }} >
            <TouchableOpacity onPress={() => saveItems(clientId)} >
              <Text style={styles.saveTxt} > Save </Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>

    </View>
  )
}

export default AddItems

const styles = StyleSheet.create({
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#EBEFF0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  addItemContainer: {
    minHeight: 250,
    maxHeight: 450,
    width: '80%',
    elevation: 10,
    borderRadius: 10,
    backgroundColor: 'white',
  },

  saveBtn: {
    alignSelf: 'center',
    height: 40,
    elevation: 2,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5959B2',
  },
  saveTxt: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  header: {
    width: '100%',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 70,
    backgroundColor: 'papayawhip',
    borderColor: 'red',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerTxt: {
    color: 'white',
    fontSize: 20,
    fontWeight: 600,
  },


})