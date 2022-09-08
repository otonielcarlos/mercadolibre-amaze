import React, {useContext} from 'react'
import './Orders.css'
import {Context} from '../Context/Context'
// import {getTodayAndYesterday} from '../utils/utils'

function AsusOrders(){

 const {asusOrders} = useContext(Context)

const displayOrders = asusOrders.map((order, key) => {
  const perdida = Number(order.total_tienda) - Number(order.total_mercadopago)
  return (
    <tr key={key}>
      <td>{order.customerpo.toUpperCase()}</td>
      <td>{order.nv}</td>
      <td>{order.mercadopago_id}</td>
      <td>{order.date.split('T')[0]}</td>
      <td>$ {order.total_tienda}</td>
      <td>$ {order.total_mercadopago}</td>
      <td>$ {order.total_mercadopago}</td>
      <td>$ {perdida > 0 ? 0 : perdida}</td>
      <td>{order.cantidad}</td>
      <td>{order.skus}</td>
      <td>{order.productos}</td>
      <td>{order.nombre}</td>
      <td>{order.email}</td>
    </tr>
  )
})


  return(
  <div className='orders'>
  {/* <h3>Ordenes del {yesterday} 1:00pm PE al {today} 12:59pm PE *** DEMO EN DESARROLLO***</h3> */}
  <table>
    <tbody>
      <tr>
        <th>OC</th>
        <th>Nota de Venta</th>
        <th>MPID</th>
        <th>Fecha de Compra</th>
        <th>Total Tienda</th>
        <th>Total Mercadopago</th>
        <th>Total Soles</th>
        <th>Pérdida</th>
        <th>Cantidad</th>
        <th>Skus</th>
        <th>Productos</th>
        <th>Nombre</th>
        <th>Email</th>
      </tr>
      {displayOrders}
    </tbody>
  </table>
  </div>
  )}

export default AsusOrders