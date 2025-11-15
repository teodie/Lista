import { Pressable, View, Alert, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { Text, Divider, Button } from 'react-native-paper';
import { formatDate_MM_DD } from '@/utils/formatDate'




const ItemList = ({ item, onLongPress}) => {


  return (
    <TouchableOpacity onLongPress={onLongPress}>
      <View style={{
        flexDirection: 'row',
        paddingVertical: 8,
        alignItems: 'center',
      }}>
        <Text style={{ color: 'black', flex: 3 }} >{item.productName}</Text>
        <Text style={{color: 'black', flex: 1, textAlign: 'center' }} >{item.price}.00</Text>
        <Text style={{color: 'black', flex: 1, textAlign: 'center' }} >{formatDate_MM_DD(item.$createdAt)}</Text>
      </View>
      <Divider />
    </TouchableOpacity>
  )
}

export default ItemList