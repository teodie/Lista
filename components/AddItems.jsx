import { AddItemContext } from '@/context'
import { MaterialIcons } from '@expo/vector-icons'
import React, { useState, useRef } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, KeyboardAvoidingView, Pressable } from 'react-native'
import NewItemsView from './NewItemsView';
import uuid from 'react-native-uuid';
import NoItems from './NoItems';
import { MODE } from '../constants/mode';

const AddItems = ({ personData, setUtang, utang, setMode }) => {

  const [items, setItems] = useState([]);

  const productInputRef = useRef(null);
  const priceInputRef = useRef(null);

  const [editingItemId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  // text input Variables
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');

  const [icon, setIcon] = useState('add-box')
  const [ableToEdit, setAbleToEdit] = useState(true)


  const newItem = () => {
    const generateNewId = uuid.v4()
    if (!productName || !price) return Alert.alert('Product name or Price is empty');

    setItems([{ "id": generateNewId, product: productName, price: Number(price) }, ...items])
    setProductName('')
    setPrice('')

    productInputRef.current?.focus()
  }

  const saveEditedItem = (id) => {

    setItems([{ id: id, product: productName, price: Number(price) }, ...items])
    setProductName('')
    setPrice('')

    setIsEditing(false)
    setEditingId(null)

  }

  const editItem = (id) => {
    setIsEditing(true)
    setEditingId(id)

    const item = items.find((item) => item.id === id)

    deleteItem(id)
    setProductName(item.product)
    setPrice(String(item.price))
  }

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const saveItems = (personId) => {
    setUtang(utang.map((item) =>
      item.id == personId
        ? { ...item, items: [...(item.items || []), ...items] }
        : item))

    items.length === 0
      ? Alert.alert("Emty Items!")
      : setMode(MODE.IDLE)

    setProductName('')
    setPrice('')
    setItems([])

  }

  return (
    <View style={styles.processingOverlay}>

      <KeyboardAvoidingView behavior='padding'>
        <View style={styles.addItemContainer}>

          <View style={styles.header} >

            <TouchableOpacity style={styles.exitBtn}
              onPress={() => {
                setItems([]);
                setMode(MODE.IDLE)
                setIcon('add-box')
              }}
            >
              < MaterialIcons name="exit-to-app" size={30} color="white" />
            </TouchableOpacity>

            <Text style={styles.headerTxt}>{personData.name}</Text>

            <Text style={styles.headerTxt} >{new Date().toLocaleDateString()}</Text>
          </View>
          <View style={styles.textInputContainer}>

            <TextInput style={styles.textInputProduct}
              ref={productInputRef}
              placeholder='Product Name'
              value={productName}
              onChangeText={setProductName}
              autoFocus={true}
              editable={ableToEdit}
              onSubmitEditing={() => priceInputRef.current?.focus()}
            />

            <TextInput style={styles.textInputPrice}
            ref={priceInputRef}
              placeholder='Price'
              keyboardType='numeric'
              value={price}
              onChangeText={setPrice}
              editable={ableToEdit}
              onSubmitEditing={() => newItem()}
            />

            <TouchableOpacity

              onLongPress={() => { setIcon('mic'); setAbleToEdit(false) } }

              onPress={() => {

                if (icon === 'mic') {
                  setIcon('add-box')
                  setAbleToEdit(true)
                  return
                }

                isEditing
                  ? saveEditedItem(editingItemId)
                  : newItem()
                
                
              }

              } >

              <MaterialIcons name={icon} size={50} color='#5959B2' />
            </TouchableOpacity>

          </View>

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
          <TouchableOpacity
            onPress={() => saveItems(personData.id)}
          >
            <Text style={styles.saveTxt} >
              Save
            </Text>
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
    // backgroundColor: 'white',
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
  textInputProduct: {
    borderWidth: 1,
    flex: 2,
    borderRadius: 10,
  },
  textInputPrice: {
    borderWidth: 1,
    flex: 1,
    borderRadius: 10,
    borderColor: 'black'
  },
  textInputContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    alignItems: 'center',
    padding: 10,
    // borderWidth: 1,
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
  }

})