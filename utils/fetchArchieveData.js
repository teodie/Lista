import AsyncStorage from '@react-native-async-storage/async-storage';
import { archieveData } from '@/constants/utangList';

export const fetchArchieveData = async () => {
    try {
        const getJsonValue = await AsyncStorage.getItem('Archieve')
        const archieveStorage = getJsonValue != null ? JSON.parse(getJsonValue) : null;
        return archieveStorage ? archieveStorage : archieveData;
    } catch (e) {
        console.log(e)
        return archieveData;
    }
};

export const IndividualArchieveData = async (id) => {
    const archieveStorage = await fetchArchieveData()
    const individualArchieveData = archieveStorage.filter(element => element.id === id)
    return individualArchieveData
};


