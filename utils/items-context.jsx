import { createContext, useContext, useState } from "react";
import { useAuth } from "./auth-context";
import { client, tablesDB } from "./appWrite";
import { useData } from "./userdata-context";
import { useClient } from "./client-context";
import { Permission, Role, Query, TablesDB } from "react-native-appwrite";

// initialize the context
const ItemsContext = createContext(undefined)

// create a wrapper component
export const ItemsProvider = ({ children }) => {
    const [items, setItems] = useState([])
    const {user} = useAuth()
    const { clientId, setClientId } = useClient()

    const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID
    const ITEMS_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_ITEMS_TABLE_ID


    const fetchClientItems = async (clientId, isPaid) => {
        try {
            const response = await tablesDB.listRows(
                DATABASE_ID,
                ITEMS_TABLE_ID,
                [
                    Query.equal('clientId', clientId),
                    Query.equal('paid', isPaid),
                ]
            )
                
            if(response.total === 0) return null

            return response.rows
        } catch (error) {
            console.log(error)
            return null
        }
    }

    const fetchAllItems = async (clientId) => {
        try {
            const response = await tablesDB.listRows(
                DATABASE_ID,
                ITEMS_TABLE_ID,
                [
                    Query.equal('clientId', clientId),
                ]
            )
                
            if(response.total === 0) return null

            return response.rows
        } catch (error) {
            console.log(error)
            return null
        }
    }

    
    const updateItem = async (id, data) => {
        console.log("updating items now")
        try {
            const response = await tablesDB.updateRow(
                DATABASE_ID,
                ITEMS_TABLE_ID,
                id,
                data
            )

            console.log("response back: ", response)
        } catch (error) {
            console.log(error)
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

    const deleteItem = async (id) => {
        try {
            await tablesDB.deleteRow(
                DATABASE_ID,
                ITEMS_TABLE_ID,
                id
            )
        } catch (error) {
            console.log(error)
        }
    }

    const batchDelete = async (clientId) => {
        try {
            // fetch all the items with the same client Id
            const items = await fetchAllItems(clientId)

            // check it there are items returned
            if(items){
                // loop to the items and delete them one by one
                items.forEach((item) => {
                    deleteItem(item.$id)
                })
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <ItemsContext.Provider value={{items, createItem, fetchClientItems, batchDelete, updateItem  }}>
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