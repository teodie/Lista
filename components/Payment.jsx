import {
    StyleSheet, Text, TouchableOpacity, View, Alert, Button
    ,
} from 'react-native'
import React from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import ModalContainer from '@/components/ModalContainer';
import { TextInput } from 'react-native-gesture-handler';
import { useRef, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MODE } from '@/constants/mode';
import { fetchArchieveData } from '@/utils/fetchArchieveData'
import { useData } from '@/utils/userdata-context';

const PaymentInput = ({ setPaying }) => {
    const { personData, setPersonData, utang, setUtang, setMode } = useData()
    const total = personData.balance + personData.items.reduce((sum, item) => sum + item.price, 0);
    const payment = useRef('0')

    const handlePaymentPress = async () => {
        const change = total - payment.current
        change > 0
            ? Alert.alert(`Balance of ${change}`)
            : change < 0
                ? Alert.alert(`Change of: ${-change}`)
                : null

        setMode(MODE.IDLE)
        const prevData = await fetchArchieveData()
        saveData(prevData)
        updatePersonData()
        setPaying(false)
        payment.current = ''
    }

    const saveData = async (prevData) => {
        console.log('Saving Data....')
        const remainingBalance = total - Number(payment.current)

        const date = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = date.toLocaleDateString('en-US', options);
        //Saving the data
        const dataToSave = [...(prevData || []), { ...personData, paidDate: dateString, paidAmount: payment.current, remainingBalance: remainingBalance, total: total }]
        console.log(dataToSave)
        try {
            const saveJsonValue = JSON.stringify(dataToSave)
            await AsyncStorage.setItem('Archieve', saveJsonValue)
            console.log('Data has been saved')
        } catch (e) {
            console.log('Error in saving to Archieve: ', e)
        }

    }

    const updatePersonData = () => {
        const remainingBalance = total - Number(payment.current)
        const newData = { ...personData, balance: remainingBalance < 0 ? 0 : remainingBalance , items: [] }
        setUtang(utang.map(element => element.id === personData.id ? newData : element))
        // To remove the data when the items are payed
        setPersonData(newData)
    }

    return (
        <>
            <Text style={{ fontWeight: 'bold', fontSize: 30, marginBottom: 10, color: "#5959B2" }}>Total: {total}</Text>

            <TextInput
                style={styles.paymentInput}
                keyboardType='numeric'
                placeholder='Amount'
                placeholderTextColor='gray'
                onChangeText={(text) => (payment.current = text)}
            />

            <TouchableOpacity style={styles.paymentBtn} onPress={handlePaymentPress}>
                <Text style={styles.paymentBtnTxt}>Pay</Text>
            </TouchableOpacity>
        </>
    );
}


const Payment = () => {
    const { setArchieveVisible, mode, setMode } = useData()

    const handlePaymentPress = () => {
        // Hide the modal for payment
        setMode(MODE.PAYING)
    }

    const handleArchievePress = () => {
        //make the archive view show in the items.jsx
        setArchieveVisible(prev => !prev)
    }

    return (
        <View style={styles.paymentIcons}>

            <ModalContainer children={<PaymentInput />} visible={mode === MODE.PAYING} />

            <TouchableOpacity onPress={handlePaymentPress}>
                <FontAwesome6 name="coins" size={24} color="gold" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleArchievePress} >
                <FontAwesome name="bank" size={24} color="lightgray" />
            </TouchableOpacity>
        </View>
    )
}

export default Payment

const styles = StyleSheet.create({

    paymentInput: {
        borderWidth: 1,
        borderRadius: 10,
        width: '50%',
        color: 'black'
    },
    paymentBtn: {
        margin: 10,
        backgroundColor: '#5959B2',
        paddingVertical: 10,
        width: '30%',
        borderRadius: 10,
        alignItems: 'center'
    },
    paymentBtnTxt: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    paymentIcons: {
        flexDirection: 'row-reverse',
        gap: 20,
    }
})

/* Payment algorithm
[X] load the person data in the componet
[X] ask how much is the payment
[X] subtract the payment to the total
[X] save the data for archieving
[X] if there is a balance save that
[X] update the client data with blank items along with the balance
*/