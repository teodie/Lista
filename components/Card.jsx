import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, {useContext} from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { PersonDataContext } from '@/context';
import { MODE } from '@/constants/mode';
import { router } from 'expo-router';

const Card = ({data}) => {
    const {setMode, setPersonData} = useContext(PersonDataContext);
    const ItemTotal = data.balance + data.items.reduce((acc, item) => acc + item.price, 0)

    const handleAddItems = () => {
        setPersonData(data)
        setMode(MODE.ADD_ITEM)
    }

    const handleNamePress = () => {
        setPersonData(data)
        router.navigate({ pathname: '/items', })
    }


    return (
        <View style={styles.card}>
            <View style={styles.headerTxtContainer} >
                <TouchableOpacity onPress={handleNamePress}>
                    <Text style={styles.headerTxt}>{data.name}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.balanceContainer} >
                <Text style={styles.balanceTxt} > Balance: </Text>
                <Text style={styles.totalBalanceTxt} >{ItemTotal}</Text>
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
        borderRadius: 20,
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