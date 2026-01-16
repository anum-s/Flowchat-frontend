import {ArrowLeftIcon,PaperAirplaneIcon} from '@heroicons/react/24/outline'
import userConversation from '../zustand/UseConversation';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState, useRef} from 'react';
import axios from 'axios';
import { useSocketContext } from '../context/SocketContext';
import fbNotify from '../assets/sound/Facebook-Notification.mp3'


const MessageContainer = ({onBackUser}) => {
    const {messages , setMessages, selectedConversation ,  setSelectedConversation} = userConversation();
    const {authUser} = useAuth();
    const [loading,setLoading] = useState(false)
    const [sending,setSending] = useState(false)
    const [sendData,setSendData] = useState("")
    const lastMessageRef = useRef()
    const {socket} = useSocketContext()

// CHAT GPT CODE
// useEffect(() => {
//   if (!socket) return;

//   const handleNewMessage = (newMessage) => {
//     // play sound only for incoming messages
//     if (newMessage.senderId !== authUser._id) {
//       const sound = new Audio(fbNotify);
//       sound.play();
//     }

//     // safe update
//     setMessages((prev) => [...prev, newMessage]);
//   };

//   socket.on("newMessage", handleNewMessage);

//   return () => {
//     socket.off("newMessage", handleNewMessage);
//   };
// }, [socket, authUser._id, setMessages]);


    useEffect(()=>{
      if (!socket) return;
      socket?.on("newMessage",(newMessage)=>{
        setMessages([...messages,newMessage])
        const sound = new Audio(fbNotify);
        sound.play()
      })
      return()=> socket?.off("newMessage");
    },[socket,setMessages,messages])

    useEffect(()=>{
      setTimeout(()=>{
        lastMessageRef?.current?.scrollIntoView({behavior:"smooth"})
      },100)
    },[messages])

    useEffect(()=>{
      const getMessages = async()=>{
        setLoading(true);
        try {
          const get = await axios.get(`/api/message/${selectedConversation?._id}`);
          const data =  await get.data
          if(data.success === false){
            setLoading(false);
            console.log(data.message)
          }
          setLoading(false);
          setMessages(data)
          
        } catch (error) {
          setLoading(false)
          console.log(error)
        }
      }
    if(selectedConversation?._id) getMessages();
  },[selectedConversation?._id,setMessages])
console.log(messages)

const handleMessage=async(e)=>{
  setSendData(e.target.value)
}

const handleSubmit=async(e)=>{
  e.preventDefault();
  setSending(true);
  try {
    const res = await axios.post(`/api/message/send/${selectedConversation?._id}`,{message:sendData});
    const data =  await res.data
    if(data.success === false){
      setSending(false);
      console.log(data.message);
      return;
    }
    setSending(false);
    setSendData('');
    setMessages([...messages, data]);

  } catch (error) {
    setSending(false)
    console.log(error)
  }
}

  return (
    <div className=" md:min-w-[500px] h-full w-full flex flex-col">
      {selectedConversation === null ?(
        <div className="flex items-center justify-center w-full h-full px-4">
          <div className="text-center flex flex-col items-center gap-2 font-semibold">
            <p className="text-3xl sm:text-4xl text-white">Welcome {authUser.username}</p>
            <p className="text-lg sm:text-xl text-white">Select a chat to start messaging</p>
            <div className='flex flex-col items-center justify-center mt-4'>
              <img src="/Logo (2).png" alt="Flow Chat Logo" className='w-40 sm:w-80 h-auto'/>
              <span className='text-xl sm:text-2xl text-white tracking-wide mt-2'>Flow Chat</span>
            </div>
          </div>
           </div>
      ):(<>
      <div className='flex justify-between gap-1 bg-cyan-700 md:px-2 h-10 md:h-12'>
      <div className='flex gap-2 md:justify-between items-center w-full'>
      <div className='md:hidden ml-1 self-center p-2 sm:p-3'>
        <button onClick={()=>{onBackUser(true); setSelectedConversation(null)}} className='rounded-full px-2 py-1 self-center '><ArrowLeftIcon className="w-5 h-5 text-white "/></button>
        </div>
      <div className='flex justify-between mr-2 gap-2'>
      <div className='self-center'>
        <img className='rounded-full w-8 h-8 md:w-10 md:h-10 cursor-pointer transition-transform duration-150 active:scale-95' src={selectedConversation?.profilepic} alt="user avatar" />
      </div>
      <span className='text-white self-center text-sm md:text-base font-semibold'>{selectedConversation?.username}</span>
      </div> 
      </div>
      </div>
      <div className='flex-1 overflow-auto px-4 py-2 space-y-2 scroll-smooth sm:px-6 md:px-8'>

      {loading && (
        <div className='flex h-full items-center justify-center'>
          <div className='loading loading-spinner'></div>
          </div> 
      )}
      {!loading && messages?.length === 0 && (
        <p className='text-center text-white '>Send a Message</p>
      )}
      {!loading && messages?.length > 0 && messages.map((message, i)=>{

        // console.log("authUser._id:", authUser._id, "senderId:", message.senderId);
        // console.log("Equal?", message.senderId === authUser._id);

        const msgDate = new Date(message?.createdAt).toLocaleDateString("en-PK", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

        const prevMsgDate = i > 0 ?
        new Date(messages[i - 1]?.createdAt).toLocaleDateString("en-PK", {
          day: "numeric",
          month: "short",
          year: "numeric",
          })
          : null;
          return (
          <div key={message?._id || i} ref={lastMessageRef}>
          {/* Date separator */}
            {msgDate !== prevMsgDate && (
              <div className="flex justify-center my-2">
                <span className="text-xs text-gray-700 bg-gray-200 px-3 py-1 rounded-full md:text-sm">{msgDate}</span>
                </div>
              )}

          {/* Chat bubble */}
              <div className={`flex items-end ${message.senderId === authUser._id ? "justify-end" : "justify-start"} mb-2`}>
                {message.senderId !== authUser._id && (
                  <img src={selectedConversation?.profilepic} alt="avatar" className="w-8 h-8 rounded-full mr-2"/>
                  )}

              <div className={`max-w-[85%] sm:max-w-[70%] px-3 py-2 rounded-2xl text-sm shadow transition-all duration-200 ${message.senderId === authUser._id ? "bg-cyan-600 text-white rounded-br-none": "bg-gray-200 text-gray-900 rounded-bl-none"}`}>
                {message?.message}
                <div className="text-[10px]sm:text-xs text-gray-400 mt-1 text-right">
                  {new Date(message?.createdAt).toLocaleTimeString("en-PK", {hour: "2-digit",minute: "2-digit",})}
                  </div>
              </div>

              {message.senderId === authUser._id && (
                <img src={authUser?.profilepic} alt="me"
                className="w-8 h-8 rounded-full ml-2"/>)}
                </div>
              </div>
              );
              })}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="rounded-full text-white">
            <div className='w-full flex items-center bg-white'>
              <input onChange={handleMessage} type="text" value={sendData} required id='message' placeholder='Type a message...' className='w-full bg-transparent outline-none px-4 rounded-full text-black'/>
              <button type='submit'>
                {sending ? <div className='loading loading-spinner'></div>
                  : <PaperAirplaneIcon size={25} className='text-cyan-700 cursor-pointer rounded-full w-10 h-auto p-1' />}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}

export default MessageContainer;



//           original code
//         <div className='text-white mb-2' key={message?._id} ref={lastMessageRef}>
//           <div className={`flex items-end ${message.senderId === authUser._id ? "justify-end" : "justify-start"}`}> 
//           {message.senderId !== authUser._id && (
//           <img
//             src={selectedConversation?.profilepic}
//             alt="avatar"
//             className="w-8 h-8 rounded-full mr-2"
//           />
//         )}
//           {/* <div className='chat-image avatar w-6 h-6'> */}
//           {/* <img src={message.senderId === authUser._id ? authUser.profilepic : selectedConversation?.profilepic} /> */}
//           {/* </div> */}
//           <div className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm shadow ${message.senderId === authUser._id ? "bg-sky-600 text-white rounded-br-none" : "bg-gray-400 rounded-bl-none"}`}>{message?.message}
//         </div>
//         <div className='chat-footer text-[10px] opacity-80'>
//           {/* {new Date(message?.createdAt).toLocaleDateString('en-Pk')}  */}
//           {new Date(message?.createdAt).toLocaleTimeString('en-Pk',{hour:'numeric',minute:'numeric'})} 
//           </div>
//         </div>
//       </div>
//     ))}
//     </div>
//     <form onSubmit={handleSubmit} className="rounded-full text-white">
//       <div className='w-full rounded-full flex items-center justify-between bg-white'>
//         <input onChange={handleMessage} type="text" value={sendData} required id='message' className='w-full bg-transparent outline-none px-4 rounded-full text-black' />
//         <button type='submit'>
//             {sending? <div className='loading loading-spinner'></div>: <PaperAirplaneIcon size={25} className='text-sky-700 cursor-pointer rounded-full w-10 h-auto p-1'/>}
//             </button>
//       </div>
//     </form>
//       </>
//       )}
//   </div>
//   )
// }

// export default MessageContainer
