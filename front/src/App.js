
import React from "react"
import {Routes as Switch, Route} from 'react-router-dom'
import OrderEntry from "./Components/OrderEntry"
// import Orders from "./Components/Orders"
import AsusOrders from "./Components/AsusOrders"
import Navbar from "./Components/Navbar"

import './App.css';
import GoproOrders from "./Components/GoProOrders"
import LinioOrders from "./Components/LinioOrders"
import GoProCheckOrder from './Components/GoProCheckOrder'
function App() {
  return (
    <div>
    <Navbar />
    
    <Switch>
      <Route 
// @ts-ignore
      exact path="/" element={<OrderEntry />}></Route>
      {/* <Route  path="/orders-mercadolibre" element={<Orders />}></Route> */}
      <Route  path="/orders-asus" element={<AsusOrders />}></Route>
      <Route  
// @ts-ignore
      exact path="/orders-gopro" element={<GoproOrders />}></Route>
      <Route  path="/orders-linio" element={<LinioOrders />}></Route>
      <Route  path="/orders-gopro-check" element={<GoProCheckOrder />}></Route>
    </Switch>
    </div>
  )

}

export default App;
