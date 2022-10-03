const {getTodayAndTime} = require('../../helpers/getTodayAndYesterday')
const {default: axios} = require('axios')
const {getTokenAsus} = require('../../tokens/magento')

async function statusUpdateAsus({order, status, comment}) {

  const token = await getTokenAsus()
  const postUrl = `https://pe.store.asus.com/index.php/rest/V1/orders/${order}/comments`
  const [day, time] = getTodayAndTime()
  let dataForUpdate = {
    statusHistory: {
      comment: comment,
      created_at: `${day} ${time}`,
      parent_id: order,
      is_customer_notified: 0,
      is_visible_on_front: 0,
      status: `${status}`,
    },
  }
  const orderStatus = await axios.post(postUrl, dataForUpdate, { headers: { 'Authorization': `Bearer ${token}` }})

  return orderStatus.data
}

module.exports = {
  statusUpdateAsus
}