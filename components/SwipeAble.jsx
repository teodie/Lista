
import React, { useContext, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { MaterialIcons } from '@expo/vector-icons';
import Card from "./Card";
import Animated, { FadeIn, LinearTransition, FadeOut } from 'react-native-reanimated';
import { PersonDataContext } from "@/context";
import { CustomModal } from "./ModalContainer";

const SwipeAble = ({ data }) => {
    const { utang, setUtang } = useContext(PersonDataContext)
    const [modalVisible, setModalVisible] = useState(false)
    const [name, setName] = useState('')
    const swipeRef = useRef(null)

    const ItemTotal = data.balance + data.items.reduce((acc, item) => acc + item.price, 0)

    const handleDelete = () => {
        setUtang(utang.filter(item => item.id !== data.id))
        console.log(`Person with id: ${data.id} has been deleted.`)
    }

    const handleEdit = () => {
        setName(data.name)
        setModalVisible(!modalVisible)
    }

    const handleSaveEdit = () => {
        setUtang(utang.map(item => item.id === data.id ? {...item, name: name} : item))
        setName('')
        setModalVisible(!modalVisible)
        swipeRef.current?.reset()
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
            <View style={{ alignSelf: 'stretch'}}  >
                <TextInput
                style={{borderWidth: 1, borderRadius: 10}}
                value={name}
                onChangeText={setName}
                cursorColor='gray'
                />
                <TouchableOpacity style={{alignSelf: 'flex-end'}} onPress={handleSaveEdit} >
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
            <TouchableOpacity >
                <MaterialIcons name='save' size={50} color='#5959B2' />
            </TouchableOpacity>
        </View>
    )


    return (
        <Animated.View layout={LinearTransition.springify()}>
            <Swipeable
                ref={swipeRef}
                friction={2}
                leftThreshold={20}
                containerStyle={{ overflow: "visible" }}
                renderRightActions={renderRightActions}
                renderLeftActions={renderLeftActions}
            >

                <Card name={data.name} total={ItemTotal} />

            </Swipeable>
        </Animated.View >
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