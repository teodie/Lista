import { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";
import { account } from "@/utils/appWrite"

const AuthContext = createContext(undefined)

export default AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    const signUp = async (email, password) => {
        try {
            await account.create(ID.unique(), email, password);
            return null;
        } catch (error) {
            if (error instanceof Error) {
                return error.message;
            }

            return "An error occured during signup";
        }
    };

    const logIn = async (email, password) => {
        try {
            await account.createEmailPasswordSession(email, password)
            const session = await account.get()

            setUser(sanitizedUser)
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