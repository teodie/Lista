const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
const [isRecording, setIsRecording] = useState(false);
const [parsedData, setParsedData] = useState(null);
const [transcribedText, setTranscribedText] = useState('');


const handleRecordPress = () => {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
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

const sendToWhisper = async (audioUri) => {
    try {
        setMode(MODE.PROCESSING);

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
        setMode(MODE.IDLE);
    }
};

const parseTranscription = async (text) => {
    try {
        setMode(MODE.PROCESSING);

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
        setMode(MODE.IDLE);
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

// for showing up on the screen
{
    transcribedText && (
        <View style={styles.resultContainer}>
            <Text style={styles.transcribedText}>{transcribedText}</Text>
            {parsedData && (
                <Text style={styles.parsedData}>
                    {JSON.stringify(parsedData, null, 2)}
                </Text>
            )}
        </View>
    )
}

<TouchableOpacity
    style={[styles.iconStyle, mode === MODE.PROCESSING && styles.disabledButton]}
    onPress={handleRecordPress}
    disabled={mode === MODE.PROCESSING}>
    <MaterialIcons name={isRecording ? "stop" : "mic"} size={40} color="#E8E8E8" />
</TouchableOpacity>