import io from 'socket.io-client';
import {createContext,useContext, useEffect, useState} from 'react';
import { useAuth } from './AuthContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const socketContext = createContext();

export const useSocketContext=()=>{
    return useContext(socketContext);
}

export const SocketContextProvider=({children})=>{
    const [socket,setSocket] = useState(null);
    const [onlineUsers,setOnlineUsers] = useState([]);
    const {authUser} = useAuth()
    useEffect(()=>{
        if(authUser){
            const socket = io(BACKEND_URL,{
                query:{
                    userId:authUser?._id,
                },
                transports: ['websocket', 'polling'],
        });
        socket.on("getOnlineUsers",(users)=>{
            setOnlineUsers(users)
        });
        setSocket(socket);
        return()=>socket.close();
        } else{
            if(socket){
             socket.close();
             setSocket(null);   
            }
        }
    },[authUser]);
    return(
    <socketContext.Provider value={{socket,onlineUsers}}>
        {children}
    </socketContext.Provider>
   )
}