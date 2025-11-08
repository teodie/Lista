import { Pressable, View, Alert, TextInput } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { Text, Divider, Button } from 'react-native-paper';
import vibrate from '@/utils/vibrate'


function formatAppwriteDate(createdAt) {
  const date = new Date(createdAt);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });
}

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

const ItemList = ({ item, setEditItemModalShow, setEditItem }) => {

  const handleItemLongPress = () => {
    vibrate()
    setEditItem({productName: item.productName, price: item.price, id: item.$id})
    setEditItemModalShow(true)
  }

  return (
    <Pressable onLongPress={handleItemLongPress}>
      <View style={{
        flexDirection: 'row',
        paddingVertical: 8,
        alignItems: 'center',
      }}>
        <Text style={{ flex: 3 }} >{item.productName}</Text>
        <Text style={{ flex: 1, textAlign: 'center' }} >{item.price}.00</Text>
        <Text style={{ flex: 1, textAlign: 'center' }} >{formatAppwriteDate(item.$createdAt)}</Text>
        {
          item.paid
            ? <Paid />
            : <Unpaid />
        }
      </View>
      <Divider />
    </Pressable>
  )
}

export default ItemList