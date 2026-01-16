import io from 'socket.io-client';
import {createContext,useContext, useEffect, useState} from 'react';
import { useAuth } from './AuthContext';

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
            const socket = io('http://localhost:3000/',{
                query:{
                    userId:authUser?._id,
                }
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