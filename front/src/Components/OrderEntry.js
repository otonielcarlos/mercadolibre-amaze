import React, {useState} from 'react'
import axios from 'axios'

function OrderEntry(){

  const textAreaPlaceholer = `
  MLAPPLE_2000003876695228
  MLAPPLE_2000003876884518
  MLAPPLE_2000003876812226
  `
  
  const [customerpo, setCustomerpo ] = useState([])
  const [listOfResponses, setListOfResponses] = useState([])
  
  async function getCustomerpo(customerpo){ 
    try {


      for(let order of customerpo){
        console.log(order)
        // const url = `http://localhost:4000/pe/v1/orders/mercadolibre/apple/${order}`
        const url = `https://appleamaze.herokuapp.com/pe/v1/orders/mercadolibre/apple/${order}`
        // console.log(url)
          const orderResponse = await axios.get(url , {headers:{ 'Content-Type' : 'application/json' }})
          // @ts-ignore
          setListOfResponses((prev) => [...prev, orderResponse.data])
      }
    } catch (error) {
      
      console.log(error)
    }
  
  }
  
  function onChangeText(event){
    const {value} = event.target
    const arrayOfcustomerpos = value.split('\n')
  
    setCustomerpo(() =>  arrayOfcustomerpos)
  }
  
  const responses = listOfResponses.map((order, key) => {
    const {globalorderid, customerPO} = order
    return (
      <li key={key}>{customerPO} - {globalorderid}</li>
    )
  })
  
    return (
      <div className="App" >
          <div className="div-left">
              <h3>Introduce los customerpo </h3>
            <div>
                <textarea placeholder={textAreaPlaceholer} onChange={onChangeText}></textarea>
                <div>
                  <button onClick={() => getCustomerpo(customerpo)} className="button-6">Enviar</button>
                </div>
            </div>
         </div>
          
          
          <div className="div-right">
            <h2>Responses: </h2>
         
          <ul>
         <div className="responseArea">
            { responses }
        </div>
          </ul>
          </div>
      </div>
    );
  
}

export default OrderEntry