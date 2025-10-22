import { View, TextInput, Image, TouchableOpacity, FlatList } from 'react-native'
import { Text } from 'react-native-paper'
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { KeyboardProvider, KeyboardStickyView } from "react-native-keyboard-controller";
import KeyBoardDismisView from '@/components/KeyBoardDismis';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import Item from '@/components/Item';
import { useClient } from '@/utils/client-context';
import Animated, { LinearTransition, useSharedValue, useDerivedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import ClientView from '@/components/ClientView';

const initialValue = {
  avatar: '',
  name: '',
}

const reducer = (state, action) => {
  switch (action.type) {
    case "SET-NAME":
      return { ...state, name: action.value }
    case "SET-CRED":
      return { name: action.name, avatar: action.avatar }
  }

}


const items = [
  { name: 'mantika', price: '5' },
  { name: 'bawang', price: '5' },
  { name: 'manok', price: '200' }
]

const voicetype = () => {
  const offset = { closed: -20, opened: -5 };
  const [state, dispatch] = useReducer(reducer, initialValue)
  const [text, setText] = useState('Teodi sibuyas 5 bawang 17 tuyo 20 shampoo 10')


  const { clients } = useClient()
  const [filteredClients, setFilteredClients] = useState()

  const open = useSharedValue(false)
  const height = useSharedValue(0);
  const degree = useSharedValue("0deg")


  const derivedHeight = useDerivedValue(() => {
    return withTiming(height.value * Number(open.value), { duration: 500 })
  }
  );

  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  const handlePress = () => {
    degree.value = withTiming(degree.value === '0deg' ? '90deg' : '0deg', { duration: 500 })
    open.value = !open.value
  }

  useEffect(() => {
    // console.log(JSON.stringify(clients, null, 2))
    filterClient()
  }, [state.name, clients])

  const filterClient = () => {
    state.name === ''
      ? setFilteredClients(clients)
      : setFilteredClients(clients.filter((client) => client.name?.toLowerCase().includes(state.name.toLowerCase())))
  }

  const handleChangeText = (text) => {
    dispatch({ type: 'SET-NAME', value: text })
  }

  const handleAddPress = () => {
    const name = text.split(" ").shift()
    console.log(name)
    dispatch({ type: 'SET-NAME', value: name })
  }

  return (
    <KeyboardProvider>
      <KeyBoardDismisView>
        <View style={{ flex: 1, paddingHorizontal: 20 }}>

          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={handlePress}>
              <View style={{ flexDirection: 'row', borderWidth: 1, alignItems: 'center' }}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  {
                    state.avatar
                      ? <Image source={{ uri: state.avatar }} style={{ height: 45, width: 45, borderRadius: 23 }} />
                      : <Ionicons name="person-circle-sharp" size={55} color='#5959B2' />
                  }

                  <TextInput
                    style={{ borderWidth: 1, width: '100%', textAlign: 'center' }}
                    value={state.name}
                    onChangeText={handleChangeText}
                  />
                </View>

              </View>
            </TouchableOpacity>

            <Animated.View
              style={[bodyStyle, { overflow: 'hidden' }]}
            >
              <View
                style={{
                  position: 'absolute',
                  width: '100%',
                }}
                onLayout={(e) => {
                  height.value = e.nativeEvent.layout.height;
                }}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  itemLayoutAnimation={LinearTransition.springify()}
                  data={filteredClients}
                  renderItem={({ item }) =>
                    <ClientView data={item} dispatch={dispatch} open={open} />}
                  keyExtractor={item => item.$id.toString()}
                />
              </View>
            </Animated.View>

            <FlatList
              data={items}
              renderItem={({ item, index }) => <Item index={index} item={item} />}
            />

          </View>

          <KeyboardStickyView offset={offset} style={{ flexDirection: 'row', gap: 10 }}>
            <TextInput
              style={{ height: 40, borderWidth: 1, flex: 1, borderRadius: 20 }}
              value={text}
              onChange={setText}
            />
            <TouchableOpacity
              style={{ backgroundColor: '#5959B2', width: 40, borderRadius: 20 }}
              onPress={handleAddPress}
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