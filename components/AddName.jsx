import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { MODE } from '@/constants/mode'
import { useData } from '@/utils/userdata-context'

const AddName = ({ id, setId, onChangeName, name }) => {
    const { mode, setMode, utang, setUtang } = useData()

    const nameAlreadyExist = () => {
        const nameAlreadyExist = utang.find((item) => item.name.toUpperCase() === name.toUpperCase())
        return nameAlreadyExist ? true : false;
    }

    const createName = () => {
        if (!name.trim()) return Alert.alert('Name is blank!')
        if (nameAlreadyExist()) return Alert.alert('Name Already Exist')

        const newId = utang.length > 0 ? utang[0].id + 1 : 1;
        setUtang([{ id: newId, name: name.toUpperCase(), balance: 0, items: [] }, ...utang])
        onChangeName('')
        setMode(MODE.IDLE)
    };



    const editName = (id) => {
        setUtang(utang.map(item => item.id === id ? { ...item, name: name.toUpperCase() } : item))
        console.log(id.toString() + " Has been Updated.")
    };

    const handleAddPress = () => {

        switch (mode) {
            case MODE.ADD_NAME:
                setMode(MODE.IDLE)
                createName()
                break;
            case MODE.EDIT_NAME:
                setMode(MODE.IDLE)
                editName(id)
                onChangeName('')
                setId(null)
                break;
            default:
                console.log("Unexpected Mode" + mode)
        }

    }

    return (
        <>
            <TextInput style={styles.addInput}
                onChangeText={onChangeName}
                placeholder='Type the name here....'
                placeholderTextColor='gray'
                cursorColor='gray'
                value={name}
                autoFocus={true}
            />
            <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.iconStyle} onPress={handleAddPress} >
                    <MaterialIcons name='add' size={40} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconStyle} onPress={() => setMode(MODE.IDLE)} >
                    <MaterialIcons name='chevron-left' size={40} color="white" />
                </TouchableOpacity>
            </View>
        </>
    );
}

export default AddName

const styles = StyleSheet.create({
    addInput: {
        borderWidth: 1,
        borderColor: 'black',
        width: '90%',
        borderRadius: 5
    },
    iconStyle: {
        backgroundColor: '#5959B2',
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        margin: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    iconContainer: {
        flexDirection: 'row-reverse'
    }
})