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



*More info in progress...
## Contact
tom@bluediamondinnovation.com
