import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {getTodayAndYesterday} from '../utils/utils'
// @ts-ignore
const Context = React.createContext()

function ContextProvider({children}){
  // const [orders, setOrders] = useState([])
  const [asusOrders, setAsusOrders] = useState([])
  const [goproOrders, setGoproOrders] = useState([])
  const [rangeDate, setRangeDate] = useState({})
  const [linioOrders, setLinioOrders] = useState([])

  
  useEffect(() => {
    const {today, yesterday} = getTodayAndYesterday()
    async function getGoproOrdersWithDates(yesterday, today) {
      const url = `https://appleamaze.herokuapp.com/pe/v1/orders/gopro/all/${yesterday}/${today}`
      const goproOrders = await axios.get(url)
      setGoproOrders(() => goproOrders.data)

    }

    async function getAsusOrdersWithDates(today, yesterday){
      const asusOrders = await axios.get(`https://appleamaze.herokuapp.com/pe/v1/orders/asus/all/${yesterday}/${today}`)
      setAsusOrders(() => asusOrders.data)
    }

    async function getLinioOrdersWithDates(yesterday, today){
      const orders = await axios.get(`https://appleamaze.herokuapp.com/pe/v1/orders/linio/all/${yesterday}/${today}`)
      setLinioOrders(() => orders.data)
    }
    getGoproOrdersWithDates(yesterday, today)
    getAsusOrdersWithDates(today, yesterday)
    getLinioOrdersWithDates(yesterday, today)
  },[])



  async function setDateForSearch(marca) {
    if(marca === "asus") {
    setAsusOrders(() => [])
    // @ts-ignore
    const {from, to} = rangeDate
    // const asusOrders = await axios.get(`https://appleamaze.herokuapp.com/pe/v1/orders/${marca}/all/${from}/${to}`)
    const asusOrders = await axios.get(`https://appleamaze.herokuapp.com/pe/v1/orders/${marca}/all/${from}/${to}`)
    setAsusOrders(() => asusOrders.data)
  } else if(marca === "gopro") {
      setGoproOrders(() => [])
      // @ts-ignore
      const {from, to} = rangeDate
      const goproOrders = await axios.get(`https://appleamaze.herokuapp.com/pe/v1/orders/${marca}/all/${from}/${to}`)
      setGoproOrders(() => goproOrders.data)

    } else if(marca === "linio") {
      setLinioOrders(() => [])
// @ts-ignore
      const {from, to} = rangeDate
      const orders = await axios.get(`https://appleamaze.herokuapp.com/pe/v1/orders/${marca}/all/${from}/${to}`)
      setLinioOrders(() => orders.data)
    }
  }


  function onChangeDate(e){
    console.log(`${e.target.name}: ${e.target.value}`)
    setRangeDate({
      ...rangeDate,
      [e.target.name]: e.target.value
    })
  }

  return(
    <Context.Provider value={{
      // orders, 
      asusOrders, 
      onChangeDate, 
      setDateForSearch, 
      rangeDate,
      goproOrders,
      linioOrders
      }}>
      {children}
    </Context.Provider>
  ) 


}

export {ContextProvider, Context}