import React, {useContext} from 'react'
import './Orders.css'
import {Context} from '../Context/Context'
import {InputDates} from "../Components/InputDates"
// import axios from 'axios'
// import {image} from '..'
// import {getTodayAndYesterday} from '../utils/utils'

function GoproOrders(){

  // const [isButtonDisabled, setIsButtonDisabled] = useState(false)
 const {goproOrders} = useContext(Context)

// async function onClickButtonDisabled(e) {
//   if(e.currentTarget.disabled) {
//     return
//   } else {

//     e.currentTarget.disabled = true
//     e.target.hidden = true
//     let data = {
//       order_id: e.target.className
//     }
//     await axios.post('https://appleamaze.herokuapp.com/pe/v1/orders/asus/update/factura', data)
//     console.log(e.target.className)
//     console.log(e)

//   }
  
// }

const displayOrders = goproOrders.map((order, key) => {
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
      {/* <td  ><button disabled={toBoolean} style={{backgroundColor: colorButton}} className={order.order_id} onClick={onClickButtonDisabled} >Actualizar Pedido</button></td> */}
      
    </tr>
  )
})


  return(
  <div className='orders'>
    <InputDates marca="gopro"/>
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
        {/* <th>Factura</th> */}
      </tr>
      {displayOrders}
    </tbody>
  </table>
  </div>
  )}

export default GoproOrders