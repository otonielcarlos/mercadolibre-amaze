import React, {useState, useEffect} from 'react'
import axios from 'axios'

// @ts-ignore
const Context = React.createContext()

function ContextProvider({children}){
  const [orders, setOrders] = useState([])

  useEffect(() => {
    async function getOrders(){
      const newOrders = await axios.get('http://localhost:4000/mercadolibre')
      // @ts-ignore
      setOrders(() => newOrders.data)
    }
    getOrders()
  },[])

  return(
    <Context.Provider value={{orders}}>
      {children}
    </Context.Provider>
  ) 


}

export {ContextProvider, Context}