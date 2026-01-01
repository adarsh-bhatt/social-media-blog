import { useState,useEffect } from "react"
import {useDispatch} from 'react-redux'
import { login,logout } from "./store/authSlice"
import authService from "./conf/APPWRITE/auth"

import {Footer, Header} from './component'
import { Outlet } from "react-router-dom"

function App() {

const [loading, setLoading] = useState(false)
const dispatch = useDispatch()

useEffect(() => {
  
authService.getCurrentUser()
.then((userData)=>{
if (userData) {
  dispatch(login(userData))
}  else {
  dispatch(logout())
}

}).catch((e)=>{
  console.log(e.message  , 'error message')
  setLoading()
})

}, [])


  return ! loading ? (
   <div  className="min-h-screen flex flex-wrap content-between  bg-gray-500"><div className="w-full block">
<Header/>
<main>


   <Outlet />
        </main>

<Footer/>

   </div>
   
   
   </div>
  ) : null
}

export default App
