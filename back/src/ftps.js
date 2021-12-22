const FTPS = require('ftps');
const ftps = new FTPS({
  host: 'ftps://amaze.com.pe', // required
  username: 'amazecom', // Optional. Use empty username for anonymous access.
  password: '6vB2YVxW5=%r', // Required if username is not empty, except when requiresPassword: false
  protocol: 'ftps', // Optional, values : 'ftp', 'sftp', 'ftps', ... default: 'ftp'
  // protocol is added on beginning of host, ex : sftp://domain.com in this case
  timeout: 30, // Optional, Time before failing a connection attempt. Defaults to 10
});
ftps.cd('back/src/file.txt').addFile('./public_html').exec(console.log);
