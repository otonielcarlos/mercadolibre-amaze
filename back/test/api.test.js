const request = require('supertest');
const assert = require('assert');
const app = require('../server.js');
const { getOrders } = require('../src/func');
const { sendMessage } = require('../src/message');
const { findOrder, saveNewOrderID } = require('../src/db');
const { getDate } = require('../src/date');
const { sendMail } = require('../src/mailer');

describe(' /POST callbacks for orders and messages notifications', () => {
  it('responds with status 200', done => {
    const data = {
      resource: '/orders/4716241871',
      user_id: 468424240,
      topic: 'orders_v2',
      application_id: 5503910054141466,
      attempts: 1,
      sent: '2019-10-30T16:19:20.129Z',
      received: '2019-10-30T16:19:20.106Z',
    };

    request(app)
      .post('/callbacks')
      .send(data)
      .set('Accept', 'application/json')
      .expect(200)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });

  it('function findOrder returns an ID found', async () => {
    let resource = "orders/4759522622"
    let id = resource.slice(7, resource.length);
    let res = await findOrder(id);
    assert.strictEqual(res, '4759522622');
  })
  it('function findOrder returns undefinded when not found', async () => {
    let res = await findOrder('4671168205')
    assert.strictEqual(res, 'undefined');
  })

  // it('function saveOrderID saves a new id', async () => {
  //   let res = await saveNewOrderID('4671168205')
  //   assert.strictEqual( res, true);
  // })
  
  it('function getDate retrieves the date of the order posted on /callbacks via MLs API', async () => {
    let resource = "/orders/4759522622"
    let res = await getDate(resource);
    const saveDate = new Date();
    saveDate.setHours(saveDate.getHours() - 5);
     let today = saveDate.toISOString().split('T')[0];
    console.log(res, today)
    assert.strictEqual(res, today);

  })

  it('sends email notification when message has been sent with success', async () => {
    let resource = "orders/4759522622"
    let id = resource.slice(7, resource.length);
    let mailResponse = await sendMail(id)
    assert.strictEqual(mailResponse, true);
  })
});
