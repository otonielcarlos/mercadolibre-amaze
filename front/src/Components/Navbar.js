import React from 'react'
import {Link} from 'react-router-dom'
import './Navbar.css'

function Navbar(){
  return (
  <header className="topnav">
    <Link to="/">Order Entry</Link>
    {/* <Link to="/orders-mercadolibre">Mercadolibre Orders</Link> */}

  </header>

  )
}

export default Navbar