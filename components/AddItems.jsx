
import { MaterialIcons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, KeyboardAvoidingView, Pressable } from 'react-native'
import NewItemsView from './NewItemsView';
import NoItems from './NoItems';
import { MODE } from '../constants/mode';
import VoiceTyping from './VoiceTyping';
import ManualInput from './ManualInput';
import Toggle, { SwitchVoiceTyping } from './Toggle';
import { useData } from '@/utils/userdata-context';

const AddItems = () => {
  const { personData, setUtang, utang, setMode } = useData()
  const [items, setItems] = useState([]);
  const [enableVoiceType, setEnableVoiceType] = useState(true);
  // text input Variables
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');


  const editItem = (id) => {
    setEnableVoiceType(false)
    const item = items.find((item) => item.id === id)
    setProductName(item.product)
    setPrice(String(item.price))
    deleteItem(id)
  }

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const genDate = () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = new Date().toLocaleDateString('en-US', options);
    return dateString
  }

  const saveItems = (personId) => {
    const date = genDate()
    
    const newItems = items.map((item) => { return { ...item, date: date } })
    setUtang(utang.map((item) =>
      item.id == personId
        ? { ...item, items: [...(item.items || []), ...newItems] }
        : item))

    items.length === 0
      ? Alert.alert("Emty Items!")
      : setMode(MODE.IDLE)

    setItems([])

  }

  const handleExitPress = () => {
    setItems([]);
    setMode(MODE.IDLE)
  }

  return (
    <View style={styles.processingOverlay}>

      <KeyboardAvoidingView behavior='padding'>
        <View style={styles.addItemContainer}>

          <View style={styles.header} >

            <TouchableOpacity style={styles.exitBtn} onPress={handleExitPress} >
              < MaterialIcons name="exit-to-app" size={30} color="white" />
            </TouchableOpacity>

            <Text style={styles.headerTxt}>{personData.name}</Text>

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
          <TouchableOpacity onPress={() => saveItems(personData.id)} >
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