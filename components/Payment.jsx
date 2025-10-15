import { StyleSheet, Text, TouchableOpacity, View, Alert} from 'react-native'
import React, { useEffect } from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import ModalContainer from '@/components/ModalContainer';
import { TextInput } from 'react-native-gesture-handler';
import { useRef, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MODE } from '@/constants/mode';
import { useData } from '@/utils/userdata-context';
import { useClient } from '@/utils/client-context';
import { useItems } from '@/utils/items-context';
import { router } from 'expo-router';


const PaymentInput = () => {
    const { setMode } = useData()
    const { fetchClientItems, updateItem } = useItems()
    const { fetchClientById, updateClient, clientId } = useClient()
    const [total, setTotal] = useState(0)
    const [paidItems, setPaidItems] = useState([])

    const payment = useRef('0')

    useEffect(() => {
        fetchClientRow()
    }, [])

    const fetchClientRow = async () => {
        // fetcht the client data
        const clientData = await fetchClientById()
        // assign the items total to be use in the calculation
        setTotal(clientData.itemsTotal + clientData.balance)
    }

    const setItemsToPaid = async () => {
        const response = await fetchClientItems(clientId, false)

        if (response.length !== 0) {
            response.forEach(async (element) => {
                await updateItem(element.$id, { paid: true })
            });
        }

    }

    const handlePaymentPress = () => {
        // Calculate change
        const change = total - payment.current

        if (change > 0) {
            updateClient(clientId, { balance: change, itemsTotal: 0 })
            Alert.alert(`Balance of ${change}`)
        }
        if (change <= 0) {
            updateClient(clientId, { balance: 0, itemsTotal: 0 })
            change < 0 && Alert.alert(`Change of: ${-change}`)
        }


        // set the current unpaid items to paid = true
        setItemsToPaid()

        setMode(MODE.IDLE)
        payment.current = '0'
        router.replace('/')
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
        marginRight: 20,
    }
})
