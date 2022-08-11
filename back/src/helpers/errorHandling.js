async function usePromise(promiseFunction, params = null){
  try {
    if(params === null){
      const data = await promiseFunction()
      return [data, null]
    } else {
      // let functionParams = ''
      // params.forEach(param => functionParams += `,${param}`)
      const data = await promiseFunction(params)
      return [data, null]
    }
  } catch (error) {
    return [null, error]
  }
}

module.exports = usePromise