import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useClient } from '@/utils/client-context';

const ClientView = ({ data, dispatch, toggleAccordion}) => {
    const { setClientId } = useClient()
    // Capitalize the firstname of the client
    const format = (fullname) => {
        const firstName = fullname.split(" ")[0]
        const lastName = fullname.split(" ").pop()
        const firstNameLetterCapital = firstName.charAt(0).toUpperCase() + firstName.slice(1)
        const lastNameLetterCapital = lastName.charAt(0).toUpperCase() + lastName.slice(1)
        const name = `${firstNameLetterCapital} ${lastNameLetterCapital}`
        return name
    }


    const handleCardPress = () => {
        console.log("id: ", data.$id)
        setClientId(data.$id)
        toggleAccordion()
        dispatch({type: 'SET-CRED', name: format(data.name), avatar: data.avatar, id: data.$id })
    }

    return (
        <View style={styles.card}>

            <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center', gap: 20, flex: 3, height: '100%', marginLeft: 5, justifyContent: 'center'}}
            onPress={handleCardPress}
            >
                {
                    data.avatar
                        ? <Image source={{ uri: data.avatar }} style={{ height: 45, width: 45, borderRadius: 23 }} />
                        : <Ionicons name="person-circle-sharp" size={55} color='#5959B2' />
                }

                <Text style={styles.headerTxt}>{format(data.name)}</Text>
            </TouchableOpacity>


        </View>
    );
}

export default ClientView

const styles = StyleSheet.create({
    card: {
        overflow: 'visible',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: 10,
        elevation: 4,
        height: 70
    },

    headerTxt: {
        fontSize: 15,
        fontWeight: "bold",
    },


})