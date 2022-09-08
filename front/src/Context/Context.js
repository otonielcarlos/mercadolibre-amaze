import React, {useState, useEffect} from 'react'
import axios from 'axios'

// @ts-ignore
const Context = React.createContext()

function ContextProvider({children}){
  const [orders, setOrders] = useState([])
  const [asusOrders, setAsusOrders] = useState([])
  useEffect(() => {
    async function getOrders(){
      const newOrders = await axios.get('https://appleamaze.herokuapp.com/pe/v1/orders/mercadolibre/apple/all')
      const asusOrders = await axios.get('https://appleamaze.herokuapp.com/pe/v1/orders/asus/all')
      // @ts-ignore
      setOrders(() => newOrders.data)
      setAsusOrders(() => asusOrders.data)
    }
    getOrders()
  },[])

  return(
    <Context.Provider value={{orders, asusOrders}}>
      {children}
    </Context.Provider>
  ) 


}

export {ContextProvider, Context}