import { StyleSheet, Text, View, TouchableOpacity, Alert, Pressable, TextInput } from 'react-native'
import React, { useState } from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const NewItemsView = ({ item, deleteItem, editItem }) => {

    return (
        <Pressable style={styles.container} >

            <View style={styles.textContainer} >
                <Text style={styles.txt} >{item.productName}</Text>
                <Text style={styles.txt} >{item.price}.00</Text>
            </View>

            <View style={{flexDirection: 'row', gap: 5}}>
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
        justifyContent: 'space-between',
        alignSelf: 'center',
        marginBottom: 10,
        // borderWidth: 1,
    },
    txt: {
        fontSize: 20
    },
    textContainer: {
        flexDirection: 'row',
        // borderWidth: 1,
        flex: 1,
        justifyContent: 'space-between',
        marginRight: 40,
    },


})

