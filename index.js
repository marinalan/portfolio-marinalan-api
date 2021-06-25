const express = require('express');
const server = express();
//const jwt = require('express-jwt');
//const jwksRsa = require('jwks-rsa');

async function runServer() {
  await require('./db').connect();

  server.use(express.json());

  server.use('/api/v1/portfolios', require('./routes/portfolios'));
  server.use('/api/v1/blogs', require('./routes/blogs'));

  const PORT = parseInt(process.env.PORT, 10) || 3001;
  server.listen(PORT, (err) => {
    if (err) console.error(err);
    console.log('Server ready on port:', PORT);
  })
}

runServer();
