//  sku       itemid     stock
// 4348220	MPE446605201	84	
// 3075291	MPE446605260	316	

const axios = require('axios');
const { response } = require('express');
const { token } = require('./ml');
const { db } = require('./db')
const fs = require('fs');
const file = fs.createWriteStream('MLitems.txt');
const last = ['MPE446588366',
'MPE446588422',
'MPE446588454',
'MPE446588458',
'MPE446588472',
'MPE446588483',
'MPE446588634',
'MPE446589106',
'MPE446599268',
'MPE446599342',
'MPE446599423',
'MPE446599665',
'MPE446600094',
'MPE446600170',
'MPE446600246',
'MPE446600326',
'MPE446604858',
'MPE446604955',
'MPE446604968',
'MPE446605089',
'MPE446605121',
'MPE446605201',
'MPE446605260',
'MPE446647476',
'MPE446647631',
'MPE446654020',
'MPE446654299',
'MPE55002790',
'MPE55002795']

// const newToken = token();

// Promise.resolve(newToken)
//   .then(token => {
//     console.log(token);
//     for (let i in last) {
//       // console.log(last[i]);
//       let url = `https://api.mercadolibre.com/items/${last[i]}/variations`;
//            axios
//         .get(url, { headers: { Authorization: `Bearer ${token}` } })
//         .then(res => {
//           console.log(`${last[i]}, ${res.data[0].id}\n`)
//           file.write(`${last[i]}, ${res.data[0].id}\n`)})
//         // .then(res => console.log(`${res.data[0].id}`))
//         .catch(err => console.log(err));
//     }
//   })
//   .catch(err => console.log(err));

const items = [{item: 'MPE446600170',var:  '89322460646'},
{item: 'MPE446599665',var:  '89316923234'},
{item: 'MPE446604968',var:  '89438700796'},
{item: 'MPE446589106',var:  '89188796798'},
{item: 'MPE446588422',var:  '89183132130'},
{item: 'MPE446588366',var:  '89182721654'},
{item: 'MPE446588458',var:  '89183368193'},
{item: 'MPE446588454',var:  '89183242210'},
{item: 'MPE446600246',var:  '89323045303'},
{item: 'MPE446588472',var:  '89183525138'},
{item: 'MPE446604955',var:  '89438233983'},
{item: 'MPE446588483',var:  '89183604926'},
{item: 'MPE446605121',var:  '89441609918'},
{item: 'MPE446647476',var:  '89706721344'},
{item: 'MPE446600326',var:  '89323600075'},
{item: 'MPE446599423',var:  '89313422448'},
{item: 'MPE446604858',var:  '89436326896'},
{item: 'MPE446654299',var:  '89710951026'},
{item: 'MPE446605089',var:  '89440879573'},
{item: 'MPE446654020',var:  '89710813900'},
{item: 'MPE446599342',var:  '89312101389'},
{item: 'MPE55002790', var: '173537375230'},
{item: 'MPE446600094',var:  '89321644119'},
{item: 'MPE55002795', var: '173537376806'},
{item: 'MPE446599268',var:  '89311162047'},
{item: 'MPE446647631',var:  '89707104490'},
{item:'MPE446588634', var: '89184251967'}
]

for(let i in items){
  db.query(`UPDATE appleml SET variationid = '${items[i].var}' WHERE itemid = '${items[i].item}'`)
}

