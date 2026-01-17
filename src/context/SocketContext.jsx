// my original code

// import io from 'socket.io-client';
// import {createContext,useContext, useEffect, useState} from 'react';
// import { useAuth } from './AuthContext';

//     const socketContext = createContext();

// export const useSocketContext=()=>{
//     return useContext(socketContext);
// }

// export const SocketContextProvider=({children})=>{
//     const [socket,setSocket] = useState(null);
//     const [onlineUsers,setOnlineUsers] = useState([]);
//     const {authUser} = useAuth()
//     useEffect(()=>{
//         if(authUser){

//             const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
//             const socket = io(BACKEND_URL,{
//                 query:{
//                     userId:authUser?._id,
//                 }
//         });
//         socket.on("getOnlineUsers",(users)=>{
//             setOnlineUsers(users)
//         });
//         setSocket(socket);
//         return()=>socket.close();
//         } else{
//             if(socket){
//              socket.close();
//              setSocket(null);   
//             }
//         }
//     },[authUser]);
//     return(
//     <socketContext.Provider value={{socket,onlineUsers}}>
//         {children}
//     </socketContext.Provider>
//    )
// }


// chatgpt code
import io from "socket.io-client";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const socketContext = createContext();

export const useSocketContext = () => useContext(socketContext);

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuth();

  useEffect(() => {
    if (!authUser) {
      // if no user, disconnect existing socket
      if (socket) {
        socket.close();
        setSocket(null);
      }
      return;
    }

    // ✅ Import env inside useEffect
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    // ✅ Avoid shadowing: use a different variable name
    const socketInstance = io(BACKEND_URL, {
      query: { userId: authUser?._id },
    });

    socketInstance.on("getOnlineUsers", (users) => setOnlineUsers(users));

    setSocket(socketInstance);

    return () => socketInstance.close();
  }, [authUser]);

  return (
    <socketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </socketContext.Provider>
  );
};
