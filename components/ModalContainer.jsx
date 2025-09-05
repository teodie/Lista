import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import React, { useContext, useState } from 'react'
import { MODE } from '@/constants/mode'
import { PersonDataContext } from '@/context'

const ModalContainer = ({ children, visible }) => {
    const {setMode} = useContext(PersonDataContext)
    
    const handleClose = () => setMode(MODE.IDLE);

    return (
        <Modal animationType="slide" transparent={true} visible={visible} >
            <View style={styles.modalWrapper}>
                <View style={styles.modalView}>
                    <TouchableOpacity style={styles.exit} onPress={handleClose}>
                        <MaterialIcons name='clear' size={20} color='lightgray' />
                    </TouchableOpacity>

                    {children}
                    
                </View>
            </View>
        </Modal>
    )
}

export const CustomModal = ({ children, visible, setVisible }) => {

    const handleClose = () => {
        setVisible(!visible)
    }

    return (
        <Modal animationType="slide" transparent={true} visible={visible} >
            <View style={styles.modalWrapper}>
                <View style={styles.modalView}>
                    <TouchableOpacity style={styles.exit} onPress={handleClose}>
                        <MaterialIcons name='clear' size={20} color='lightgray' />
                    </TouchableOpacity>

                    {children}
                    
                </View>
            </View>
        </Modal>
    )
}

export default ModalContainer

const styles = StyleSheet.create({
    exit: {
        position: 'absolute',
        top: 10,
        right: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'lightgray',
    },
    modalWrapper: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    modalView: {
        position: 'relative',
        alignItems: 'stretch',
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        elevation: 5,
        justifyContent: 'center',
    },
})