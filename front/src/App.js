
import React from "react"
import {Routes as Switch, Route} from 'react-router-dom'
import OrderEntry from "./Components/OrderEntry"
import Orders from "./Components/Orders"
import AsusOrders from "./Components/AsusOrders"
import Navbar from "./Components/Navbar"

import './App.css';
function App() {
  return (
    <div>
    <Navbar />
    
    <Switch>
      <Route 
// @ts-ignore
      exact path="/" element={<OrderEntry />}></Route>
      <Route  path="/orders-mercadolibre" element={<Orders />}></Route>
      <Route  path="/orders-asus" element={<AsusOrders />}></Route>
    </Switch>
    </div>
  )

}

export default App;
