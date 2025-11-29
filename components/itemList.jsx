import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Text, Divider } from 'react-native-paper';

const ItemList = ({ item, onLongPress}) => {


  return (
    <TouchableOpacity onLongPress={onLongPress}>
      <View style={{
        flexDirection: 'row',
        paddingVertical: 8,
        alignItems: 'center',
      }}>
        <Text style={{color: 'black', flex: 1, textAlign: 'center' }} >{1}</Text>
        <Text style={{ color: 'black', flex: 3 }} >{item.productName}</Text>
        <Text style={{color: 'black', flex: 1, textAlign: 'center' }} >{item.price}.00</Text>
      </View>
      <Divider />
    </TouchableOpacity>
  )
}

export default ItemList