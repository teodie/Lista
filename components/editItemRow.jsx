import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { Divider } from 'react-native-paper'

const EditItemRow = ({ value, label }) => {
  return (
    <View>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Text>{label}</Text>
        <TextInput
          style={{
            flex: 1,
            textAlign: 'right'
          }}
          value={value}
        />
      </View>
      <Divider />
    </View>
  )
}

export default EditItemRow