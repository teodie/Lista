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

const Card = ({ data }) => {
    const { setMode, setPersonData } = useData()
    const { setClientId } = useClient()
    const { fetchClientItems } = useItems()
    const [avatar, setAvatar] = useState(null)

    const handleAddItems = () => {
        setClientId(data.$id)
        setMode(MODE.ADD_ITEM)
    }

    const handleNamePress = async () => {
        // fetch data from the database
        console.log("Fetching items of the clients")
        const response = await fetchClientItems(data.$id, false)

        setClientId(data.$id)
        if (!response) {
            console.log("No unpaid items found")
            setPersonData([])
        } else {
            setPersonData(response.sort((a, b) => b.$createdAt - a.$createdAt))
        }

        router.navigate({ pathname: '/items', })
    }

    const fetchClientAvatar = async (id) => {
        try {
            const response = storage.getFileViewURL(
                process.env.EXPO_PUBLIC_BUCKET_ID,
                id,
            ).href

            if (!response) return setAvatar(null) && console.log("no avatar found")

            // console.log(`${response.toString()}`)

            setAvatar(response)
        } catch (error) {
            console.log(error)
            setAvatar(null)
        }
    }

    const imageExist = async (id) => {
        try {
            const file = await storage.getFile(
                process.env.EXPO_PUBLIC_BUCKET_ID,
                id,
            )
            console.log(JSON.stringify(file, null, 2))

            if (!file) return false

            return true
        } catch (error) {
            console.log(JSON.stringify(error, null, 2))
            setAvatar(null)
        }
    }

    const format = (fullname) =>{
        const firstName = fullname.split(" ")[0]
        const firstLetterCapital = firstName.charAt(0).toUpperCase() + firstName.slice(1)
        console.log(firstLetterCapital)
        return firstLetterCapital
    }

    useEffect(() => {
        if (imageExist(data.$id)) {
            console.log(data.name)
            fetchClientAvatar(data.$id)
        }
    }, [])

    return (
        <View style={styles.card}>

            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 20, flex: 3, height: '100%', marginLeft: 5 }} onPress={handleNamePress}>
                {
                    avatar
                        ? <Image source={{ uri: avatar }} style={{ height: 45, width: 45, borderRadius: 23 }} /> 
                        : <Ionicons name="person-circle-sharp" size={55} color='#5959B2' />
                }

                <Text style={styles.headerTxt}>{format(data.name)}</Text>
            </TouchableOpacity>

            <View style={styles.balanceContainer} >
                <Text style={styles.balanceTxt} > Payable: </Text>
                <Text style={styles.totalBalanceTxt} >{data.itemsTotal + data.balance}</Text>
            </View>

            <TouchableOpacity style={styles.addIcon} onPress={handleAddItems}>
                <MaterialIcons name='add' size={40} color="#E8E8E8" />
            </TouchableOpacity>
        </View>
    );
}

export default Card

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
    headerTxtContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        flex: 2,

    },
    headerTxt: {
        fontSize: 15,
        fontWeight: "bold",
    },
    balanceContainer: {
        width: 100,
        alignItems: "center",
        flex: 2,
    },
    balanceTxt: {
        fontSize: 15,
        fontWeight: "300"
    },
    totalBalanceTxt: {
        fontSize: 25,
        fontWeight: "bold",
        color: "green"
    },
    addIcon: {
        height: 40,
        width: 40,
        backgroundColor: "#5959B2",
        borderRadius: '50%',
    },

})