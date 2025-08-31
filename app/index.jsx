import {
  View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, TextInput, FlatList, Modal,
  ScrollView
} from 'react-native'
import React, { useEffect, useMemo, useState, useRef, useContext } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { AudioModule, useAudioRecorder, RecordingPresets } from 'expo-audio';
import * as FileSystem from 'expo-file-system'
import { utangData } from '../constants/utangList';
import AddItems from '@/components/AddItems';
import { MODE } from '../constants/mode';
import UtangOverView from '@/components/UtangOverView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalContainer from '@/components/ModalContainer';
import { PersonDataContext } from '@/context';
import AddName from '@/components/AddName';

const explore = () => {
  const { mode, setMode, utang, setUtang, personData } = useContext(PersonDataContext)
  const [id, setId] = useState(null);

  const [search, onChangeSearch] = useState('');
  const [name, onChangeName] = useState('');

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


  const deleteName = (id) => {
    Alert.alert(
      'Deleting Client Data',
      'Client Data will be permanently deleted\nStill want to delete this client data?',
      [{ text: 'Cancel', style: 'cancel' }, {
        text: "Delete", onPress: () => {
          Alert.alert('Sure na Sure?', '', [
            { text: 'Hinde', style: 'cancel' },
            {
              text: 'Oo',
              onPress: () => {
                setUtang(utang.filter(item => item.id !== id))
              }, style: 'destructive'
            }])
        }, style: 'default'
      }],
      { cancelable: true },
    )

  };

  return (
    <View style={styles.container}>

      <View style={styles.headerContainer}>

        <Text style={styles.titleTxt}>Lista</Text>

        <View style={{ flexDirection: "row", margin: 10 }}>
          <TextInput
            style={styles.searchInput}
            onChangeText={onChangeSearch}
            placeholder='Search Here...'
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
          renderItem={({ item }) =>
            <UtangOverView
              person={item}
              setId={setId}
              onChangeName={onChangeName}
              deleteName={deleteName}
            />}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>


      {mode === MODE.ADD_ITEM && personData && < AddItems />}

      <ModalContainer 
      children={<AddName id={id} setId={setId} name={name} onChangeName={onChangeName} />} 
      visible={[MODE.ADD_NAME, MODE.EDIT_NAME].includes(mode)} 
      setMode={setMode} />

        <TouchableOpacity style={styles.iconStyle} onPress={() => { setMode(MODE.ADD_NAME) }} >
          <MaterialIcons name='add' size={40} color="#E8E8E8" />
        </TouchableOpacity>

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
    elevation: 5,
    alignSelf: 'flex-end'
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  processingText: {
    marginTop: 10,
    color: '#5959B2',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  resultContainer: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 20,
    maxHeight: '50%',
  },
  transcribedText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  parsedData: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
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
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
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