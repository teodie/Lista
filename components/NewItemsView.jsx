import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'

const NewItemsView = ({ item, deleteItem, editItem }) => {

    return (
        <View style={styles.container} >

            <View style={styles.textContainer} >
                <Text style={styles.txt} >{item.productName}</Text>
                <Text style={styles.txt} >{item.price}.00</Text>
            </View>

            <View style={styles.iconContainer} >

                <TouchableOpacity
                    onPress={() => editItem(item.id)}
                >
                    <MaterialIcons name='edit-document' size={30} color="#5959B2" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => deleteItem(item.id)}
                >
                    <MaterialIcons name='delete' size={30} color="#5959B2" />
                </TouchableOpacity>

            </View>

        </View>
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
    iconContainer: {
        flexDirection: 'row',
        gap: 20,
        // borderWidth: 1,


    }

})

