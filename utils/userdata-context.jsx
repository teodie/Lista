
import React, { createContext, useState, useContext } from 'react'
import { MODE } from '@/constants/mode'

const DataContext = createContext(undefined)

const DataProvider = ({ children }) => {
    const [personData, setPersonData] = useState({})
    const [utang, setUtang] = useState([])
    const [mode, setMode] = useState(MODE.IDLE)
    const [archieveVisible, setArchieveVisible] = useState(false)

    return (
        <DataContext.Provider value={{ personData, setPersonData, mode, setMode, utang, setUtang, archieveVisible, setArchieveVisible }}>
            {children}
        </DataContext.Provider>
    );
}

export default DataProvider

export const useData = () => {
    const context = useContext(DataContext)

    if(context === undefined) {
        throw new Error("Trying to access userData outside the provider.")
    }

    return context
}