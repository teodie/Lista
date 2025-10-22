import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { MODE } from '@/constants/mode';
import { router } from 'expo-router';
import { useData } from '@/utils/userdata-context';
import { useClient } from '@/utils/client-context';
import { useItems } from '@/utils/items-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { storage } from "@/utils/appWrite";

const ClientView = ({ data, dispatch, open}) => {
    const [avatar, setAvatar] = useState(null)

    // fetch the client avatar url from appwrite
    const fetchClientAvatar = async (id) => {
        try {
            const response = storage.getFileViewURL(
                process.env.EXPO_PUBLIC_BUCKET_ID,
                id,
            ).href

            setAvatar(response)
        } catch (error) {
            console.log(error)
            setAvatar(null)
        }
    }

    // check if the image exist in the appwrite storage
    const imageExist = async (id) => {
        try {
            const file = await storage.getFile(
                process.env.EXPO_PUBLIC_BUCKET_ID,
                id,
            )

            if (!file) return false

            return true
        } catch (error) {
            if (error.code === 404) {
                // no avatar is saved for this user
                setAvatar(null)
            }

        }
    }

    // Capitalize the firstname of the client
    const format = (fullname) => {
        const firstName = fullname.split(" ")[0]
        const lastName = fullname.split(" ").pop()
        const firstNameLetterCapital = firstName.charAt(0).toUpperCase() + firstName.slice(1)
        const lastNameLetterCapital = lastName.charAt(0).toUpperCase() + lastName.slice(1)
        const name = `${firstNameLetterCapital} ${lastNameLetterCapital}`
        return name
    }

    // check profile exist and if it does get the client avatar
    useEffect(() => {
        if (imageExist(data.$id)) {
            fetchClientAvatar(data.$id)
        }
    }, [])

    const handleCardPress = () => {
        open.value = !open.value
        dispatch({type: 'SET-CRED', name: format(data.name), avatar: avatar })
    }

    return (
        <View style={styles.card}>

            <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center', gap: 20, flex: 3, height: '100%', marginLeft: 5, justifyContent: 'center'}}
            onPress={handleCardPress}
            >
                {
                    avatar
                        ? <Image source={{ uri: avatar }} style={{ height: 45, width: 45, borderRadius: 23 }} />
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