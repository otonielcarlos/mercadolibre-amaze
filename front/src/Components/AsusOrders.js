import React, {useContext} from 'react'
import './Orders.css'
import {Context} from '../Context/Context'
import {InputDates} from "../Components/InputDates"
// import {image} from '..'
// import {getTodayAndYesterday} from '../utils/utils'

function AsusOrders(){

  // const [isButtonDisabled, setIsButtonDisabled] = useState(false)
 const {asusOrders} = useContext(Context)

function onClickButtonDisabled(e) {
  e.currentTarget.disabled = true
  console.log('button clicked')
}

const displayOrders = asusOrders.map((order, key) => {
  const perdida = Number(order.total_tienda) - Number(order.total_mercadopago)
  return (
    <tr key={key}>
      <td>{order.customerpo.toUpperCase()}</td>
      <td>{order.nv}</td>
      <td>{order.mercadopago_id}</td>
      <td>{order.date.split('T')[0]}</td>
      <td>{order.total_tienda.toLocaleString()}</td>
      <td>{order.total_mercadopago.toLocaleString()}</td>
      <td>{order.total_mercadopago.toLocaleString()}</td>
      <td>{perdida > 0 ? 0 : perdida.toLocaleString()}</td>
      <td>{order.cantidad}</td>
      <td>{order.skus}</td>
      <td>{order.productos}</td>
      <td>{order.nombre}</td>
      <td>{order.email}</td>
      <td>{order.direccion}</td>
      <td>{order.document_type}</td>
      <td>{order.document_number}</td>
      <td><button onClick={onClickButtonDisabled}><img alt="" src='https://amaze.com.pe/img/confirmation.png' style={{height: 15, width: 15} }></img></button></td>
    </tr>
  )
})


  return(
  <div className='orders'>
    <InputDates />
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
        <th>Dirección</th>
        <th>Documento</th>
        <th>Número</th>
        <th>Factura</th>
      </tr>
      {displayOrders}
    </tbody>
  </table>
  </div>
  )}

export default AsusOrders