import { createContext, useContext, useEffect, useState } from "react";
import { ID } from "react-native-appwrite";
import { account, OauthProvider } from "@/utils/appWrite"
import toast from '@/utils/toast'

const AuthContext = createContext(undefined)


export default AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  useEffect(() => {
    // Check if we're returning from OAuth
    handleOAuthRedirect();
    getUser();
  }, []);

  const handleOAuthRedirect = async () => {
    try {
      // Check if we're in a web environment
      if (typeof window === 'undefined') return;
      
      // Check if we have OAuth parameters in the URL
      const urlParams = new URLSearchParams(window.location.search);
      const secret = urlParams.get('secret');
      const userId = urlParams.get('userId');
      console.log("OAuth params:", { secret, userId });
      
      if (secret && userId) {
        console.log("OAuth redirect detected, creating session...");
        await account.createSession({
          userId,
          secret
        });
        
        // Get user data after successful OAuth
        await getUser();
        
        // Clean up URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Show success message
        toast("Successfully signed in with Google!");
      }
    } catch (error) {
      console.error("OAuth redirect error:", error);
      toast("Failed to complete Google sign-in");
    }
  };

  const getUser = async () => {
    try {
      const session = await account.get();
      console.log("Session: ", session)
      setUser(session);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const googleSignUp = async () => {
    console.log("Google signUp function called")

    try {
      // Check if we're in a web environment
      if (typeof window === 'undefined') {
        console.log("Not in web environment");
        return "Google sign-in is not available in this environment";
      }
      
      console.log("In web environment, proceeding with OAuth");
      
      // For web browsers, we need to handle the OAuth flow differently
      const currentUrl = window.location.origin;
      console.log("Current URL:", currentUrl);
      const successUrl = `${currentUrl}/`;
      const failureUrl = `${currentUrl}/login`;
      
      console.log("Success URL:", successUrl);
      console.log("Failure URL:", failureUrl);
      
      console.log("Creating OAuth session...");
      const result = await account.createOAuth2Session({
        provider: OauthProvider.Google,
        success: successUrl,
        failure: failureUrl,
      });
      
      console.log("OAuth session created successfully:", result);
      
      // Redirect to the OAuth URL
      if (result && result.href) {
        console.log("Redirecting to:", result.href);
        window.location.href = result.href;
      } else {
        console.error("No redirect URL received from OAuth session");
        return "Failed to get OAuth redirect URL";
      }
    } catch (error) {
      console.error("Google OAuth error:", error);
      console.error("Error details:", {
        message: error.message,
        type: error.type,
        code: error.code,
        stack: error.stack
      });
      return error.message || "Failed to initiate Google sign-in";
    }
  }

  const signUp = async (email, password, username) => {
    try {
      await account.create(ID.unique(), email, password, username);
      await logIn(email, password)

      return null
    } catch (error) {
      console.error("Full error object:", error);
      console.error("Error message:", error.message);
      console.error("Error type:", error.type);
      console.error("Error code:", error.code);

      if (error instanceof Error) return error.message

      return "Error occured while creating account."
    }
  };

  const logIn = async (email, password) => {
    try {
      await account.createEmailPasswordSession(email, password)
      const session = await account.get()
      setUser(session)
      toast(`Welcome Back ${session.name.charAt(0).toUpperCase() + session.name.slice(1)}!`)
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
    <AuthContext.Provider value={{ user, isLoadingUser, logIn, signUp, signOut, googleSignUp }}>
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