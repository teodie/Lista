import { TouchableWithoutFeedback, View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, FlatList, Pressable, StatusBar, Keyboard, Image } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { AudioModule, useAudioRecorder, RecordingPresets } from 'expo-audio';
import AddItems from '@/components/AddItems';
import { MODE } from '@/constants/mode';
import ModalContainer from '@/components/ModalContainer';
import AddName from '@/components/AddName';
import ExportArchieve from '@/components/ExportArchieve';
import SwipeAble from '@/components/SwipeAble';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { exportToCSV } from '@/utils/jsonToCsv';
import { useData } from '@/utils/userdata-context';
import { useClient } from '@/utils/client-context';
import * as Notifications from 'expo-notifications';
import KeyBoardDismisView from '@/components/KeyBoardDismis';

const explore = () => {
  const { mode, setMode, utang, personData } = useData()
  const [id, setId] = useState(null);
  const { clients } = useClient()

  const [search, onChangeSearch] = useState('');
  const [name, onChangeName] = useState('');
  const [filteredClients, setFilteredClients] = useState([])

  const scrollRef = useRef(null);


  useEffect(() => {

    const getPermission = async () => {
      try {
        // Audio Permission
        const status = await AudioModule.requestRecordingPermissionsAsync();
        if (!status.granted) {
          Alert.alert('Permission needed', 'This app needs access to your microphone to record audio.');
        }

        //Notification Permission
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          alert('Permission for notifications not granted');
        }
      } catch (err) {
        console.error('Failed to get permission:', err);
      }
    };
    getPermission();
  }, []);

  useEffect(() => {
    filterClient()
  }, [search, clients])

  const filterClient = () => {
    search.trim() === ''
      ? setFilteredClients(clients)
      : setFilteredClients(clients.filter((client) => client.name?.toLowerCase().includes(search.toLowerCase())))
  }

  return (
    <KeyBoardDismisView>
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
            />
          </View>

          <TouchableOpacity style={styles.clearSearch} onPress={() => onChangeSearch('')}>
            <MaterialIcons name='clear' size={30} color='gray' />
          </TouchableOpacity>

        </View>

        <View style={styles.cardContainer}>
          {filteredClients.length === 0 &&
            <Image
              style={{height: 300, width: '100%', alignSelf: 'center', marginTop: 100}}
              source={require('@/assets/gifs/Empty.gif')}
            />
          }
          <Animated.FlatList
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            itemLayoutAnimation={LinearTransition.springify()}
            data={filteredClients}
            renderItem={({ item }) =>
              <SwipeAble data={item} scrollRef={scrollRef} />}
            keyExtractor={item => item.$id.toString()}
          />



        </View>

        {mode === MODE.ADD_ITEM && personData && < AddItems />}

        <ModalContainer
          children={<AddName id={id} setId={setId} name={name} onChangeName={onChangeName} />}
          visible={[MODE.ADD_NAME, MODE.EDIT_NAME].includes(mode)}
          setMode={setMode} />

      </View>
    </KeyBoardDismisView>
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
    paddingTop: 10,
  }

})