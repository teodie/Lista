import { View, Text } from 'react-native'
import React, { useState } from 'react'
import TextScaled from './TextScaled'
import { Divider } from 'react-native-paper'
import { formateDate_LongMM_DD_YYYY, formatTime_12HRS } from '@/utils/formatDate'
import ItemList from './itemList'
import vibrate from '@/utils/vibrate'

const ItemsGroup = ({ items, date, setSelectedItem, setEditItemModalShow }) => {

  const hanldeLongPress = (item) => {
    vibrate()
    setSelectedItem(item)
    setEditItemModalShow(true)
  }

  return (
    <View style={{ flex: 1, borderWidth: 1, paddingHorizontal: 10, marginVertical: 5, elivation: 4, borderRadius: 10, }}>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text>{formateDate_LongMM_DD_YYYY(date)}</Text>
        <Text>{formatTime_12HRS(date)}</Text>
      </View>

      <View style={{
        flexDirection: 'row', marginVertical: 8,
      }}>
        <TextScaled style={{ color: 'black', fontWeight: 700, flex: 1, textAlign: 'center' }} >Qty</TextScaled>
        <TextScaled style={{ color: 'black', fontWeight: 700, flex: 3, textAlign: 'center' }} >Product</TextScaled>
        <TextScaled style={{ color: 'black', fontWeight: 700, flex: 1, textAlign: 'center' }} >Amount</TextScaled>
      </View>

      <Divider />

      {
        items.map((item, index) => {
          if (item.date === date) return <ItemList key={index} item={item} onLongPress={() => hanldeLongPress(item)} />
        })
      }

      <View style={{ alignItems: 'flex-end' }}>
        <View style={{ flexDirection: 'row' }}>
          <Text>Total:</Text>
          <Text>{ items.reduce((acc, item) => {
            if(item.date === date){
              return acc + item.price
            }
            return acc 
          }, 0)}</Text>
        </View>

      </View>

    </View>
  )
}

export default ItemsGroup