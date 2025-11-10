import { View, Text, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Divider } from 'react-native-paper'

const EditItemRow = ({ value, label, field,  handleOnchageText }) => {
  const [val, setVal] = useState(value)
  
  useEffect(() => {
    handleOnchageText(field, val)
  }, [val])

  return (
    <View>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Text>{label}</Text>
        <TextInput
          style={{ flex: 1, textAlign: 'right' }}
          value={val}
          onChangeText={setVal}
        />
      </View>
      <Divider />
    </View>
  )
}

export default EditItemRow