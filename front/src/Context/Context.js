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

  
  useEffect(() => {
    const {today, yesterday} = getTodayAndYesterday()
    async function getGoproOrdersWithDates(yesterday, today) {
      const url = `http://localhost:4000/pe/v1/orders/gopro/all/${yesterday}/${today}`
      console.log(url)
      const goproOrders = await axios.get(url)
      console.log(goproOrders.data)
      setGoproOrders(() => goproOrders.data)

    }
    async function getAsusOrdersWithDates(today, yesterday){
      
      const asusOrders = await axios.get(`https://appleamaze.herokuapp.com/pe/v1/orders/asus/all/${yesterday}/${today}`)

      setAsusOrders(() => asusOrders.data)
    }
    getGoproOrdersWithDates(yesterday, today)
    getAsusOrdersWithDates(today, yesterday)
  },[])

  async function setDateForSearch() {
    setAsusOrders(() => [])
    // @ts-ignore
    const {from, to} = rangeDate
    const asusOrders = await axios.get(`https://appleamaze.herokuapp.com/pe/v1/orders/asus/all/${from}/${to}`)
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
    <Context.Provider value={{
      // orders, 
      asusOrders, 
      onChangeDate, 
      setDateForSearch, 
      rangeDate,
      goproOrders
      }}>
      {children}
    </Context.Provider>
  ) 


}

export {ContextProvider, Context}