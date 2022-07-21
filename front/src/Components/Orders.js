import React, {useContext} from 'react'
import './Orders.css'
import {Context} from '../Context/Context'
// import {getTodayAndYesterday} from '../utils/utils'

function Orders(){

 const {orders} = useContext(Context)

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
  {/* <h3>Ordenes del {yesterday} 1:00pm PE al {today} 12:59pm PE *** DEMO EN DESARROLLO***</h3> */}
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