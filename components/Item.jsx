import { View, TouchableOpacity, TextInput } from 'react-native'
import { Divider, Text } from 'react-native-paper';
import React, { useEffect, useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'

const Item = ({ item, deleteItem, editItem}) => {
  const [productName, setProductName] = useState(item.productName)
  const [price, setPrice] = useState(String(item.price))

  useEffect(() => {
    console.log("This trigers")
    editItem(item.id, productName, price)
  }, [productName, price])

  return (
    <>
      <View style={{ height: 50, flexDirection: 'row' }}>
        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
          <TextInput
            style={{ flex: 3, textAlign: 'center' }}
            value={productName}
            onChangeText={setProductName}
          />

          <TextInput
            style={{ flex: 1, textAlign: 'center' }}
            value={price}
            onChangeText={setPrice}
          />

        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

          <TouchableOpacity
            onPress={() => deleteItem(item.id)}
          >
            <MaterialIcons name='delete' size={30} color="#5959B2" />
          </TouchableOpacity>

        </View>
      </View>
      <Divider />
    </>
  )
}

export default Item
