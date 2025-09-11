import { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";
import { account } from "@/utils/appWrite"

const AuthContext = createContext(undefined)


export default AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    const signUp = async (email, password, username) => {
        try {
            const result = await account.create( ID.unique(), email, password, username );
            console.log(result)
            return null
        } catch (error) {
            console.error("Full error object:", error);
            console.error("Error message:", error.message);
            console.error("Error type:", error.type);
            console.error("Error code:", error.code);
            
            if(error instanceof Error) return error.message

            return "Error occured while creating account."
        }
    };

    const logIn = async (email, password) => {
        try {
            await account.createEmailPasswordSession(email, password)
            const session = await account.get()

            setUser(session)
            return null
        } catch (error) {
            if (error instanceof Error) {
                return error.message
            }
            return "There is an issue during log in"
        }


    }



    return (
        <AuthContext.Provider value={{ user, logIn, signUp }}>
            {children}
        </AuthContext.Provider>
    );

}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (context === undefined) {
        throw new Error("useAuth must be inside of the AuthProvider");
    }

    return context
}