import { StyleSheet, Text, View, TouchableOpacity, Alert, Pressable, TextInput } from 'react-native'
import React, { useState } from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import TextScaled from './TextScaled';

const NewItemsView = ({ item, deleteItem, editItem }) => {

    return (
        <Pressable style={{
            width: '90%',
            flexDirection: 'row',
            alignSelf: 'center',
            marginBottom: 10,
            alignItems: 'center',
            gap: 10,

        }} >

            <View style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'space-between',
            }} >
                <TextScaled fontSize={17} >{item.productName}</TextScaled>
                <TextScaled fontSize={17} >{item.price}.00</TextScaled>
            </View>

            <View style={{ flexDirection: 'row', gap: 5 }}>
                <TouchableOpacity
                    style={{ backgroundColor: '#5959B2', height: 30, width: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', }}
                    onPress={() => editItem(item.id)}
                >
                    <FontAwesome6 name="pencil" size={18} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ backgroundColor: '#DF444B', height: 30, width: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => deleteItem(item.id)}
                >
                    <FontAwesome6 name="trash-alt" size={18} color="white" />
                </TouchableOpacity>
            </View>
        </Pressable>
    )
}

export default NewItemsView

const styles = StyleSheet.create({
    container: {
        width: '90%',
        flexDirection: 'row',
        alignSelf: 'center',
        marginBottom: 10,
        alignItems: 'center'
    },
    txt: {
        fontSize: 20
    },
    textContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        flex: 1,
        justifyContent: 'space-between',
        marginRight: 40,
    },


})

