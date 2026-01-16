import Sidebar from '../components/Sidebar'
import Rightsidebar from '../components/Rightsidebar'
import { useState } from 'react'
import MessageContainer from '../components/MessageContainer'



const Home = () => {

  const [selectedUser,setSelectedUser] = useState(null)
  const [isSidebarVisible,setIsSidebarVisible] = useState(true)

  
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsSidebarVisible(false);
  }
  const handleShowSidebar = () => {
    setIsSidebarVisible(true);
    setSelectedUser(null);
  }
  
  
  return (

    //WORKING CODE NEED TO BE CORRECTED

    // <div className='border-2 rounded-2xl border-gray-600 backdrop-blur-xl overflow-hidden flex min-w-full
    //  md:min-w-[550px] md:max-w-[65%] h-[95%] md:h-full  shadow-lg bg-clip-padding  bg-opacity-0'>
    //     <div className={`w-full md:flex ${isSidebarVisible ? '' : 'hidden'}`}>
    //   <Sidebar onSelectUser={handleUserSelect}/>
    //   </div>
    //   <div className={`divider divider-horizontal px-3 md:flex
    //      ${isSidebarVisible ? '' : 'hidden'} ${selectedUser ? 'block' : 'hidden'}`}></div>
    //   <div className={`flex-auto ${selectedUser ? '' : 'hidden md:flex'} `}>
    //   <MessageContainer onBackUser={handleShowSidebar}/>
    //   </div>
    // </div>
  <div className="w-screen h-screen flex items-center justify-center ">
      <div className="border-2 border-gray-600 rounded-2xl backdrop-blur-xl overflow-hidden flex w-full md:max-w-[70%] h-full md:h-[90%]">
        {/* Sidebar */}
        <div className={`w-full md:w-[35%] ${isSidebarVisible ? 'flex' : 'hidden md:flex'}`}><Sidebar onSelectUser={handleUserSelect} />
        </div>

        {/* Divider (only desktop) */}
        <div className={`hidden md:block w-[1px] bg-gray-600 ${selectedUser ? 'block' : 'hidden'}`}/>

        {/* Chat Area */}
        <div className={`flex-1 ${selectedUser ? 'flex' : 'hidden md:flex'}`}><MessageContainer onBackUser={handleShowSidebar} />
        </div>
      </div>
    </div>
  )
}

export default Home
