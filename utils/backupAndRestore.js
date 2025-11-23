import { tablesDB } from "./appWrite"
import saveFileAs from "./savetoPhone"
import { Permission, Query, Role } from "react-native-appwrite";


const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID
const clientTable = process.env.EXPO_PUBLIC_APPWRITE_CLIENTS_TABLE_ID
const itemsTable = process.env.EXPO_PUBLIC_APPWRITE_ITEMS_TABLE_ID

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID
const CLIENTS_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_CLIENTS_TABLE_ID
const ITEMS_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_ITEMS_TABLE_ID

const fetchAllClientWith = async (UserId) => {
  try {
    const response = await tablesDB.listRows(
      databaseId,
      clientTable,
      [
        Query.equal('userId', UserId),
        Query.limit(200),
      ]
    )

    return response.rows
  } catch (error) {
    console.log(error)
    return `Error fetching clients: ${error}`
  }
}

const fetchtAllItemsWith = async (UserId) => {
  try {
    const response = await tablesDB.listRows(
      databaseId,
      itemsTable,
      [
        Query.equal('userId', UserId),
        Query.limit(1000),
      ],
    )

    return response.rows
  } catch (error) {
    return `Error when fetching Items: ${error}`
  }

}

const fetchtAllClientItems = async (clientId) => {
  try {
    const response = await tablesDB.listRows(
      databaseId,
      itemsTable,
      [
        Query.equal('clientId', clientId),
        Query.limit(1000),
      ],
    )

    return response.rows
  } catch (error) {
    return `Error when fetching Items: ${error}`
  }
}

const backup = async (UserId) => {
  let backupText = ''
  let clients
  let items
  // fetch all client
  clients = await fetchAllClientWith(UserId)
  // save to text file under {clients: {client}}
  backupText += `{"clients":${JSON.stringify(clients, null, 2)}}`
  // fetch all items
  items = await fetchtAllItemsWith(UserId)
  // savet to text file under {items: {items}}
  backupText += `--{"items":${JSON.stringify(items, null, 2)}}`

  const saveIsSuccess = saveFileAs("Lista_Backup", backupText)

  return saveIsSuccess
}

const createClient = async (id, data, user) => {
  try {
    await tablesDB.createRow(
      DATABASE_ID,
      CLIENTS_TABLE_ID,
      id,
      data,
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

const createItem = async (id, data, user) => {
  try {
    await tablesDB.createRow(
      DATABASE_ID,
      ITEMS_TABLE_ID,
      id,
      data,
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

const updateClientItemsTotal = async (id, newTotal) => {
  try {
    const result = await tablesDB.updateRow(
      DATABASE_ID,
      CLIENTS_TABLE_ID,
      id,
      {itemsTotal: newTotal},
    )

    console.log(result)
  } catch (error) {
    console.log(error)
  }
}



export const Restore = async (txtFile, currentClients, user) => {
  const currentClientIds = currentClients.map(client => client.$id)

  const text = txtFile.split("--")
  const clients = JSON.parse(text[0]).clients
  const items = JSON.parse(text[1]).items
  const currentItems = await fetchtAllItemsWith(user.$id)

  console.log("Items in the restore functions", items)
  // loop through each clients
  clients.forEach(async client => {

    if (currentClientIds.includes(client.$id)) return console.log(`Skipping as client ${client.name} is already in the database`)

    // create client to the database
    console.log("Creating the client: ", client.name)
    await createClient(client.$id, {
      userId: client.userId,
      name: client.name,
      balance: client.balance,
      itemsTotal: client.itemsTotal,
    }, user)

  })

  if (items.length === 0 || !items) return console.log("No items to restore")

  const currentItemsIds = currentItems.map(item => item.$id)

  // check if the the client ID exist on the current database
  items.forEach(async item => {
    if (currentItemsIds.includes(item.$id)) return console.log(`Skipping as item ${item.productName} is already in the database`)

    console.log("Creating the item: ", item.productName)

    await createItem(item.$id, {
      userId: item.userId,
      clientId: item.clientId,
      productName: item.productName,
      price: item.price,
      paid: item.paid,
      client: item.client,
      transaction: item.transaction,
      date: item.date,
    }, user)

  })

  const updatedClients = await fetchAllClientWith(user.$id)
  
  updatedClients.forEach(async client => {
    const clientItems = await fetchtAllClientItems(client.$id)
    const total = clientItems.reduce((total, item) => total + item.price, 0)
    await updateClientItemsTotal(client.$id, total)
  })


}

export default backup