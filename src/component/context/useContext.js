import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./userReducer";

const INITIAL_STATE = {
    currentUser: null,
}

try {
    const user = localStorage.getItem("user");
    if(user) {
      INITIAL_STATE.currentUser = JSON.parse(user);
    }
} catch (error) {
    console.log("Error parsing JSON from localStorage", error);
}

export const AuthContext = createContext(INITIAL_STATE);



export const AuthContextProvider =({children}) =>{
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    useEffect(()=>{
        localStorage.setItem("user",JSON.stringify(state.currentUser))
        },[state.currentUser])
    return(
        <AuthContext.Provider value={{currentUser: state.currentUser, dispatch }}>
            {children}
            </AuthContext.Provider>
    )
}