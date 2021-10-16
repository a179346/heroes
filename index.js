require('dotenv').config();

const { env } = require('./config');

const app = require('./app');

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('listening on port ' + env.PORT);
});