import {Route, Routes} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Register from './pages/Register';
import { VerifyUser } from './utils/VerifyUser';


const App = () => {
  return (
    <div className="p-2 w-screen h-screen flex items-center justify-center">
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route element = {<VerifyUser/>}>
        <Route path='/' element={<Home/>}/>
        </Route>
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App

