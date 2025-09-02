import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Parser } from '@json2csv/plainjs';

export const exportToCSV = async (jsonObject) => {
    
    try {
        const csv = await convertToString(jsonObject)
        // 3. Define the file path
        const fileUri = FileSystem.documentDirectory + 'tryData.csv';

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
    
    let all = ''

    data.forEach((element) => {
        const transactionParser = new Parser({ header: true });
        const itemParser = new Parser({ header: true })

        const {items, ...transac} = element

        const transaction = transactionParser.parse(transac)
        const item = itemParser.parse(items)
        all = all + "\n" + transaction + "\n" + item
    })
    // Trim the \n in the beggining of the data
    return all.trim()
}