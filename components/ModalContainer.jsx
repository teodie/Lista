import { StyleSheet, Text, View, Modal} from 'react-native'
import React from 'react'

const ModalContainer = ({component, visible}) => {
    return (
        <Modal animationType="slide" transparent={true} visible={visible} >
            <View style={styles.modalWrapper}>
                <View style={styles.modalView}>{component}</View>
            </View>
        </Modal>
    )
}

export default ModalContainer

const styles = StyleSheet.create({
    modalWrapper: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        position: 'relative',
      },
      modalView: {
        alignItems: 'stretch',
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        justifyContent: 'center',
    },
})