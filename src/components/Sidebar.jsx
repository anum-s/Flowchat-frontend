import {MagnifyingGlassIcon , EllipsisVerticalIcon , ArrowLeftIcon} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/axios'
import {toast} from 'react-toastify'
import { useAuth } from '../context/AuthContext';
import userConversation from '../zustand/UseConversation'
import { useSocketContext } from '../context/SocketContext'

const Sidebar = ({onSelectUser}) => {


  const navigate = useNavigate()
  const [searchInput,setSearchInput] = useState('')
  const [loading,setLoading] = useState(false)
  const [searchUser,setSearchUser] = useState([])
  const [chatUser,setChatUser] = useState([])
  const [selectedUserId,setSelectedUserId] = useState(null)
  const {authUser,setAuthUser} = useAuth()
  const {messages , setMessage, selectedConversation ,  setSelectedConversation} = userConversation();
  const {onlineUsers,socket} = useSocketContext()
  const [newMessageUsers,setNewMessageUsers] = useState('')
  const [unreadCounts, setUnreadCounts] = useState({});


// clear unread count for active conversation
   useEffect(() => {
  if (selectedConversation?._id) {
    setUnreadCounts((prev) => {
      const updated = { ...prev };
      delete updated[selectedConversation._id];
      return updated;
    });
  }
}, [selectedConversation]);

// listen for new messages like shows number badge
// ORIGINAL CODE
   useEffect(()=>{
      socket?.on("newMessage",(newMessage)=>{
        setNewMessageUsers(newMessage)
        if (newMessage.receiverId?.toString() === authUser?._id?.toString()) {
          if (newMessage.senderId?.toString() !== selectedConversation?._id?.toString()){
            setUnreadCounts((prev) => ({...prev,
            [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
      }))}}
      })
      return()=> socket?.off("newMessage");
    },[socket,messages,authUser?._id,selectedConversation?._id])

// useEffect(() => {
//   if (!socket) return;

//   const handleNewMessage = (newMessage) => {
//     // only for me
//     if (newMessage.receiverId?.toString() !== authUser?._id?.toString()) return;
//     // unread count
//     if (newMessage.senderId?.toString() !== selectedConversation?._id?.toString()) {
//       setUnreadCounts((prev) => ({...prev, [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,}));
//     }
//   };
//   socket.on("newMessage", handleNewMessage);
//   return () => {
//     socket.off("newMessage", handleNewMessage);
//   };
// }, [socket, authUser?._id, selectedConversation?._id]);

 //fetch/show user with u chatted
  useEffect(()=>{
    const chatUserHandler = async()=>{
      setLoading(true)
      try {
        const chatter = await api.get("/api/user/currentchatters")
        const data = chatter.data;
        if (data.success === false) {
        setLoading(false)
        console.log(data.message)
      }
      setLoading(false)
      setChatUser(data)

      } catch (error) {
      setLoading(false)
      }

    }
    chatUserHandler()
  },[])

// show user from search result (search handler)
  const handleSearchSubmit=async(e)=>{
    e.preventDefault()
    setLoading(true)
    try {
      const search = await api.get(`/api/user/search?search=${searchInput}`)
      const data = search.data;
      if (data.success === false) {
        setLoading(false)
        console.log(data.message)
      }
      setLoading(false)
      if (data.length === 0) {
        toast.info("User not found")
      }
      else{
        setSearchUser(data)
      }

    } catch (error) {
      setLoading(false)
      console.log(error);
      
    }
  }

   //Logout
  const handleLogout = async()=>{
    setLoading(true)
    try {
      const logout = await api.post("/api/auth/logout")
      const data  = logout.data;
      if (data.success === false) {
        setLoading(false)
        console.log(data.message)
      }
      toast.info(data.message)
      localStorage.removeItem('FlowChat')
      setAuthUser(null)
      setLoading(false)
      navigate('/login')

    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

//show which user is selected (user click)
const handleUserClick = (user)=>{
  onSelectUser(user);
  setSelectedConversation(user);
  setSelectedUserId(user._id);
  setNewMessageUsers('')
  setUnreadCounts((prev) => {
    const updated = { ...prev };
    delete updated[user._id];
    return updated;
})
}

// back from search result 
const handleSearchBack = () => {
 setSearchUser([]);
 setSearchInput('')
}

  return (
    <div className= {` h-screen md:h-full w-full md:w-[320px] lg:w-[360px] p-5 rounded overflow-y-auto text-white `}>
      <div className='pb-5'>
        <div className='flex justify-between items-center'>
          <img src="/favicon.png" alt="favicon" className='h-8 sm:h-10 w-auto object-contain' />
          <div className='relative py-2 group'>
            <EllipsisVerticalIcon className="h-6 w-6 text-white" />
            <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block'>
              <p onClick={() => navigate(`/profile/${authUser?._id}`)} className='cursor-pointer text-sm hover:text-blue-400'>Profile</p>
              <hr className='my-2 border-t border-gray-500'/>
              <p onClick={handleLogout} className='cursor-pointer text-sm hover:text-red-400'>Logout</p>
          </div>
        </div>
          {/* <img onClick={`${authUser?._id}`} src={authUser?.profilepic} className='self-center h-12 w-12 hover:scale-110 cursor-pointer' /> */}
        </div>
        {/* bg-cyan-700 */}
        <form onSubmit={handleSearchSubmit} className='flex items-center  border border-[#3B82F6]/25 backdrop-blur-md focus-within:ring-2 focus-within:ring-[#8B5CF6]/10 rounded-full gap-2 py-2.5 px-4 mt-5'>
          <MagnifyingGlassIcon className="w-4 h-4 text-white" />
          <input 
          value={searchInput}
          type="text"
          onChange={(e)=> setSearchInput(e.target.value)}
          className='bg-transparent border-none outline-none text-white text-xs placeholder:text-white flex-1' placeholder='Search User...' />
        </form>
      </div>
      <div className='divider px-3'></div>

      {/* for users section */}
      {searchUser ?. length > 0? (
        <>
          <div className='min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar'>
            <div className='w-auto'>
              {searchUser.map((user,index)=>(
                <div key={user._id}>
                  <div onClick={()=> handleUserClick (user)} className={`flex gap-3 items-center rounded-lg p-2 cursor-pointer hover:bg-sky-600 transition ${selectedUserId === user?._id ? 'bg-sky-500' : ''}`}>
                    <div className="relative">
                      <img src={user.profilepic} alt="user" className="w-12 h-12 rounded-full object-cover"/>
                      {onlineUsers.includes(user._id.toString()) && (
                        <span className="absolute bottom-1 right-1 block w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>)}
                        </div>
                <div className='flex flex-col flex-1'>
                  <p className='font-semibold text-white truncate max-w-[160px] sm:max-w-[200px]'>{user.username}</p>
                </div>
              </div>
              </div>
            ))}
            </div> 
          </div>
          <div className='mt-auto px-1 py-3 flex '>
          <button onClick={handleSearchBack} className='bg-cyan-600 hover:bg-gray-600 rounded-full p-2'><ArrowLeftIcon className="w-5 h-5 text-white"/></button>
          </div>
        </>
      ) : (
      <>
        <div className='h-[calc(100vh-200px)] md:h-[calc(100%-180px)] m overflow-y-auto scrollbar'>
        <div className='w-auto'>
          {chatUser.length === 0 ?(
            <>
            <div className='flex flex-col items-center text-xl text-slate-300'>
              <h1>Search username to chat</h1>
            </div>
            </>
          ):(<>
          {chatUser.map((user,index) =>(
            <div key={user._id}>
              <div onClick={()=> handleUserClick (user)} className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer transition-all duration-200 hover:bg-cyan-600/40 transition ${selectedUserId === user?._id ? 'bg-cyan-600/80' : ""}`}>

                {/* // Socket is online */}
                 <div className="relative">
                      <img src={user.profilepic} alt="user" className="w-12 h-12 rounded-full object-cover transition-transform duration-150 active:scale-95"/>
                      {onlineUsers.includes(user._id.toString()) && (
                        <span className="absolute bottom-1 right-1 block w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>)}
                        </div>
                <div className='flex flex-col flex-1'>
                 <p className='font-semibold text-white truncate max-w-[160px] sm:max-w-[200px]'>{user.username}</p>
                </div>
                <div>
                  {unreadCounts[user._id] ? (
                    <div className="min-w-[20px] h-[20px] flex items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white animate-pulse">{unreadCounts[user._id]}
                    </div>) : null}
                    </div>
              </div>
            </div>
          )
          )}
        </>
      )}
          </div>
        </div>
        </>
      )}
    </div>
  )
}

export default Sidebar