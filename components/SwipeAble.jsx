
import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { useAnimatedStyle } from 'react-native-reanimated';

function RightAction(progress, dragAnimatedValue) {
    const styleAnimation = useAnimatedStyle(() => {
        // console.log('showRightProgress:', progress.value);
        // console.log('appliedTranslation:', dragAnimatedValue.value);

        return {
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            transform: [{ translateX: dragAnimatedValue.value + 100 }],
        };
    });

    return (
        <Reanimated.View style={styleAnimation}>
            <TouchableOpacity >
                <MaterialIcons name="save" size={50} color="#5959B2" />
            </TouchableOpacity>
            <TouchableOpacity >
                <MaterialIcons name='edit-document' size={50} color="#5959B2" />
            </TouchableOpacity>
        </Reanimated.View>
    );
}

function LeftAction(progress, dragAnimatedValue) {
    const styleAnimation = useAnimatedStyle(() => {
        // console.log('showRightProgress:', progress.value);
        // console.log('appliedTranslation:', dragAnimatedValue.value);

        return {
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ translateX: dragAnimatedValue.value - 50 }],
        };
    });

    return (
        <Reanimated.View style={styleAnimation}>
            <TouchableOpacity>
                <MaterialIcons name="delete" size={50} color="#5959B2" />
            </TouchableOpacity>
        </Reanimated.View>
    );
}


const SwipeAble = ({data}) => {
    const ItemTotal = data.items.reduce((acc, item)=> acc + item.price, 0)

    return (
        <ReanimatedSwipeable
            containerStyle={styles.swipeable}
            friction={2} 
            overshootRight={true}
            overshootFriction={8}
            enableTrackpadTwoFingerGesture
            rightThreshold={50}
            leftThreshold={50}
            renderRightActions={RightAction}
            renderLeftActions={LeftAction}
            onSwipeableOpen={(direction) => { console.log('Opened:', direction); }}
        >
            <View style={styles.card}>

                <View style={styles.headerTxtContainer} >
                    <TouchableOpacity >
                        <Text style={styles.headerTxt}>{data.name}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.balanceContainer} >
                    <Text style={styles.balanceTxt} > Balance: </Text>
                    <Text style={styles.totalBalanceTxt} >{ItemTotal}</Text>
                </View>

                <TouchableOpacity style={styles.addIcon} >
                    <MaterialIcons name='add' size={40} color="#E8E8E8" />
                </TouchableOpacity>

            </View>

        </ReanimatedSwipeable>
    )
}

export default SwipeAble

const styles = StyleSheet.create({
    rightAction: { overflow: 'visible', width: 50, height: 50, backgroundColor: 'purple' },
    leftAction: { overflow: 'visible', width: 50, height: 50, backgroundColor: 'blue' },
    swipeable: {
        overflow: 'visible',
        height: 70,
        // borderWidth: 1,
        marginHorizontal: 10,
        elevation: 4,
        marginBottom: 10,
    },
    card: {
        overflow: 'visible',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        borderRadius: 20,
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
    editIcon: {
        width: 50,
    },
    addIcon: {
        height: 40,
        width: 40,
        backgroundColor: "#5959B2",
        borderRadius: '50%',
    },

});