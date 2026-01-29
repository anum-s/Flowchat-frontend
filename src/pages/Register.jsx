import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from '../context/AuthContext';


const Register = () => {

  const {setAuthUser} = useAuth()

  const navigate = useNavigate()
  const [inputData, setInputData] = useState({});
  const [loading, setLoading] = useState(false);


  const handleInput = (e)=>{
    setInputData ({
      ...inputData,[e.target.id]: e.target.value
  })}
console.log(inputData);

  const selectGender = (selectGender)=>{
    setInputData((prev) => ({ ...prev, gender:selectGender === inputData.gender? '' : selectGender }));
    }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    setLoading(true)
    if (inputData.password !== inputData.confirmpassword.toLowerCase()){
        setLoading(false)
        return toast.error("Password doesn't match")
    }
    try {
      const register = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, inputData)
        const data = register.data;
            if (data.success === false) {
                setLoading(false)
                toast.error(data.message)
                console.log(data.message);
            }
            toast.success(data.User?.message);
            // toast.success(data.message || "Registered successfully!")
            localStorage.setItem('FlowChat',JSON.stringify(data))
            setAuthUser (data)
            setLoading(false)
            navigate("/login")
        
    } catch (error) {
        setLoading(false)
        console.log(error)
        toast.error(error?.response?.data?.message)
    }
  }

  // original form class
        // <div className="mb-5">
        //   <input type="text" id="username" onChange={handleInput} className="border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Username" required />
        //   </div>

return (
<div className="flex w-full min-h-screen px-8">
  <div className="hidden md:flex flex-col w-1/2 items-center justify-center ">
  <div className="flex flex-col items-center gap-3">
    <img src="/Logo (2).png" alt="logo" className="w-90" /><span className="mt-1 text-5xl uppercase font-bold tracking-wide text-white">Flow Chat</span>
    </div>
    </div>
  <div className=' flex flex-col justify-center items-center w-full md:w-1/2 '>
  <div className="w-full max-w-md p-6 rounded-2xl shadow-lg border-2 border-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
      <h1 className='text-3xl font-bold text-center text-white'>Register</h1>
      <form onSubmit={handleSubmit} className="flex flex-col ">
        <div className="mt-5 mb-5">
          <input type="text" id="fullname" onChange={handleInput} className=" border border-gray-300 text-white text-sm rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-900 block w-full p-2 placeholder-white outline-none "placeholder="Full Name" required />
          </div>
        <div className="mb-5">
          <input type="text" id="username" onChange={handleInput} className="border border-gray-300 text-white text-sm rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-900 block w-full p-2 placeholder-white outline-none " placeholder="Username" required />
          </div>
        <div className="mb-5">
          <input type="email" id="email" onChange={handleInput} className="border border-gray-300 text-white text-sm rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-900 block w-full p-2 placeholder-white outline-none " placeholder="Email" required />
          </div>
        <div className="mb-5">
          <input type="password" id="password" onChange={handleInput} className="border border-gray-300 text-white text-sm rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-900 block w-full p-2 placeholder-white outline-none " placeholder="Password" required />
          </div>
          <div className="mb-5">
            <input type="password" id="confirmpassword" onChange={handleInput} className="border border-gray-300 text-white text-sm rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-900 block w-full p-2 placeholder-white outline-none " placeholder="Confirm your password" required />
            </div>
            <div className="flex justify-around mb-5">
              <div className="flex items-center h-5">
                <input onChange={()=>selectGender('male')} checked= {inputData.gender === 'male'} id="gender" type="radio" value="" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-cyan-400 dark:focus:ring-cyan-900"  />
                <label htmlFor="gender" className="ms-2 text-sm font-medium text-white">Male</label>
                </div>
                <div className="flex items-center h-5">
                <input onChange={()=>selectGender('female')} checked= {inputData.gender === 'female'} id="gender" type="radio" value="" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-cyan-400 dark:focus:ring-cyan-900"  />
                <label htmlFor="gender" className="ms-2 text-sm font-medium text-white">Female</label>
                </div>
                </div>
            <button type="submit" className="bg-cyan-700 hover:bg-cyan-900 text-white font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center focus:outline-none focus:ring-4 focus:ring-teal-400">{loading? "Loading..." : "Register"}</button>
            </form>
            <div className='pt-5'>
                <p className='text-white'>Have an account? <Link to={'/login'}><span className='text-cyan-500 font-bold underline cursor-pointer hover:text-cyan-800'> Login </span></Link></p>
            </div>
    </div>
  </div>
  </div>
  )
}

export default Register
