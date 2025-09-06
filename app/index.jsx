import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, FlatList, Pressable, } from 'react-native'
import React, { useEffect, useMemo, useState, useContext, useRef } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { AudioModule, useAudioRecorder, RecordingPresets } from 'expo-audio';
import { utangData } from '../constants/utangList';
import AddItems from '@/components/AddItems';
import { MODE } from '../constants/mode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalContainer from '@/components/ModalContainer';
import { PersonDataContext } from '@/context';
import AddName from '@/components/AddName';
import ExportArchieve from '@/components/ExportArchieve';
import SwipeAble from '@/components/SwipeAble';
import Animated, { useAnimatedStyle, withSpring, withTiming, useSharedValue } from 'react-native-reanimated';
import { exportToCSV } from '@/utils/jsonToCsv';

const explore = () => {
  const { mode, setMode, utang, setUtang, personData } = useContext(PersonDataContext)
  const [id, setId] = useState(null);

  const [search, onChangeSearch] = useState('');
  const [name, onChangeName] = useState('');


  const [longPressed, setLongPressed] = useState(false)
  const addX = useSharedValue(0)
  const addY = useSharedValue(0)
  const deleteX = useSharedValue(0)
  const micY = useSharedValue(0)
  const elevate = useSharedValue(0)

  const handleLongPress = () => {
    if (!longPressed) {
      addX.value = withSpring(addX.value - 70)
      addY.value = withSpring(addY.value - 70)
      deleteX.value = withSpring(deleteX.value - 90)
      micY.value = withSpring(micY.value - 90)
      elevate.value = withTiming(elevate.value + 5)
    } else {
      addX.value = withTiming(addX.value + 70, { duration: 300 })
      addY.value = withTiming(addY.value + 70, { duration: 300 })
      deleteX.value = withTiming(deleteX.value + 90, { duration: 300 })
      micY.value = withTiming(micY.value + 90, { duration: 300 })
      elevate.value = withTiming(elevate.value - 5)
    }
    setLongPressed(prev => !prev)
  }


  const addAnimation = useAnimatedStyle(() => ({
    elevation : elevate.value,
    transform: [
      { translateX: addX.value },
      { translateY: addY.value }
    ]
  }));

  const deleteAnimation = useAnimatedStyle(() => ({
    elevation : elevate.value,
    transform: [
      { translateX: deleteX.value },
    ]
  }));

  const micAnimation = useAnimatedStyle(() => ({
    elevation : elevate.value,
    transform: [
      { translateY: micY.value },
    ]
  }));



  const filterName = useMemo(() => utang.filter(items => search.toLowerCase() === '' ? items.name : items.name.toLowerCase().includes(search.toLowerCase())), [utang, search])

  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('Listahan');
        const storageUtang = jsonValue != null ? JSON.parse(jsonValue) : null;

        if (storageUtang && storageUtang.length) {
          setUtang(storageUtang.sort((a, b) => b.id - a.id))
        } else {
          setUtang(utangData.sort((a, b) => b.id - a.id))
        }

      } catch (e) {
        console.error('Error retrieving the data erro: ', e)
      }
    };


    const getPermission = async () => {
      try {
        const status = await AudioModule.requestRecordingPermissionsAsync();
        if (!status.granted) {
          Alert.alert('Permission needed', 'This app needs access to your microphone to record audio.');
        }
      } catch (err) {
        console.error('Failed to get permission:', err);
      }
    };

    getData()
    getPermission();
  }, []);


  useEffect(() => {
    const storeData = async (value) => {
      try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem('Listahan', jsonValue);
      } catch (e) {
        console.log('Error saving the data with error: ', e)
      }
    };

    storeData(utang)
  }, [utang])




  return (
    <View style={styles.container}>

      <View style={styles.headerContainer}>
        <View style={styles.topHeader}>
          <Text style={styles.titleTxt}>Lista</Text>
          <ExportArchieve />
        </View>

        <View style={{ flexDirection: "row", margin: 10 }}>
          <TextInput
            style={styles.searchInput}
            onChangeText={onChangeSearch}
            placeholder='Search Here...'
            placeholderTextColor='gray'
            value={search}
            autoFocus={false}
          />
        </View>

        <TouchableOpacity style={styles.clearSearch} onPress={() => onChangeSearch('')}>
          <MaterialIcons name='clear' size={30} color='gray' />
        </TouchableOpacity>

      </View>

      <View style={styles.cardContainer}>
        <FlatList
          data={filterName}
          renderItem={({ item }) => <SwipeAble data={item} />}
          keyExtractor={item => item.id.toString()}
        />

      </View>



      {mode === MODE.ADD_ITEM && personData && < AddItems />}

      <ModalContainer
        children={<AddName id={id} setId={setId} name={name} onChangeName={onChangeName} />}
        visible={[MODE.ADD_NAME, MODE.EDIT_NAME].includes(mode)}
        setMode={setMode} />

      <View style={{ borderWidth: 1, position: 'relative' }}>
        <Pressable style={[styles.iconStyle, styles.addIcon]} onPress={() => { setMode(MODE.ADD_NAME) }} onLongPress={handleLongPress} >
          <MaterialIcons name='add' size={40} color="#E8E8E8" />
        </Pressable>

        <Animated.View style={[styles.iconStyle, styles.micIcon, micAnimation]}>
          <TouchableOpacity onPress={() => { Alert.alert("AI Transcription feature currently not available") }} >
            <MaterialIcons name='mic' size={40} color="#E8E8E8" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.iconStyle, deleteAnimation]}>
          <TouchableOpacity onPress={() => { Alert.alert("Delete feature currently not available")  }} >
            <MaterialIcons name='delete' size={40} color="#E8E8E8" />
          </TouchableOpacity>
        </Animated.View>


        <Animated.View style={[styles.iconStyle, addAnimation]} >
          <TouchableOpacity onPress={() => { exportToCSV(utang, "Store Credits")}} >
            <MaterialIcons name='save-alt' size={40} color="#E8E8E8" />
          </TouchableOpacity>
        </Animated.View>

      </View>


    </View>
  )
}

export default explore

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  text: {
    color: 'black',
    fontSize: 20,
    textAlign: 'left',
  },
  iconStyle: {
    backgroundColor: '#5959B2',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    margin: 20,
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 10,
  },
  addIcon: {
    zIndex: 2,
    elevation: 5
  },
  headerContainer: {
    height: 150,
    backgroundColor: '#5959B2',
    justifyContent: "flex-end",
  },
  searchInput: {
    height: 40,
    flexGrow: 1,
    // borderWidth: 1,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  titleTxt: {
    fontSize: 40,
    marginLeft: 15,
    fontWeight: "bold",
    color: "white",
    position: 'relative',
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 20,
  },
  clearSearch: {
    position: 'absolute',
    right: 10,
    bottom: 15,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    paddingVertical: 10,
  }

})