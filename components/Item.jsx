import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'

const Item = ({ item, index }) => {
  

  return (
    <View style={{ height: 50,flexDirection:'row' }}>
      <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'space-between'}}>
        <Text style={{flex: 3, textAlign: 'center'}}>{item.name}</Text>
        <Text style={{flex: 1, textAlign: 'center'}}>{item.price}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => { }}
        >
          <MaterialIcons name='edit-document' size={30} color="#5959B2" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => { }}
        >
          <MaterialIcons name='delete' size={30} color="#5959B2" />
        </TouchableOpacity>

      </View>
    </View>
  )
}

export default Item
