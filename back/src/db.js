const mysql = require('mysql2');
// const { resource } = require('../server');
const log = console.log;

const db = mysql.createPool({
  connectionLimit: 10,
  host: 'us-cdbr-east-04.cleardb.com',
  user: 'b5335c6b8fd89c',
  password: '57f435d5',
  database: 'heroku_7e25e9ab702a7da',
  multipleStatements: true,
});
// const db_last = mysql.createPool({
//   host: '173.231.198.187',
//   user: 'bluediamond_appleperu',
//   password: '.-.bdi-2020.-.',
//   database: 'bluediamond_appleperu',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

const findOrder = id => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT orderid from orders WHERE orderid = '${id}'`,
      (err, results) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        let result = results.length === 0 ? undefined : results[0].orderid;
        resolve(`${result}`);
      }
    );
  });
};

const saveNewOrderID = id => {
  const saveDate = new Date();
  saveDate.setHours(saveDate.getHours() - 5);
  let day = saveDate.toISOString().split('T')[0];
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO orders VALUES ('${id}', '${day}')`,
      (err, results) => {
        if (err) {
          reject(false);
        } else {
          resolve(true);
        }
      }
    );
  });
};

const saveIngram = (nv, customerpo, trackingNumber, id) => {
  const saveDate = new Date();
  saveDate.setHours(saveDate.getHours() - 5);
  let day = saveDate.toISOString().split('T')[0];
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO ingramorders VALUES ('${nv}', '${id}','${customerpo}','${trackingNumber}', 'false','${day}')`,
      (err, results) => {
        if (err) {
          console.log('err saving ingramorders ', err);
          reject(false);
        } else {
          resolve(true);
        }
      }
    );
  });
};

const getNullTickets = () => {
  return new Promise((resolve, reject) => {
    let query = "SELECT * from ingramorders WHERE tracking = 'null'";
    db.query(query, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

const getTickets = () => {
  return new Promise((resolve, reject) => {
    let query =
      "SELECT nv as 'nota_de_venta', id as 'id_mercadolibre', customerpo, tracking as 'guia_rastreo', date as 'fecha' from ingramorders WHERE display = 'true' ORDER BY date DESC";
    db.query(query, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

const updateTracking = (trackingNumber, id) => {
  return new Promise((resolve, reject) => {
    let query = `UPDATE ingramorders SET tracking = '${trackingNumber}', display = 'true' WHERE id = ${id}`;
    db.query(query, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

const setCancel = id => {
  let query = `UPDATE ingramorders SET tracking = 'cancelled' WHERE id = ${id}`;
  db.query(query, (err, results) => {
    if (err) log(err);
    log(results);
  });
};

const setDisplay = id => {
  return new Promise((resolve, reject) => {
    let query = `UPDATE ingramorders SET display = "false" WHERE customerpo = '${id}'`
    db.query(query, (err, results) => {
      if(err) console.log(err)
    if(results.affectedRows === 1) {
      resolve(1)
    } else {
      resolve(0)
    }
    })
  })
}

const showAll = () => {
  return new Promise((resolve, reject) => {
    let query = "SELECT nv as 'nota_de_venta', id as 'id_mercadolibre', customerpo, tracking as 'guia_rastreo', date as 'fecha' from ingramorders WHERE tracking IS NOT NULL and tracking != 'cancelled' ORDER BY date DESC"
    db.query(query, (err, results) => {
      if(err) console.log(err);
      resolve(results);
    })
  })
}

module.exports = {
  db,
  findOrder,
  saveNewOrderID,
  saveIngram,
  getNullTickets,
  updateTracking,
  setCancel,
  getTickets,
  setDisplay,
  showAll
};
