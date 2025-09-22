import { Account, Client , TablesDB , OAuthProvider} from 'react-native-appwrite';

export const client = new Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT) 
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID)
    .setDevKey(process.env.EXPO_PUBLIC_APPWRITE_DEV_KEY)
    // .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM)

export const account = new Account(client)
export const tablesDB = new TablesDB(client);
export const OauthProvider = OAuthProvider