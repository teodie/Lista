import {
  View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, TextInput, Image, FlatList, Pressable, Platform
} from 'react-native'
import React, { useEffect, useMemo, useState, useRef } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { AudioModule, useAudioRecorder, RecordingPresets } from 'expo-audio';
import * as FileSystem from 'expo-file-system'
import { utangData } from '../constants/utangList';
import { router } from 'expo-router';
import { AddItemContext } from '../context'
import AddItems from '@/components/AddItems';


const explore = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  // For conditional rendering
  const [isAddingName, setisAddingName] = useState(false);
  const [isUpdatingName, setisUpdatingName] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const [currentPersonData, setcurrentPersonData] = useState(null);
  const [id, setId] = useState(null);
  const [parsedData, setParsedData] = useState(null);

  const [utang, setUtang] = useState(utangData.sort((a, b) => b.id - a.id));

  const [search, onChangeSearch] = useState('');
  const [name, onChangeName] = useState('');
  const [transcribedText, setTranscribedText] = useState('');

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const filterName = useMemo(() => utang.filter(items => search.toLowerCase() === '' ? items.name : items.name.toLowerCase().includes(search.toLowerCase())), [utang, search])

  useEffect(() => {
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

    getPermission();
  }, []);

  const Utang = ({ person }) => {
    const totalBalance = person.items.reduce((sum, item) => sum + item.price, 0);

    return (

      <View style={{ margin: 8, borderRadius: 10, height: 80, flexDirection: "row", justifyContent: "flex-end", boxShadow: "0px 0px 10px 10px rgba(2, 1, 1, 0.1)", alignItems: "center" }}>


        <View style={{ flex: 1, justifyContent: 'center', width: '100%', alignItems: 'center', height: '100%' }}>
          <TouchableOpacity
            onPress={() => router.navigate({ pathname: '/items', params: { data: JSON.stringify(person), total: totalBalance } })}>
            <Text
              style={{ fontSize: 15, fontWeight: "bold" }}>
              {person.name}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ width: 100, alignItems: "center", marginRight: 20 }} >
          <Text style={{ fontSize: 15, fontWeight: "300" }}>Balance:</Text>
          <Text style={{ fontSize: 25, fontWeight: "bold", color: "green" }} >{totalBalance}</Text>
        </View>

        <Pressable
          style={{ width: 50, marginRight: 10 }}
          onPress={() => {
            setisUpdatingName(!isUpdatingName)
            onChangeName(person.name)
            setId(person.id)
          }}
        >
          <MaterialIcons
            // name="chevron-right"
            name="edit-document"
            size={40}
            color="#5959B2"
          />
        </Pressable>

        <Pressable
          style={{ width: 50 }}
          onPress={() => { deleteName(person.id) }}
        >
          <MaterialIcons
            // name="chevron-right"
            name="delete"
            size={40}
            color="#5959B2"
          />
        </Pressable>


        <TouchableOpacity
          style={{ height: 40, width: 40, backgroundColor: "#5959B2", borderRadius: '50%', marginRight: 10 }}
          onPress={() => {
            setcurrentPersonData(person);
            setIsAddingItem(!isAddingItem)
          }}
        >
          <MaterialIcons
            name='add'
            size={40}
            color="#E8E8E8"
          />
        </TouchableOpacity>


      </View>

    );
  };

  // CRUD Testing
  const createName = () => {
    if (name.trim()) {
      const newId = utang.length > 0 ? utang[0].id + 1 : 1;
      setUtang([{ id: newId, name: name, items: [] }, ...utang])
      onChangeName('')
      console.log(newId)
    }
  };

  const searchName = () => {
    setUtang(utang.filter(item =>
      search.toLowerCase() === ''
        ? item.name
        : item.name.toLowerCase().includes(search)))

  };

  const updateName = (id) => {
    setUtang(utang.map(utang => utang.id === id ? { ...utang, name: name } : utang))
    console.log(id.toString() + " Has been Updated.")
  };

  const deleteName = (id) => {
    setUtang(utang.filter(utang => utang.id !== id))
    console.log(id.toString() + " Has been deleted!")
  };

  const handleApiError = (error) => {
    if (error.response?.status === 429) {
      Alert.alert(
        'Rate Limit Reached',
        'You have reached your API quota limit. Please try again later.'
      );
    } else if (error.response?.status === 401) {
      Alert.alert(
        'Authentication Error',
        'Invalid API key or authentication failed.'
      );
    } else if (error.response?.status === 400) {
      Alert.alert(
        'Invalid Request',
        'There was a problem with the request. Please try again.'
      );
    } else {
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again later.'
      );
    }
  };

  const startRecording = async () => {
    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const sendToWhisper = async (audioUri) => {
    try {
      setIsProcessing(true);

      // Read the audio file as base64
      const audioBase64 = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const formData = new FormData();
      formData.append('file', {
        uri: audioUri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      });
      formData.append('model', 'whisper-1');
      formData.append('language', 'tl'); // Filipino/Tagalog

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${'api for whisper'}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          response: {
            status: response.status,
            data: errorData
          }
        };
      }

      const data = await response.json();
      setTranscribedText(data.text);
      await parseTranscription(data.text);
    } catch (error) {
      console.error('Error sending to Whisper:', error);
      handleApiError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const parseTranscription = async (text) => {
    try {
      setIsProcessing(true);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${'api for whisper'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{
            role: "system",
            content: "You are a helper that converts Filipino/Tagalog sari-sari store orders into structured JSON. Extract customer name and items with quantities."
          }, {
            role: "user",
            content: text
          }],
          functions: [{
            name: "process_order",
            parameters: {
              type: "object",
              properties: {
                customer_name: { type: "string" },
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      item: { type: "string" },
                      quantity: { type: "number" }
                    }
                  }
                }
              }
            }
          }],
          function_call: { name: "process_order" }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          response: {
            status: response.status,
            data: errorData
          }
        };
      }

      const data = await response.json();
      const parsedOrder = JSON.parse(data.choices[0].message.function_call.arguments);
      setParsedData(parsedOrder);
      console.log('Parsed order:', parsedOrder);
    } catch (error) {
      console.error('Error parsing with GPT:', error);
      handleApiError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      setIsRecording(false);

      console.log('Recording saved at:', audioRecorder.uri);
      // Send to Whisper after recording stops
      await sendToWhisper(audioRecorder.uri);
    } catch (err) {
      console.error('Failed to stop recording:', err);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const handleRecordPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.headerContainer}>
        <Text style={{ fontSize: 40, marginLeft: 15, fontWeight: "bold", color: "white" }}>Lista</Text>

        <View style={{ flexDirection: "row", margin: 10 }}>
          <TextInput
            style={styles.searchInput}
            onChangeText={onChangeSearch}
            placeholder='Search Here...'
            value={search}
          />
          <TouchableOpacity
            onPress={() => searchName()}
            style={{ borderWidth: 1, borderTopRightRadius: 5, borderBottomRightRadius: 5, justifyContent: "center" }}
          >
            <MaterialIcons
              style={{}}
              name="search"
              size={30}
              color="#E8E8E8"
            />
          </TouchableOpacity>

        </View>
      </View>

      <FlatList
        data={filterName}
        renderItem={({ item }) => <Utang person={item} />}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />

      {isProcessing && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" color="#5959B2" />
          <Text style={styles.processingText}>Processing your request...</Text>
        </View>
      )}

      {isAddingItem && currentPersonData &&
        <AddItemContext.Provider value={{ isAddingItem, setIsAddingItem }}>
          < AddItems
            personData={currentPersonData}
            utang={utang}
            setUtang={setUtang}
         />
        </AddItemContext.Provider >
      }

      {(isAddingName || isUpdatingName) && (
        <View style={styles.processingOverlay}>

          <TextInput
            style={{ height: 'auto', borderWidth: 1, borderColor: 'black', width: "70%", borderRadius: 5 }}
            onChangeText={onChangeName}
            placeholder='Type the name here....'
            value={name}
            autoFocus={true}
          />

          <TouchableOpacity
            style={styles.recordButton}
            onPress={() => {

              if (isAddingName) {
                setisAddingName(!isAddingName)
                createName()
              }

              if (isUpdatingName) {
                setisUpdatingName(!isUpdatingName)
                updateName(id)
                onChangeName('')
                setId(null)
              }

            }}
          >
            <MaterialIcons
              name='add'
              size={40}
              color="#E8E8E8"
            />
          </TouchableOpacity>

        </View>
      )}

      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <TouchableOpacity
          style={[styles.recordButton, isProcessing && styles.disabledButton]}
          onPress={handleRecordPress}
          disabled={isProcessing}
        >
          <MaterialIcons
            name={isRecording ? "stop" : "mic"}
            size={40}
            color="#E8E8E8"
          />
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.recordButton}
          onPress={() => { setisAddingName(!isAddingName) }}
        >
          <MaterialIcons
            name='add'
            size={40}
            color="#E8E8E8"
          />
        </TouchableOpacity>

      </View>


      {transcribedText ? (
        <View style={styles.resultContainer}>
          <Text style={styles.transcribedText}>{transcribedText}</Text>
          {parsedData && (
            <Text style={styles.parsedData}>
              {JSON.stringify(parsedData, null, 2)}
            </Text>
          )}
        </View>
      ) : null}
    </View>
  )
}

export default explore

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  text: {
    color: 'black',
    fontSize: 20,
    textAlign: 'left',
  },
  recordButton: {
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
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  }

})