
import React from "react"
import {Routes as Switch, Route} from 'react-router-dom'
import OrderEntry from "./Components/OrderEntry"
// import Orders from "./Components/Orders"
import Navbar from "./Components/Navbar"
import './App.css';
function App() {

  return (
    <div>
    <Navbar />
    <Switch>
      <Route exact path="/" element={<OrderEntry />}></Route>
      {/* <Route  path="/orders-mercadolibre" element={<Orders />}></Route> */}
    </Switch>
    </div>
  )

}

export default App;
