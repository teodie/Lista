import { createContext, useContext, useState } from "react";
import { useAuth } from "./auth-context";
import { client, tablesDB } from "./appWrite";
import { useData } from "./userdata-context";
import { useClient } from "./client-context";
import { Permission, Role, Query } from "react-native-appwrite";

// initialize the context
const ItemsContext = createContext(undefined)

// create a wrapper component
export const ItemsProvider = ({ children }) => {
    const [items, setItems] = useState([])
    const {user} = useAuth()
    const { clientId, setClientId } = useClient()

    const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID
    const ITEMS_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_ITEMS_TABLE_ID

    const fetchAllItems = () => {

    }

    const fetchClientItems = async (userId, clientId) => {
        console.log(userId, clientId)

        try {
            const response = await tablesDB.listRows(
                DATABASE_ID,
                ITEMS_TABLE_ID,
                [
                    Query.equal('userId', userId),
                    Query.equal('clientId', clientId)
                ]
            )
            
            if(response.total === 0) return null

            return response.rows
        } catch (error) {
            console.log(error)
            return null
        }
    }

    const createItem = async (data, id) => {
        try {
            await tablesDB.createRow(
                DATABASE_ID,
                ITEMS_TABLE_ID,
                id,
                {...data, userId: user.$id, paid: false, clientId: clientId , isSynced: false },
                [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id)),
                ]
            )

            setClientId(null)
        } catch (error) {
            console.log(error)
        }
    }

    const updatedItem = (id) => {

    }

    const deleteItem = (id) => {

    }

    return (
        <ItemsContext.Provider value={{items, createItem, fetchClientItems}}>
            {children}
        </ItemsContext.Provider>
    )
}

// create a hook to use the value in the provider
export const useItems = () => {
    const context = useContext(ItemsContext)

    if (context === undefined) {
        throw new Error("useItems must be inside of the ItemsProvider");
    }

    return context
}