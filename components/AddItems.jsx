
import { MaterialIcons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, FlatList, KeyboardAvoidingView } from 'react-native'
import NewItemsView from './NewItemsView';
import NoItems from './NoItems';
import { MODE } from '../constants/mode';
import VoiceTyping from './VoiceTyping';
import ManualInput from './ManualInput';
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
    }

    client()
  }, [])

  return (
    <View style={styles.processingOverlay}>

      <KeyboardAvoidingView behavior='padding'>
        <View style={styles.addItemContainer}>

          <View style={styles.header} >

            <TouchableOpacity style={styles.exitBtn} onPress={handleExitPress} >
              < MaterialIcons name="exit-to-app" size={30} color="white" />
            </TouchableOpacity>

            <Text style={styles.headerTxt}>{clientName}</Text>

            <Toggle enableVoiceType={enableVoiceType} setEnableVoiceType={setEnableVoiceType} />

          </View>

          {enableVoiceType
            ? <VoiceTyping setItems={setItems} items={items} />
            : <ManualInput
              productName={productName} setProductName={setProductName}
              price={price} setPrice={setPrice}
              setItems={setItems} items={items}
            />
          }

          {items.length === 0
            ? <NoItems />
            : <FlatList
              data={items}
              renderItem={({ item }) => <NewItemsView item={item} deleteItem={deleteItem} editItem={editItem} />}
              keyExtractor={item => item.id}
            />
          }
        </View>


        <View style={styles.saveBtn} >
          <TouchableOpacity onPress={() => saveItems(clientId)} >
            <Text style={styles.saveTxt} > Save </Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>

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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  addItemContainer: {
    borderWidth: 1,
    minHeight: 250,
    maxHeight: 450,
    width: '80%',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
  },


  exitBtn: {
    transform: [{ rotate: '180deg' }],
  },
  saveBtn: {
    // borderWidth: 1,
    alignSelf: 'flex-end',
    height: 40,
    width: 90,
    marginTop: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5959B2',
  },
  saveTxt: {
    color: 'white',
    fontSize: 24,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#5959B2',
    height: 70,
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
  },
  headerTxt: {
    color: 'white',
    fontSize: 20,
    fontWeight: 600,
  },


})