import { StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native'
import React, { useContext, useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MODE } from '@/constants/mode';
import Animated, { FadeIn, LinearTransition, FadeOut } from 'react-native-reanimated';
import { PersonDataContext } from '@/context';

const UtangOverView = ({ person, setMode, setId, onChangeName, deleteName, setcurrentPersonData }) => {
    const { personData, setPersonData } = useContext(PersonDataContext);

    const [longPressed, setLongPressed] = useState(false)
    const totalBalance = person.balance + person.items.reduce((sum, item) => sum + item.price, 0);

    const handleNamePress = () => {
        // Set the person data for usage off payment feature
        setPersonData(person)
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
        setLongPressed(false)
    };

    const handleAddItems = () => {
        setcurrentPersonData(person);
        setMode(MODE.ADD_ITEM)
    };

    return (
        <Animated.View style={styles.container} layout={LinearTransition.springify()}>

            <Animated.View style={styles.headerTxtContainer} layout={LinearTransition.springify()} >
                <TouchableOpacity onPress={() => handleNamePress()}>
                    <Text style={styles.headerTxt}> {person.name} </Text>
                </TouchableOpacity>
            </Animated.View>

            <Animated.View style={styles.balanceContainer} layout={LinearTransition.springify()} >
                <Text style={styles.balanceTxt} > Balance: </Text>
                <Text style={styles.totalBalanceTxt} >{totalBalance}</Text>
            </Animated.View>

                {longPressed &&
                    (
                        <View style={styles.hiddenIconContainer} layout={LinearTransition.springify()} exiting={FadeOut} entering={FadeIn} >
                            <TouchableOpacity style={styles.editIcon} onPress={handleEditPress} >
                                <MaterialIcons name="edit-document" size={40} color="#5959B2" />
                            </TouchableOpacity>

                            <TouchableOpacity style={{ width: 50 }} onPress={() => { deleteName(person.id) }} >
                                <MaterialIcons name="delete" size={40} color="#5959B2" />
                            </TouchableOpacity>
                        </View>
                    )
                }

                <TouchableOpacity style={styles.addIcon} onPress={() => handleAddItems()} onLongPress={() => setLongPressed(prev => !prev)} >
                    <MaterialIcons name='add' size={40} color="#E8E8E8" />
                </TouchableOpacity>


        </Animated.View>
    )
}

export default UtangOverView

const styles = StyleSheet.create({
    container: {
        margin: 8,
        padding: 10,
        paddingLeft: 30,
        borderRadius: 20,
        height: 70,
        flexDirection: "row",
        justifyContent: 'flex-end',
        boxShadow: "0px 0px 10px 10px rgba(2, 1, 1, 0.1)",
        alignItems: "center"
    },
    headerTxtContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',

    },
    headerTxt: {
        fontSize: 15,
        fontWeight: "bold",

    },
    balanceContainer: {
        flex: 2,
        width: 100,
        alignItems: "center",
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
    },
    addIcon: {
        height: 40,
        width: 40,
        backgroundColor: "#5959B2",
        borderRadius: '50%',
    },
    hiddenIconContainer: {
        flexDirection: 'row'
    },


})
