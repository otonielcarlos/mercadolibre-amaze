import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {getTodayAndYesterday} from '../utils/utils'
// @ts-ignore
const Context = React.createContext()

function ContextProvider({children}){
  const [orders, setOrders] = useState([])
  const [asusOrders, setAsusOrders] = useState([])
  const [rangeDate, setRangeDate] = useState({})

  
  useEffect(() => {
    const {today, yesterday} = getTodayAndYesterday()
    async function getAsusOrdersWithDates(today, yesterday){
      
      const newOrders = await axios.get('https://appleamaze.herokuapp.com/pe/v1/orders/mercadolibre/apple/all')
      const asusOrders = await axios.get(`https://appleamaze.herokuapp.com/pe/v1/orders/asus/all/${yesterday}/${today}`)
      // const asusOrders = await axios.get(`https://appleamaze.herokuapp.com/pe/v1/orders/asus/all?from=${yesterday}`)
      // @ts-ignore
      setOrders(() => newOrders.data)
      setAsusOrders(() => asusOrders.data)
    }
    getAsusOrdersWithDates(today, yesterday)
  },[])

  async function setDateForSearch() {
    setAsusOrders(() => [])
    // @ts-ignore
    const {from, to} = rangeDate
    const asusOrders = await axios.get(`http://localhost:4000/pe/v1/orders/asus/all/${from}/${to}`)
    setAsusOrders(() => asusOrders.data)
  }


  function onChangeDate(e){
    console.log(`${e.target.name}: ${e.target.value}`)
    setRangeDate({
      ...rangeDate,
      [e.target.name]: e.target.value
    })
  }

  return(
    <Context.Provider value={{orders, asusOrders, onChangeDate, setDateForSearch, rangeDate}}>
      {children}
    </Context.Provider>
  ) 


}

export {ContextProvider, Context}