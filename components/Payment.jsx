import {
    StyleSheet, Text, TouchableOpacity, View, Alert, Button
    ,
} from 'react-native'
import React, { useContext } from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { PersonDataContext } from '@/context';
import ModalContainer from '@/components/ModalContainer';
import { TextInput } from 'react-native-gesture-handler';
import { useRef, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { archieveData } from '@/constants/utangList';
import { MODE } from '@/constants/mode';

export const fetchData = async () => {
    // Fetching the data
    console.log('Fetching Data....')
    try {
        const getJsonValue = await AsyncStorage.getItem('Archieve')
        const archieveStorage = getJsonValue != null ? JSON.parse(getJsonValue) : null;
        return  archieveStorage ? archieveStorage : archieveData;
    } catch (e) {
        console.log(e)
    }
}

const PaymentInput = ({ setPaying }) => {
    const { personData, setPersonData, utang, setUtang } = useContext(PersonDataContext);
    const total = personData.balance + personData.items.reduce((sum, item) => sum + item.price, 0);
    const payment = useRef('')

    const handlePaymentPress = async () => {
        const prevData = await fetchData()
        saveData(prevData)
        updatePersonData()
        setPaying(false)
        payment.current = ''
    }


    const saveData = async (prevData) => {
        console.log('Saving Data....')

        const date = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = date.toLocaleDateString('en-US', options);
        //Saving the data
        const dataToSave = [...(prevData || []), { ...personData, paidDate: dateString, amountPaid: payment.current }]
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
        const newData = { ...personData, balance: remainingBalance, items: [] }
        setUtang(utang.map((element) => element.id === personData.id ? newData : element))
        setPersonData(newData)
    }

    return (
        <>
            <TextInput
                style={styles.paymentInput}
                keyboardType='numeric'
                placeholder='Amount'
                onChangeText={(text) => (payment.current = text)}
            />

            <TouchableOpacity style={styles.paymentBtn} onPress={handlePaymentPress}>
                <Text style={styles.paymentBtnTxt}>Pay</Text>
            </TouchableOpacity>
        </>
    );
}


const Payment = () => {
    const { setArchieveVisible, mode, setMode } = useContext(PersonDataContext);
    
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
        width: '50%'
    },
    paymentBtn: {
        margin: 10,
        backgroundColor: '#5959B2',
        padding: 20,
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