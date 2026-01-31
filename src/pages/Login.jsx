import api from "../utils/axios";
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";


const Login = () => {

  const {setAuthUser} = useAuth()
  const navigate = useNavigate()
  const [userInput, setUserInput] = useState({});
  const [loading, setLoading] = useState(false);


  const handleInput = (e)=>{
    setUserInput ({
      ...userInput,[e.target.id]: e.target.value
  })
}
console.log(userInput);

  const handleSubmit = async(e)=>{
    e.preventDefault();
    setLoading(true)
    try {
      const login = await api.post("/api/auth/login", userInput)
        const data = login.data;
        console.log("Login response:", data);

            if (data.success === false) {
                setLoading(false)
                toast.error(data.message);
            }
            toast.success(data.message);
            localStorage.setItem('FlowChat',JSON.stringify(data))
            setAuthUser(data)
            setLoading(false)
            navigate('/')
    } catch (error) {
      setLoading(false)
      console.log(error)
      toast.error(error?.response?.data?.message)
    }
}


  return (
  <div className='bg-[#818582]/10 flex flex-col justify-center items-center w-full h-screen sm:px-[37%] sm:py-[10%]'>
    <div className=' w-full p-6 rounded-lg shadow-lg border-2 border-gray-400 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 '>
      <h1 className='text-3xl font-bold text-center text-white'>Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col mt-5">
        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Email</label>
          <input type="email" id="email" onChange={handleInput} className="border border-gray-300 text-white text-sm rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-900 block w-full p-2 placeholder-white outline-none " placeholder="Enter you email" required />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 text-sm font-medium  text-white">Password</label>
            <input type="password" id="password" onChange={handleInput} className="border border-gray-300 text-white text-sm rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-900 block w-full p-2 placeholder-white outline-none " placeholder="Enter you password" required />
            </div>
            {/* // original */}
              {/* <button type="submit" className="bg-indigo-500 hover:bg-fuchsia-500 ... text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{loading? "Loading..." : "Login"}</button> */}
            <button type="submit" className=" bg-cyan-700 hover:bg-cyan-900 text-white font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center focus:outline-none focus:ring-4 focus:ring-teal-400">{loading? "Loading..." : "Login"}</button>
            </form>
            <div className='pt-5'>
              <p className='text-white'>Don't have an account? <Link to={'/register'}><span className='font-bold underline cursor-pointer text-cyan-500 hover:text-cyan-800'> Register Now!</span></Link></p>
              </div>
    </div>
  </div>
  
  )
}

export default Login
