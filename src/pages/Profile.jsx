import { useAuth } from '../context/AuthContext';


const Profile = () => {

  // const {authUser,setAuthUser} = useAuth()


  return (
    <div>
      <h1>profile wala page</h1>
              {/* for profile img section */}
        {/* <img onClick={`${authUser?._id}`} src={authUser?.profilepic} className='self-center h-12 w-12 hover:scale-110 cursor-pointer' /> */}
    </div>
  )
}

export default Profile
