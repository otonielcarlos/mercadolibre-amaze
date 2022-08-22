# Amaze Server PE

This is part of the code I developed in order to connect Ingram Micro stock, orders and prices to marketplaces. This server is designed with Node.js, Express.js, MySQL. Documentation not included yet, but some specifics are mentioned below. 

Routes are connected to some marketplaces and ecommerce platforms:

· Mercadolibre

· Linio

· Magento (coming soon)

· Shopify (Coming soon)

All of these services, serve their own purpose for different brands in Peru, including: Apple, GoPro, Asus 



## Endpoints

```javascript
app.use("/pe/v1/orders", v1Orders)
app.use("/pe/v1/stock", v1Stock)
```
These are the main endpoints, decided to use _/pe/v1/orders_ instead of using _/api/v1/order_ to differentiate between countries. Currently we are working in 4 countries: Mexico, Peru, Colombia and Canada.


## Routes
This is an example of the orders route, controllers and services handle all the data treatment in order to create a new order in Ingram via API
```javascript

//GET TODOS LAS ORDENES
router.get('/mercadolibre/apple/all', getAllOrdersFromMercadolibreApple)

//ENVIAR ORDEN CON ID
router.get('/mercadolibre/apple/:orderid', orderFromMercadolibreWithID)

// CALLBACK DE MERCADOLIBRE ORDENES
router.post('/mercadolibre/apple', ordersFromMercadolibreToIM)

// WEBHOOK DE GOPRO
router.post('/gopro/new', sendProcessingOrdersToIM)

```

## Controllers
An example of what's going on with the controller for a new order in GoPro

```javascript

async function sendProcessingOrdersToIM(req, res) {
  const [data, error] = await usePromise(ordersService.sendProcessingOrders)
  res.status(200).json(data)
}
```
The ```usePromise```is a helper function to pass any pending promise, so it takes cares to fulfilling the promise and returning the promised value. If any ```
error```thrown will be handled as well on this helper function. 

All controllers use the ```usePromise``` helper in order to avoid trying blocks of code and catching errors.

An example of ```usePromise``` can be seen below:
```javascript

async function usePromise(promiseFunction, params = null){  //function expects 1 pending promise
  try {
    if(params === null){                   // If no params passed
      const data = await promiseFunction() // wait to resolve the promise
      return [data, null]                  // if successful return data, and null if no error
    } else {
      const data = await promiseFunction(params) //If params passed 
      return [data, null]                        //if successful return data, and null if no error
    }
  } catch (error) {
    return [null, error]                  //if any error catched, return null for any data, and error
  }
}

// When calling this function inside async 
 const [data, error] = await usePromise(promiseToBeResolved)
```

## Linio
For getting the data from a new Linio Order, a hashed signature needs to be passed within the request. I used the ```createHmac``` from the ```crypto```  module. 
```` javascript

const concatenated = `Action=GetOrder&Format=JSON&OrderId=${orderId}&Timestamp=${encodedDate}&UserID=${LINIO_USER}&Version=1.0`

const hashOrder = createHmac('sha256', `${SECRET_LINIO}`)
                  .update(concatenated)
                  .digest('hex')

return {url: concatenated, hash: hashOrder}
````
Now that I get my signature, I'll proceed to do 2 request to Linio: The first one is to pulled the delivery address from client in the order. The second request, is to get the product information from the order (quantity and sku)

````javascript

//Get signature hashed for an Order Delivery Request
const {url, hash} = getSignature(orderId, 'GetOrder')

//Get signature hashed for a Products Order Request
const {urlItems, hashItems} = getSignature(orderId, 'GetOrderItems') 

//Create the 2 url with the signature added
const getUrl = 'https://sellercenter-api.linio.com.pe?' + url + '&Signature=' + hash 
const itemsUrl = 'https://sellercenter-api.linio.com.pe?' + urlItems + '&Signature=' + hashItems
const headers =  { 
      headers: {
        'Accept': 'application/json'
      }
    }

//Request for the order delivery info
const order = await axios.get(getUrl, headers)

//Request for the order products info
const items = await axios.get(itemsUrl, headers)

````



*More info in progress...
## Contact
tom@bluediamondinnovation.com
