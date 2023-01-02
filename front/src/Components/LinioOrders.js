import React, {useContext} from 'react'
import './Orders.css'
import {Context} from '../Context/Context'
import {InputDates} from "../Components/InputDates"
import axios from 'axios'

function LinioOrders(){

 const {linioOrders} = useContext(Context)

async function onClickButtonDisabled(e) {
  if(e.currentTarget.disabled) {
    return
  } else {

    e.currentTarget.disabled = true
    e.target.hidden = true
    let data = {
      order_id: e.target.className
    }
    await axios.post('https://appleamaze.herokuapp.com/pe/v1/orders/linio/update/factura', data)
    console.log(e.target.className)
    // console.log(e)

  }
  
}

const displayOrders = linioOrders.map((order, key) => {
  const toBoolean = order.disabled === "true"
  const pointer = toBoolean ? '' : 'pointer'
  let colorButton = toBoolean ? '#198754' : '#DC3545'
  const fecha = order.date.split('T')[0]
  return (
    <tr key={key}>
      <td>{order.customerpo.toUpperCase()}</td>
      <td>{order.nv}</td>
      <td>{order.cantidad}</td>
      <td>{order.total_tienda.toLocaleString()}</td>
      <td>{order.skus}</td>
      <td>{order.productos}</td>
      <td>{order.nombre}</td>
      <td>{order.email}</td>
      <td>{order.direccion}</td>
      <td>{fecha}</td>
      <td>{order.require_factura}</td>
      <td>{order.document_number}</td>
      <td><button disabled={toBoolean} style={{backgroundColor: colorButton, cursor: pointer}} className={order.order_id} onClick={onClickButtonDisabled}>Actualizar Pedido</button></td>
      
    </tr>
  )
})

  return(
  <div className='orders'>
    <InputDates marca="linio"/>
  <table>
    <tbody>
      <tr>
        <th>OC</th>
        <th>Nota de Venta</th>
        <th>Total Tienda</th>
        <th>Skus</th>
        <th>Cantidad</th>
        <th>Productos</th>
        <th>Nombre</th>
        <th>Email</th>
        <th>Dirección</th>
        <th>Fecha</th>
        <th>Requiere Factura</th>
        <th>Número</th>
        <th>Factura</th>
      </tr>
      {displayOrders}
    </tbody>
  </table>
  </div>
  )}

export default LinioOrders