import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './Orders.css'


function Orders(){

  const [orders, setOrders] = useState([])


  const saveDate = new Date()
  saveDate.setHours(saveDate.getHours() - 5)
  let today = saveDate.toISOString().split('T')[0]
  const date = new Date()
  date.setHours(date.getHours() - 5)
  let previous = new Date(date.getTime())
  previous.setDate(date.getDate() - 1)
  const yesterday = previous.toISOString().split('T')[0]

  useEffect(() => {
    async function getOrders(){
      const newOrders = await axios.get('https://appleamaze.herokuapp.com/mercadolibre')
      // @ts-ignore
      setOrders(() => newOrders.data)
    }

    getOrders()
  })

const displayOrders = orders.map((order, key) => {
  return (
    <tr key={key}>
      <td>{order.nv}</td>
      <td>{order.customerpo}</td>
      <td>{order.name}</td>
      <td>{order.address}</td>
      <td>{order.sku}</td>
      <td>{order.model}</td>
      <td>{order.description}</td>
      <td>{order.price}</td>
      <td>{order.quantity}</td>
    </tr>
  )
})
  return(
  <div className='orders'>
  <h3>Ordenes del {yesterday} 1:00pm PE al {today} 12:59pm PE *** DEMO EN DESARROLLO***</h3>
  <table>
    <tbody>
      <tr>
        <th>Nota de Venta</th>
        <th>OC</th>
        <th>Nombre</th>
        <th>Dirección</th>
        <th>Sku</th>
        <th>Modelo</th>
        <th>Descripcion</th>
        <th>Precio</th>
        <th>Cantidad</th>
      </tr>
      {displayOrders}
    </tbody>
  </table>
  </div>
  )}

export default Orders