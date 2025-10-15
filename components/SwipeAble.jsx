
import React, { useRef, useState } from "react";
import { View, Alert, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { MaterialIcons } from '@expo/vector-icons';
import Card from "./Card";
import { CustomModal } from "./ModalContainer";
import { share } from "@/utils/jsonToCsv";
import { useClient } from "@/utils/client-context";
import * as LocalAuthentication from "expo-local-authentication";


const SwipeAble = ({ data, scrollRef }) => {
    const { deleteClient, updateClient } = useClient()
    const [modalVisible, setModalVisible] = useState(false)
    const [name, setName] = useState('')
    const swipeRef = useRef(null)

    const authenticated = async () => {
        try {
            // Check if hardware supports biometrics
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            if (!hasHardware) {
                console.log("❌ No biometric hardware available on this device");
                return;
            }

            // Check if any biometrics are enrolled
            const enrolled = await LocalAuthentication.isEnrolledAsync();
            if (!enrolled) {
                console.log("⚠️ No biometrics set up on this device");
                return;
            }

            // Prompt user for authentication
            const authResult = await LocalAuthentication.authenticateAsync({
                promptMessage: "Authenticate with fingerprint",
                fallbackLabel: "Use PIN",
                cancelLabel: "Cancel",
            });

            if (authResult.success) {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log(`⚠️ Error: ${error.message}`);
            return false
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Deleting Client Data',
            'Client Data will be permanently deleted\nStill want to delete this client data?',
            [{ text: 'Cancel', style: 'cancel' }, {
                text: "Delete", onPress: () => {
                    Alert.alert('Sure na Sure?', '', [
                        { text: 'Hinde', style: 'cancel' },
                        {
                            text: 'Oo',
                            onPress: async () => {
                                if ( await authenticated()) {
                                    deleteClient(data.$id)
                                }
                            }, style: 'destructive'
                        }])
                }, style: 'default'
            }],
            { cancelable: true },
        )
    };

    const handleEdit = () => {
        setName(data.name)
        setModalVisible(!modalVisible)
    }

    const handleSaveEdit = () => {
        updateClient(data.$id, {name: name})
        setName('')
        setModalVisible(!modalVisible)
        swipeRef.current?.reset()
    }

    const handleSaveData = () => {
        console.log(`Sharing ${data.name} data`)
        share(data, data.name)
    }

    const renderLeftActions = () =>
    (<>
        <View style={styles.renderLeft}>
            <TouchableOpacity onPress={handleEdit}>
                <MaterialIcons name='edit-document' size={50} color='#5959B2' />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>
                <MaterialIcons name='delete' size={50} color='#5959B2' />
            </TouchableOpacity>
        </View>

        <CustomModal children={
            <View style={{ alignSelf: 'stretch' }}  >
                <TextInput
                    style={{ borderWidth: 1, borderRadius: 10 }}
                    value={name}
                    onChangeText={setName}
                    cursorColor='gray'
                />
                <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={handleSaveEdit} >
                    <MaterialIcons name='save' size={50} color='#5959B2' />
                </TouchableOpacity>
            </View>
        }
            visible={modalVisible}
            setVisible={setModalVisible}
        />

    </>
    )

    const renderRightActions = () =>
    (
        <View style={styles.renderRight}>
            <TouchableOpacity onPress={handleSaveData} >
                <MaterialIcons name='save' size={50} color='#5959B2' />
            </TouchableOpacity>
        </View>
    )


    return (
        <View >
            <Swipeable
                ref={scrollRef}
                friction={4}
                leftThreshold={20}
                containerStyle={{ overflow: "visible" }}
                renderRightActions={renderRightActions}
                renderLeftActions={renderLeftActions}
            >
                <Card data={data} />
            </Swipeable>
        </View >
    )
}

export default SwipeAble

const styles = StyleSheet.create({
    renderRight: {
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    renderLeft: {
        height: 70,
        marginLeft: 10,
        width: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    editIcon: {
        width: 50,
    },



});