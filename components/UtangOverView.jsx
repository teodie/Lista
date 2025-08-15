import { StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MODE } from '@/constants/mode';

const UtangOverView = ({ person, setMode, setId, onChangeName, deleteName, setcurrentPersonData }) => {

    const totalBalance = person.items.reduce((sum, item) => sum + item.price, 0);

    const handleNamePress = () => {
        router.navigate({
            pathname: '/items',
            params: {
                data: JSON.stringify(person),
                total: totalBalance
            }
        })
    };

    const handleEditPress = () => {
        setMode(MODE.EDIT_NAME)
        onChangeName(person.name)
        setId(person.id)
    };

    const handleAddItems = () => {
        setcurrentPersonData(person);
        setMode(MODE.ADD_ITEM)
    };

    return (
        <View style={styles.container}>

            <View style={styles.headerTxtContainer}>
                <TouchableOpacity onPress={handleNamePress}>
                    <Text style={styles.headerTxt}> {person.name} </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.balanceContainer} >
                <Text style={styles.balanceTxt} > Balance: </Text>
                <Text style={styles.totalBalanceTxt} >{totalBalance}</Text>
            </View>

            <TouchableOpacity style={styles.editIcon} onPress={handleEditPress} >
                <MaterialIcons name="edit-document" size={40} color="#5959B2" />
            </TouchableOpacity>

            <Pressable style={{ width: 50 }} onPress={() => { deleteName(person.id) }} >
                <MaterialIcons name="delete" size={40} color="#5959B2" />
            </Pressable>

            <TouchableOpacity style={styles.addIcon} onPress={handleAddItems} >
                <MaterialIcons name='add' size={40} color="#E8E8E8" />
            </TouchableOpacity>

        </View>
    )
}

export default UtangOverView

const styles = StyleSheet.create({
    container: {
        margin: 8,
        borderRadius: 10,
        height: 80,
        flexDirection: "row",
        justifyContent: "flex-end",
        boxShadow: "0px 0px 10px 10px rgba(2, 1, 1, 0.1)",
        alignItems: "center"
    },
    headerTxtContainer: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
        height: '100%'
    },
    headerTxt: {
        fontSize: 15,
        fontWeight: "bold"
    },
    balanceContainer: {
        width: 100,
        alignItems: "center",
        marginRight: 20
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
    editIcon: {
        width: 50,
        marginRight: 10
    },
    addIcon: {
        height: 40,
        width: 40,
        backgroundColor: "#5959B2",
        borderRadius: '50%',
        marginRight: 10
    },


})
