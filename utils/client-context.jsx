import { createContext, useContext, useEffect, useState } from "react";
import { client, tablesDB } from "./appWrite";
import { useAuth } from "./auth-context";
import { ID, Permission, Query, Role, TablesDB } from "react-native-appwrite";


const ClientContext = createContext(undefined)


export const ClientProvider = ({ children }) => {
    const { user } = useAuth()
    const [clients, setClients] = useState([])
    const [clientId, setClientId] = useState(null)

    const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID
    const CLIENTS_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_CLIENTS_TABLE_ID

    const fetchClientById = async () => {
        console.log("fetching client data row")
        try {
            const response = await tablesDB.getRow(
                DATABASE_ID,
                CLIENTS_TABLE_ID,
                clientId,
            )
            return response
        } catch (error) {
            console.log(error)
            return null
        }
    }

    const fetchClients = async () => {
        console.log("Fetching client of the user: ")
        try {
            const data = await tablesDB.listRows(
                DATABASE_ID,
                CLIENTS_TABLE_ID,
                [
                    Query.equal('userId', user.$id)
                ]
            )
            setClients(data.rows)
        } catch (error) {
            console.log(error)
        }
    }

    const updateClient = async (id, data) => {
        try {
            const result = await tablesDB.updateRow(
                DATABASE_ID,
                CLIENTS_TABLE_ID,
                id,
                data
            )

            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteClient = async (id) => {
        try {
            const result = await tablesDB.deleteRow(
                DATABASE_ID,
                CLIENTS_TABLE_ID,
                id
            )
            console.log("deleted: ", result)
        } catch (error) {
            console.log(error)
        }
    }


    const createClient = async (name, id, limit, paymentDays) => {
        console.log(typeof (limit))
        try {
            await tablesDB.createRow(
                DATABASE_ID,
                CLIENTS_TABLE_ID,
                id,
                {
                    userId: user.$id,
                    name: name,
                    isSynced: false,
                    creditLimit: limit,
                    paymentSchedule: [...paymentDays]
                },
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

    useEffect(() => {
        let unsubscribe
        if (!user) return setClients([])

        fetchClients()

        const channel = `databases.${DATABASE_ID}.tables.${CLIENTS_TABLE_ID}.rows`
        unsubscribe = client.subscribe(channel,
            (response) => {
                const { payload, events } = response
                if (events[0].includes('create')) {
                    setClients((prevClients) => [...prevClients, payload])
                }

                if (events[0].includes('delete')) {
                    console.log(JSON.stringify(payload, null, 2))
                    setClients((prevClients) => prevClients.filter((client) => client.$id !== payload.$id))
                }

                if (events[0].includes('update')) {
                    console.log(JSON.stringify(payload, null, 2))
                    setClients((prevClients) => prevClients.map((client) =>
                        client.$id === payload.$id
                            ? { ...client, name: payload.name, balance: payload.balance, itemsTotal: payload.itemsTotal }
                            : client)
                    )
                }
            }

        )


        return () => {
            if (unsubscribe) {
                unsubscribe()
            }
        }
    }, [user])


    return (
        <ClientContext.Provider value={{ clients, clientId, setClientId, createClient, fetchClients, deleteClient, updateClient, fetchClientById }}>
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