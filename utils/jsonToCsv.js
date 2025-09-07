import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Parser } from '@json2csv/plainjs';
import { Alert } from 'react-native';

export const exportToCSV = async (jsonObject, filename) => {
    try {
        const csv = await convertToString(jsonObject)


        // 3. Define the file path
        const fileUri = FileSystem.documentDirectory + filename + '.csv';

        // 4. Write the CSV file
        await FileSystem.writeAsStringAsync(fileUri, csv, {
            encoding: FileSystem.EncodingType.UTF8,
        });

        // 5. Share the file
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
        } else {
            Alert.alert('Sharing is not available on this device');
        }

    } catch (error) {
        console.error('Error exporting CSV:', error);
    }
};

const convertToString = async (data) => {
    // This will format the data for readability in excel when exported
    let all = ''

    data.forEach((element) => {
        const transactionParser = new Parser({ header: true });
        const itemParser = new Parser({ header: true })

        const { items, ...transac } = element

        const transaction = transactionParser.parse(transac)

        if (!items || items.length == 0) {
            all += transaction + '\n\n'
        } else {
            const item = itemParser.parse(items)
            all += transaction + "\n" + item + "\n\n"
        }

    })

    // Trim the \n in the beggining of the data
    return all.trim()
}


export const share = async (jsonObject, filename) => {
    const parser = new Parser({ header: true })

    const jsonString = parser.parse(jsonObject)
    const filepath = FileSystem.documentDirectory + 'utang ni ' + filename + '.csv'
    const options = { encoding: FileSystem.EncodingType.UTF8 }

    try {
        await FileSystem.writeAsStringAsync(filepath, jsonString, options)

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(filepath)
        } else {
            Alert.alert('Sharing is not available on this device!')
        }

    } catch (e) {
        console.log(e)
    }

}
