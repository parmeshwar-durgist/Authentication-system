import axios from 'axios'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  axios.defaults.withCredentials = true;
  const handleLogout = () => {
    axios.get('http://localhost:3000/auth/logout')
    .then((res) => {
      if(res.data.status){
        navigate('/login')
      }
    }).catch(err => {
      console.log(err)
    })
  }
  return (
    <div>
        <Link to="/dashboard"><button> Dashboard</button></Link> <br/><br/>
        <button onClick={handleLogout}> Logout </button>
    </div>
  )
}

export default Home
