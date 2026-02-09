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

 useEffect(() => {
    if (!authUser) {
      if (socket) {
        socket.close()
        setSocket(null)
      }
      return
    }

    const newSocket = io(window.location.origin, {
      query: {
        userId: authUser?._id
      },
      transports: ['websocket', 'polling'],
      withCredentials: true
    })

    newSocket.on('getOnlineUsers', users => {
      setOnlineUsers(users)
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [authUser])
  
    return(
    <socketContext.Provider value={{socket,onlineUsers}}>
        {children}
    </socketContext.Provider>
   )
}