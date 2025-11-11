import { Pressable, View, Alert, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { Text, Divider, Button } from 'react-native-paper';
import { formatDate_MM_DD } from '@/utils/formatDate'


const Paid = () => (
  <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', gap: 5 }} >
    <View style={{ borderRadius: 10, backgroundColor: '#43A55A', padding: 2, alignItems: 'center', justifyContent: 'center', height: 20, width: 20 }}>
      <FontAwesome name="check" size={12} color="white" />
    </View>
    <Text style={{ fontWeight: 500, color: '#43A55A' }}>Paid</Text>
  </View>
)

const Unpaid = () => (
  <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', gap: 5 }} >
    <View style={{
      borderRadius: 10, padding: 2, height: 15, width: 15,
      borderWidth: 3, borderColor: '#C44250',
    }}
    />
    <Text style={{ fontWeight: 500, color: '#C44250' }}>Unpaid</Text>
  </View>
)

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
        {
          item.paid
            ? <Paid />
            : <Unpaid />
        }
      </View>
      <Divider />
    </TouchableOpacity>
  )
}

export default ItemList