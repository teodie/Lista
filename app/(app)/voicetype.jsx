import { View, TextInput, Image, TouchableOpacity, FlatList, Keyboard } from 'react-native'
import { Button, Divider, Text } from 'react-native-paper';
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { KeyboardProvider, KeyboardStickyView } from "react-native-keyboard-controller";
import KeyBoardDismisView from '@/components/KeyBoardDismis';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Item from '@/components/Item';
import { useClient } from '@/utils/client-context';
import Animated, { LinearTransition, useSharedValue, useDerivedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import ClientView from '@/components/ClientView';
import { ID } from 'react-native-appwrite';
import { useItems } from '@/utils/items-context';
import { useRouter } from 'expo-router';

const initialValue = {
  avatar: '',
  name: '',
  id: '',
}

const reducer = (state, action) => {
  switch (action.type) {
    case "SET-NAME":
      return { ...state, name: action.value }
    case "SET-CRED":
      return { name: action.name, avatar: action.avatar, id: action.id }
  }

}

const voicetype = () => {
  const offset = { closed: -20, opened: 0 };
  const [state, dispatch] = useReducer(reducer, initialValue)
  const [text, setText] = useState('kenny sibuyas 5 bawang 17 tuyo 20 shampoo 10')
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [showTextInput, setShowTextInput] = useState(false)
  const { updateClient } = useClient()
  const { createItem, fetchClientItems } = useItems()
  const { clientId, setClientId } = useClient()

  const router = useRouter()

  const { clients } = useClient()
  const [filteredClients, setFilteredClients] = useState()

  const open = useSharedValue(false)
  const height = useSharedValue(300);

  const deleteItem = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, [])

  const editItem = useCallback((id, productName, price) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, productName, price } : item
      )
    )
  }, [])

  const derivedHeight = useDerivedValue(() => {
    return withTiming(height.value * Number(open.value), { duration: 500 })
  }
  );

  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  const toggleAccordion = useCallback(() => {
    setShowTextInput(prev => !prev)
    open.value = !open.value
    Keyboard.dismiss()
  }, [])

  useEffect(() => {
    filterClient()
  }, [search, clients])

  const filterClient = () => {
    search === ''
      ? setFilteredClients(clients)
      : setFilteredClients(clients.filter((client) => client.name?.toLowerCase().includes(search.toLowerCase())))
  }

  const handleAddPress = async () => {
    const textArray = text.split(" ")
    // pop the first word which it the name
    const shiftedName = textArray.shift()
    // set the items
    setItems(converToObj(textArray))
    setSearch(shiftedName)

    setText('')

    if (filteredClients.length == 0) return
    setClientId(filteredClients[0].$id)

    dispatch({
      type: 'SET-CRED', name: filteredClients[0].name, avatar: filteredClients[0].avatar,
      id: filteredClients[0].$id
    })
  }

  const handleSavePress = async () => {
    if (state.id === '') return
    saveItems(state.id)
  }

  const saveItems = async (id) => {
    try {
      const clientItemsOnDatabase = await fetchClientItems(clientId, false)
      // // Calculate the total for the items to be added and the current items on the database
      const totalOfCurrentItems = items.reduce((acc, item) => Number(item.price) + acc, 0)
      const totalOfItemsOnDatabase = clientItemsOnDatabase ? clientItemsOnDatabase.reduce((acc, item) => item.price + acc, 0) : 0

      console.log("total of items on database: ", totalOfItemsOnDatabase)
      // udpate the itemtotal of the person on the database
      items.forEach(async (element) => {
        console.log(element)
        await createItem({ productName: element.productName, price: Number(element.price) }, element.id)
      });

      const grandTotal = totalOfCurrentItems + totalOfItemsOnDatabase
      // Update the itemsTotal column of the client with the same id
      updateClient(id, { itemsTotal: grandTotal })
      setItems([])
      dispatch({ type: 'SET-CRED', name: '', avatar: '', id: '' })
      router.replace('/')
    } catch (error) {
      console.log(error)
    }

  }

  const converToObj = (txtArr) => {

    const item = []
    let words = []

    for (let i = 0; i < txtArr.length; i += 1) {

      const currentItem = txtArr[i]

      if (Number.isNaN(Number(currentItem))) {
        words.push(currentItem)
      } else {
        item.push({ id: ID.unique(), productName: words.toString().replaceAll(",", " "), price: Number(currentItem) })
        words = []
      }

    }

    return item
  }

  return (
    <KeyboardProvider>
      <KeyBoardDismisView>
        <View style={{ flex: 1 }}>

          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            <View style={{ marginVertical: 20 }}>
              <TouchableOpacity onPress={toggleAccordion}>
                <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                  {
                    state.avatar
                      ? < Image
                        source={{ uri: state.avatar }}
                        style={{ height: 80, width: 80, borderRadius: 40 }}
                      />
                      : < Ionicons name="person-circle-sharp" size={80} color='#5959B2' />
                  }
                </View>
              </TouchableOpacity>
              {
                state.name && <Text
                  variant='titleLarge'
                  style={{ alignSelf: 'center', fontWeight: 'bold' }}
                >{state.name}</Text>
              }
            </View>

            <Divider />

            {
              showTextInput && <TextInput
                style={{ borderWidth: 1, width: '100%', textAlign: 'center', color: 'black', fontSize: 24, fontWeight: 500, marginBottom: 15 }}
                value={search}
                onChangeText={setSearch}
              />
            }

            <Animated.View
              style={[bodyStyle, { overflow: 'hidden' }]}
            >
              <View
                style={{
                  width: '100%',
                }}
              >
                <FlatList
                  showsVerticalScrollIndicator={false}
                  itemLayoutAnimation={LinearTransition.springify()}
                  data={filteredClients}
                  renderItem={({ item }) =>
                    <ClientView data={item} dispatch={dispatch} toggleAccordion={toggleAccordion} />}
                  keyExtractor={item => item.$id.toString()}
                />
              </View>
            </Animated.View>
            <View style={{ gap: 40 }}>
              <FlatList
                data={items}
                renderItem={({ item }) => <Item deleteItem={deleteItem} item={item} editItem={editItem} />}
              />
              <Button mode='contained' disabled={items.length === 0 ? true : false}
                onPress={handleSavePress}
              >Save</Button>
            </View>


          </View>

          <KeyboardStickyView offset={offset} style={{ flexDirection: 'row', gap: 10, backgroundColor: 'white', paddingHorizontal: 20 }}>
            <TextInput
              style={{ height: 40, borderWidth: 1, flex: 1, borderRadius: 20, color: 'black' }}
              value={text}
              onChangeText={(newText) => setText(newText)}
            />
            <TouchableOpacity
              style={{ backgroundColor: '#5959B2', width: 40, borderRadius: 20 }}
              onPress={handleAddPress}
              disabled={text === '' ? true : false}
            >
              <MaterialIcons name="add" size={40} color='white' />
            </TouchableOpacity>
          </KeyboardStickyView>
        </View>
      </KeyBoardDismisView>
    </KeyboardProvider >
  )
}

export default voicetype