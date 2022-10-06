const { statusUpdateAsus } = require('./statusUpdateAsus')
const {updateTrackingNumberAndStatus} = require('./updateTracking')
const orders =[{delivery: '8090483682',	ingramOrder:	'7091351288'},
{delivery: '8090483683',	ingramOrder:	'7091441755'},
{delivery: '8090479593',	ingramOrder:	'7091452763'},
{delivery: '8090419761',	ingramOrder:	'7091454772'},
{delivery: '8090193667',	ingramOrder:	'7091463796'},
{delivery: '8090265168',	ingramOrder:	'7091483463'},
{delivery: '8090265170',	ingramOrder:	'7091485939'},
{delivery: '8090601745',	ingramOrder:	'7091520803'},
{delivery: '8090600358',	ingramOrder:	'7091526298'},
{delivery: '8090601139',	ingramOrder:	'7091536011'},
{delivery: '8090602286',	ingramOrder:	'7091562183'},
{delivery: '8090651986',	ingramOrder:	'7091500568'},
{delivery: '8090649947',	ingramOrder:	'7091610565'},
{delivery: '8090649434',	ingramOrder:	'7091611788'},
{delivery: '8090649435',	ingramOrder:	'7091611920'},
{delivery: '8090649948',	ingramOrder:	'7091624727'},
{delivery: '8090706734',	ingramOrder:	'7091661576'},
{delivery: '8090599211',	ingramOrder:	'7091684850'},
{delivery: '8090806646',	ingramOrder:	'7091775388'},
{delivery: '8090733848',	ingramOrder:	'7091717004'},
{delivery: '8090910326',	ingramOrder:	'7091820126'},
{delivery: '8090910327',	ingramOrder:	'7091825826'},
{delivery: '8090733851',	ingramOrder:	'7091832241'},
{delivery: '8090910328',	ingramOrder:	'7091834070'},
{delivery: '8090880434',	ingramOrder:	'7091872924'},
{delivery: '8090925500',	ingramOrder:	'7091942889'},
{delivery: '8090926225',	ingramOrder:	'7091968788'},
{delivery: '8091060646',	ingramOrder:	'7092071181'},
{delivery: '8090507290',	ingramOrder:	'7092108922'},
{delivery: '8090507291',	ingramOrder:	'7092121234'},
{delivery: '8091146768',	ingramOrder:	'7092122155'},
{delivery: '8091224782',	ingramOrder:	'7092123947'},
{delivery: '8091224783',	ingramOrder:	'7092146386'},
{delivery: '8091228212',	ingramOrder:	'7092157611'},
{delivery: '8091107896',	ingramOrder:	'7092244729'},
{delivery: '8091260965',	ingramOrder:	'7092251868'},
{delivery: '8091260966',	ingramOrder:	'7092289274'},
{delivery: '8091242878',	ingramOrder:	'7092289840'},
{delivery: '8091260967',	ingramOrder:	'7092293618'},
{delivery: '8091329658',	ingramOrder:	'7092282709'}]
async function manualUpdate() {
  for(let order of orders) {
    try {
      const {delivery, ingramOrder} = order
      await updateTrackingNumberAndStatus({delivery: delivery, ingramOrder: ingramOrder})

    } catch (error) {
      console.log(error)
    }
  }

}

const doneOrders = [
{order: '11260', status: 'Done'},
{order: '11254', status: 'Done'},
{order: '11270', status: 'Done'},
{order: '11261', status: 'Done'},
{order: '11292', status: 'Done'},
{order: '11281', status: 'Done'},
{order: '11285', status: 'Done'},
{order: '11330', status: 'Done'},
{order: '11341', status: 'Done'},
{order: '11337', status: 'Done'},
{order: '11384', status: 'Done'},
{order: '11416', status: 'Done'},
{order: '11417', status: 'Done'},
{order: '11411', status: 'Done'},
{order: '11408', status: 'Done'},
{order: '11438', status: 'Done'},
{order: '11450', status: 'Done'},
{order: '11470', status: 'Done'},
{order: '11524', status: 'Done'},
{order: '11580', status: 'Done'},
{order: '11561', status: 'Done'},
{order: '11559', status: 'Done'},
{order: '11563', status: 'Done'},
{order: '11566', status: 'Done'},
{order: '11585', status: 'Done'},
{order: '11626', status: 'Done'},
{order: '11631', status: 'Done'},
{order: '11687', status: 'Done'},
{order: '11697', status: 'Done'},
{order: '11704', status: 'Done'},
{order: '11715', status: 'Done'},
{order: '11717', status: 'Done'},
{order: '11718', status: 'Done'},
{order: '11727', status: 'Done'},
{order: '11762', status: 'Done'},
{order: '11797', status: 'Done'},
{order: '11831', status: 'Done'},
{order: '11828', status: 'Done'},
{order: '11838', status: 'Done'},
{order: '11851', status: 'Done'}]

async function manualUpdateDone() {
  for(let or of doneOrders) {
    try {
      const {order, status} = or
      await statusUpdateAsus({order: order, status: status})

    } catch (error) {
      console.log(error)
    }
  }

}

manualUpdateDone()