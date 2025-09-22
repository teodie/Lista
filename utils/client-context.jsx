import { createContext, useContext, useState } from "react";
import { tablesDB } from "./appWrite";
import { useAuth } from "./auth-context";
import { ID, Permission, Query, Role } from "react-native-appwrite";


const ClientContext = createContext(undefined)


export const ClientProvider = ({ children }) => {
    const { user } = useAuth()
    const [clients, setClients] = useState([])

    const DATABASE_ID = "68d0405600204e96d21b"
    const TABLE_ID = "clients"

    const fetchClients = async () => {
        try {
            const data = await tablesDB.listRows(
                DATABASE_ID,
                TABLE_ID,
                [
                    Query.equal('userId', user.$id)
                ]
            )
            setClients(data)
        } catch (error) {
            console.log(error)
        }
    }

    const updateClient = (id) => {
        try {

        } catch (error) {
            console.log(error)
        }
    }

    const deleteClient = (id) => {
        try {

        } catch (error) {
            console.log(error)
        }
    }


    const createClient = async (name) => {
        try {
            await tablesDB.createRow(
                DATABASE_ID,
                TABLE_ID,
                ID.unique(),
                { userId: user.$id, name: name },
                [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id)),
                ]
            )
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <ClientContext.Provider value={{clients, createClient, fetchClients }}>
            {children}
        </ClientContext.Provider>)
}

export const useClient = () => {
    const context = useContext(ClientContext)

    if (context === undefined) {
        console.error("Your trying to use the useClient hook outside the provider")
    }

    return context
}