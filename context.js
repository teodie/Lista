import { createContext } from 'react'

export const PersonDataContext = createContext({
    personData: {},
    setPersonData: (_value) => {},
    mode: 'IDLE',
    setMode: (_value) => {},
    utang: [],
    setUtang: (_value) => {},
    archieveVisible: false,
    setArchieveVisible: (_value) => {},
})