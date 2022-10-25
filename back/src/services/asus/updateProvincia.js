const { statusUpdateAsus } = require('./statusUpdateAsus')
const {updateTrackingNumberAndStatus} = require('./updateTracking')
const orders =[
  // {delivery: 'WYB150011760', ingramOrder: '7092817511'},
  {delivery: 'WYB150011795', ingramOrder: '7092783074'},
  {delivery: 'WYB150011809', ingramOrder: '7092830950'},
  {delivery: 'WYB150011779', ingramOrder: '7092831086'},
  {delivery: 'WYB150030005', ingramOrder: '7092877233'},
  {delivery: 'WYB150029971', ingramOrder: '7092891617'},
  {delivery: 'WYB150030021', ingramOrder: '7092866487'},
  {delivery: 'WYB150134226', ingramOrder: '7092940102'},
  {delivery: 'WYB150113660', ingramOrder: '7092935549'},
  {delivery: 'WYB150029953', ingramOrder: '7092940331'},
  {delivery: 'WYB150134277', ingramOrder: '7092938799'},
  {delivery: 'WYB150134218', ingramOrder: '7092955524'},
  {delivery: 'WYB150136695', ingramOrder: '7092957492'},
  {delivery: 'WYB150134242', ingramOrder: '7092968762'},
  {delivery: 'WYB150354072', ingramOrder: '7092986646'},
  {delivery: 'WYB150354056', ingramOrder: '7092990775'},
  {delivery: 'WYB150354064', ingramOrder: '7093004126'},
  {delivery: 'WYB150492467', ingramOrder: '7093030049'},
  {delivery: 'WYB150822440', ingramOrder: '7093099572'},
  {delivery: 'WYB150822424', ingramOrder: '7093085722'},
  {delivery: 'WYB150929792', ingramOrder: '7093341654'},
  {delivery: 'WYB150929784', ingramOrder: '7093397011'},
  {delivery: 'WYB150929237', ingramOrder: '7093399850'},
  {delivery: 'WYB150929245', ingramOrder: '7093395444'},
  {delivery: 'WYB151035760', ingramOrder: '7093493839'},
  {delivery: 'WYB151035752', ingramOrder: '7093504578'},
  {delivery: 'WYB151141951', ingramOrder: '7093030635'},
  {delivery: 'WYB151141935', ingramOrder: '7093575786'},
  {delivery: 'WYB151141943', ingramOrder: '7093568365'},
  {delivery: 'WYB151344471', ingramOrder: '7093651652'},
  {delivery: 'WYB151344461', ingramOrder: '7093649862'},
  {delivery: 'WYB151344488', ingramOrder: '7093598094'},
  {delivery: 'WYB151344496', ingramOrder: '7093695920'},
  {delivery: 'WYB151557201', ingramOrder: '7093703503'},
  {delivery: 'WYB151557252', ingramOrder: '7093730363'},
  {delivery: 'WYB151781391', ingramOrder: '7093835074'},
  {delivery: 'WYB151781497', ingramOrder: '7093853005'},
]
async function manualUpdate() {
  for(let order of orders) {
    try {
      const {delivery, ingramOrder} = order
      await updateTrackingNumberAndStatus({delivery: delivery, ingramOrder: ingramOrder, comment:`Número de rastreo de tu pedido ${delivery}`, notify: 1})

    } catch (error) {
      console.log(error)
    }
  }

}
// manualUpdate()
const doneOrders = [
{order: '12307', status: 'Done'},
{order: '12311', status: 'Done' },
{order: '12320', status: 'Done' },
{order: '12339', status: 'Done' },
{order: '12403', status: 'Done' },
{order: '12406', status: 'Done' },
{order: '12431', status: 'Done' },
{order: '12426', status: 'Done' },
{order: '12446', status: 'Done' },
{order: '12447', status: 'Done' },
{order: '12453', status: 'Done' },
{order: '12477', status: 'Done' },
{order: '12483', status: 'Done' },
{order: '12497', status: 'Done' },
{order: '12521', status: 'Done' },
{order: '12527', status: 'Done' },
{order: '12572', status: 'Done' },
{order: '12591', status: 'Done' },
{order: '12644', status: 'Done' },
{order: '12645', status: 'Done' },
{order: '12701', status: 'Done' },
{order: '12712', status: 'Done' },
{order: '12718', status: 'Done' },
{order: '12722', status: 'Done' },
{order: '12748', status: 'Done' },
{order: '12759', status: 'Done' },
{order: '12797', status: 'Done' },
{order: '12799', status: 'Done' },
{order: '12801', status: 'Done' },
{order: '12415', status: 'Done' },
{order: '12831', status: 'Done' },
{order: '12838', status: 'Done' },
{order: '12841', status: 'Done' },
{order: '12848', status: 'Done' },
{order: '12875', status: 'Done' },
{order: '12910', status: 'Done' },
{order: '12936', status: 'Done' },
]

async function manualUpdateDone() {
  for(let or of doneOrders) {
    try {
      const {order, status} = or
      await statusUpdateAsus({order: order, status: status, comment: 'Pedido Entregado', notify: 1})

    } catch (error) {
      console.log(error)
    }
  }

}

manualUpdateDone()