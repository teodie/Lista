import { StyleSheet, TextInput, View, TouchableOpacity, Alert } from 'react-native'
import uuid from 'react-native-uuid'
import React, { useState, useRef } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import Animated, { FadeIn, FadeOut, runOnJS } from 'react-native-reanimated'
import { ID } from 'react-native-appwrite'

const ManualInput = ({ setItems, items, productName, setProductName, price, setPrice }) => {
    // useRef for textinput
    const productInputRef = useRef(null);
    const priceInputRef = useRef(null);

    const [editingItemId, setEditingId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const newItem = () => {
        if (!productName || !price) return Alert.alert('Product name or Price is empty');

        setItems([{ id: ID.unique(), productName: productName, price: Number(price) }, ...items])
        setProductName('')
        setPrice('')
    }

    const saveEditedItem = (id) => {
        const foundPersonItem = items.find((element) => element.id === id)
        setItems([{...foundPersonItem, productName: productName, price: price}, ...items])

        setProductName('')
        setPrice('')

        setIsEditing(false)
        setEditingId(null)
    }

    const handleSavePres = () => {
        isEditing
            ? saveEditedItem(editingItemId)
            : newItem()
    }

    const focusOnProductName = () => {
        productInputRef.current?.focus()
    }

    return (
        <Animated.View
            key='manualTyping'
            style={styles.textInputContainer}
            entering={FadeIn.duration(1000).withCallback((finished) => {
                finished && runOnJS(focusOnProductName)()
            })}
            exiting={FadeOut}
        >
            
            <TextInput style={styles.textInputProduct}
                ref={productInputRef}
                placeholder='Product Name'
                placeholderTextColor='gray'
                cursorColor='gray'
                autoFocus={false}
                value={productName}
                onChangeText={setProductName}
                onSubmitEditing={() => priceInputRef.current?.focus()}
            />

            <TextInput style={styles.textInputPrice}
                ref={priceInputRef}
                placeholder='Price'
                placeholderTextColor='gray'
                cursorColor='gray'
                keyboardType='numeric'
                value={price}
                onChangeText={setPrice}
                onSubmitEditing={() => newItem()}
            />

            <TouchableOpacity onPress={handleSavePres} >
                <MaterialIcons name='add-box' size={40} color='#5959B2' />
            </TouchableOpacity>

        </Animated.View>
    )
}

export default ManualInput

const styles = StyleSheet.create({
    textInputContainer: {
        flexDirection: 'row',
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        gap: 10,
        // borderWidth: 1,
    },
    textInputProduct: {
        borderWidth: 1,
        flex: 2,
        borderRadius: 10,
    },
    textInputPrice: {
        borderWidth: 1,
        flex: 1,
        borderRadius: 10,
        borderColor: 'black'
    },
})