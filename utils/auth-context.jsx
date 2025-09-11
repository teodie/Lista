import { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";
import { account } from "@/utils/appWrite"


const AuthContext = createContext(undefined)


export default AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoadingUser, setIsLoadingUser] = useState(true)

    useEffect(() => {
        getUser();
      }, []);
    
      const getUser = async () => {
        try {
          const session = await account.get();
          setUser(session);
        } catch (error) {
          setUser(null);
        } finally {
          setIsLoadingUser(false);
        }
      };

    const signUp = async (email, password, username) => {
        try {
            await account.create( ID.unique(), email, password, username );
            await logIn(email, password)
    
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


    const signOut = async () => {
        try {
          await account.deleteSession("current");
          setUser(null);
        } catch (error) {
          console.log(error);
        }
      };



    return (
        <AuthContext.Provider value={{ user, isLoadingUser, logIn, signUp, signOut }}>
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