import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, {useContext} from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { PersonDataContext } from '@/context';



const Card = ({name, total}) => {

    const handleAddItems = () => {

    }

    const handleNamePress = () => {

    }


    return (
        <View style={styles.card}>
            <View style={styles.headerTxtContainer} >
                <TouchableOpacity >
                    <Text style={styles.headerTxt}>{name}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.balanceContainer} >
                <Text style={styles.balanceTxt} > Balance: </Text>
                <Text style={styles.totalBalanceTxt} >{total}</Text>
            </View>

            <TouchableOpacity style={styles.addIcon} >
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